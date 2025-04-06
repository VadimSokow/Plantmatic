package de.enebnelung

import com.microsoft.azure.sdk.iot.device.IotHubClientProtocol

object Env {
    val connectionString: String get() = System.getenv("CONNECTION_STRING")!!
    private val protocol: String get() = System.getenv("PROTOCOL") ?: "mqtt"
    val numOfMessages: Int get() = System.getenv("NUM_OF_MESSAGES")?.toInt() ?: 1
    val msgDelay: Int get() = System.getenv("MSG_DELAY")?.toInt() ?: 0

    fun getProtocol(): IotHubClientProtocol = when (protocol) {
        "https" -> IotHubClientProtocol.HTTPS
        "amqps" -> IotHubClientProtocol.AMQPS
        "amqps_ws" -> IotHubClientProtocol.AMQPS_WS
        "mqtt" -> IotHubClientProtocol.MQTT
        "mqtt_ws" -> IotHubClientProtocol.MQTT_WS
        else -> throw IllegalArgumentException("Unsupported protocol: [$protocol]")
    }
}
