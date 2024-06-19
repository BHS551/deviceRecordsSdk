
import mqtt from 'mqtt';
import { asyncClient } from 'async-mqtt';
import * as AWS from 'aws-sdk';

const postDeviceMqtt = async (mqttTopic, postMessagePayload) => {
    try {
        const secretsManager = new AWS.SecretsManager();
        const params = {
            SecretId: 'hivemq_certificates',
        };
        const secretsResult = await secretsManager.getSecretValue(params).promise();
        console.log("SECRETS RESULT: ", { secretsResult })
        console.log("SECRETS RESULT: ", secretsResult.SecretString)
        const secrets = JSON.parse(secretsResult.SecretString);
        const config = {
            // key: secrets.HIVEMQ_PRIVATEKEY,
            // cert: secrets.HIVEMQ_IOT_CERTIFICATE,
            ca: secrets.HIVEMQ_IOT_ROOT_CA,
            username: secrets.HIVEMQ_IOT_USERNAME,
            password: secrets.HIVEMQ_IOT_PASSWORD,
            host: secrets.HIVEMQ_IOT_ENDPOINT,
            port: secrets.HIVEMQ_IOT_PORT,
        }
        console.log("device config ", { config })
        const protocol = 'mqtts'
        const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
        const connectUrl = `${protocol}://${config.host}:${config.port}`
        const client = mqtt.connect(connectUrl, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            username: config.username,
            password: config.password,
            reconnectPeriod: 1000,
            ca: config.ca
        });
        client.on("connect", () => {
            client.subscribe("presence", (err) => {
                if (!err) {
                    client.publish("presence", "Hello mqtt");
                }
            });
        });

        client.on("message", (topic, message) => {
            // message is Buffer
            console.log(message.toString());
        });
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

export default { postDeviceMqtt }

// import * as awsIot from 'aws-iot-device-sdk';
// import * as AWS from 'aws-sdk';

// const postDeviceMqtt = async (mqttTopic, postMessagePayload) => {
//     try {
//         const secretsManager = new AWS.SecretsManager();
//         const params = {
//             SecretId: 'aws_certificates',
//         };
//         const secretsResult = await secretsManager.getSecretValue(params).promise();
//         console.log("SECRETS RESULT: ", { secretsResult })
//         console.log("SECRETS RESULT: ", secretsResult.SecretString)
//         const secrets = JSON.parse(secretsResult.SecretString);
//         const config = {
//             privateKey: secrets.AWS_IOT_PRIVATE_KEY,
//             clientCert: secrets.AWS_IOT_CERTIFICATE,
//             caCert: secrets.AWS_IOT_ROOT_CA,
//             clientId: secrets.AWS_IOT_CLIENT_ID,
//             host: secrets.AWS_IOT_ENDPOINT
//         }
//         console.log("device config ", { config })
//         let device = new awsIot.device({ ...config });
//         const postDeviceMqttResponse = await device.publish(mqttTopic, JSON.stringify(postMessagePayload));
//         return postDeviceMqttResponse
//     } catch (err) {
//         console.log(err)
//         throw new Error(err)
//     }
// }