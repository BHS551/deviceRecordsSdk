
import mqtt from 'mqtt';
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
            // ca: secrets.HIVEMQ_IOT_ROOT_CA,
            username: secrets.HIVEMQ_IOT_USERNAME,
            password: secrets.HIVEMQ_IOT_PASSWORD,
            host: secrets.HIVEMQ_IOT_ENDPOINT,
            port: secrets.HIVEMQ_IOT_PORT,
        }
        console.log("device config ", { config })
        const client = mqtt.connect(config.host, {
            username: config.username,
            password: config.password,
            port: config.port,
            protocol: 'mqtt'
        });
        client.publish('cluster/messages/node7', 'Hello, HiveMQ!', { properties: { userProperties: { 'Source-Sensor-ID': '2dfxby20v2.1hz;vg' } } }, (err) => {
            if (err) {
                console.error('Failed to publish message:', err);
            } else {
                console.log('Message published with user properties');
            }
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