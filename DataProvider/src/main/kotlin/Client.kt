package de.enebnelung

import com.microsoft.azure.sdk.iot.device.*
import com.microsoft.azure.sdk.iot.device.exceptions.IotHubClientException
import com.microsoft.azure.sdk.iot.device.transport.IotHubConnectionStatus
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeoutOrNull
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid


fun main() = Client.run()

object Client {
    var connectionState: IotHubConnectionStatus = IotHubConnectionStatus.DISCONNECTED

    @OptIn(ExperimentalUuidApi::class)
    fun run() = runBlocking {
        val connectionString = Env.connectionString
        val protocol = Env.getProtocol()

        // create client and open connection
        val client = DeviceClient(connectionString, protocol).apply {
            setConnectionStatusChangeCallback(::onConnectionStatusChanged, null)
            setMessageCallback(::onCloudToDeviceMessageReceived, null)
            open(true)
        }

        // wait until connection is established or null
        val connected = withTimeoutOrNull<Boolean>(5.seconds) {
            while (connectionState != IotHubConnectionStatus.CONNECTED) {
                delay(100.milliseconds)
            }
            return@withTimeoutOrNull true
        } == true

        // check for connection
        if (!connected) {
            println("Connection could not be opened. Exiting...")
            return@runBlocking
        } else {
            println("Connected to IoTHub!")
        }

        // --> connection is open

        // send random messages to IoTHub
        repeat(Env.numOfMessages) {
            val temperature = 20 + Math.random() * 10
            val humidity = 30 + Math.random() * 20

            val msgStr = """{"temperature":$temperature,"humidity":$humidity}"""
            val msg = Message(msgStr).apply {
                contentType = "application/json"
                contentEncoding = "utf-8"
                messageId = Uuid.random().toHexString()
            }

            println("Sending message: $msgStr")
            try {
                client.sendEvent(msg, 10000)
                delay(Env.msgDelay.milliseconds)
            } catch (e: IotHubClientException) {
                println("Error sending message: ${e.message}")
            } catch (e: InterruptedException) {
                println("Interrupted while sending message: ${e.message}")
            }
        }

        readln()
        client.close()
    }

    private fun onCloudToDeviceMessageReceived(msg: Message, context: Any?): IotHubMessageResult {
        val msgStr = msg.bytes.toString(Message.DEFAULT_IOTHUB_MESSAGE_CHARSET)
        println("Received message with content: $msgStr")
        // Notify IoT Hub that the message
        return IotHubMessageResult.COMPLETE
    }

    private fun onConnectionStatusChanged(ctx: ConnectionStatusChangeContext) {
        val status: IotHubConnectionStatus = ctx.newStatus
        val statusChangeReason: IotHubConnectionStatusChangeReason = ctx.newStatusReason
        val throwable: Throwable? = ctx.cause

        println(
            """
            CONNECTION STATUS:
                UPDATE: $status
                REASON: $statusChangeReason
                THROWABLE: ${if (throwable == null) "null" else throwable.message}
        """.trimIndent()
        )
        throwable?.printStackTrace()

        connectionState = status
    }
}
