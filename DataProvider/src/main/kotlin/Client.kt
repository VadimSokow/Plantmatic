package de.enebnelung

import com.microsoft.azure.sdk.iot.device.ConnectionStatusChangeContext
import com.microsoft.azure.sdk.iot.device.DeviceClient
import com.microsoft.azure.sdk.iot.device.IotHubConnectionStatusChangeReason
import com.microsoft.azure.sdk.iot.device.Message
import com.microsoft.azure.sdk.iot.device.exceptions.IotHubClientException
import com.microsoft.azure.sdk.iot.device.transport.IotHubConnectionStatus
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlin.time.Duration.Companion.milliseconds
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid


fun main() = Client.run()

object Client {
    var connectionState: IotHubConnectionStatus = IotHubConnectionStatus.DISCONNECTED
    val onConnectionStatusChanged: (ConnectionStatusChangeContext) -> Unit = { ctx ->
        val status: IotHubConnectionStatus = ctx.newStatus
        val statusChangeReason: IotHubConnectionStatusChangeReason = ctx.newStatusReason
        val throwable: Throwable? = ctx.cause

        println()
        println("CONNECTION STATUS UPDATE: $status")
        println("CONNECTION STATUS REASON: $statusChangeReason")
        println("CONNECTION STATUS THROWABLE: " + (if (throwable == null) "null" else throwable.message))
        println()

        throwable?.printStackTrace()
        val msg = when (status) {
            IotHubConnectionStatus.DISCONNECTED ->
                "The connection was lost, and is not being re-established." +
                        " Look at provided exception for how to resolve this issue." +
                        " Cannot send messages until this issue is resolved, and you manually re-open the device client"

            IotHubConnectionStatus.DISCONNECTED_RETRYING ->
                """The connection was lost, but is being re-established.
                   Can still send messages, but they won't be sent until the connection is re-established""".trimIndent().replace('\n', ' ')

            IotHubConnectionStatus.CONNECTED -> "The connection was successfully established. Can send messages."
        }
    }

    @OptIn(ExperimentalUuidApi::class)
    fun run() = runBlocking {
        val connectionString = Env.connectionString
        val protocol = Env.getProtocol()

        val client = DeviceClient(connectionString, protocol).apply {
            setConnectionStatusChangeCallback(onConnectionStatusChanged, null)
            open(true)
        }
        println("Client opened")

        for (i in 0 until Env.numOfMessages) {
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

        client.close()
    }
}
