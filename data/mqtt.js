import * as awsIot from 'aws-iot-device-sdk';
import * as AWS from 'aws-sdk';

const postDeviceMqtt = async (mqttTopic, postMessagePayload) => {
    try {
        const secretsManager = new AWS.SecretsManager();
        const params = {
            SecretId: 'aws_certificates',
        };
        const secretsResult = await secretsManager.getSecretValue(params).promise();
        console.log("SECRETS RESULT: ", { secretsResult })
        console.log("SECRETS RESULT: ", secretsResult.SecretString)
        const secrets = JSON.parse(secretsResult.SecretString);
        const config = {
            privateKey: secrets.AWS_IOT_PRIVATE_KEY,
            clientCert: secrets.AWS_IOT_CERTIFICATE,
            caCert: secrets.AWS_IOT_ROOT_CA,
            clientId: secrets.AWS_IOT_CLIENT_ID,
            host: secrets.AWS_IOT_ENDPOINT
        }
        console.log("device config ", { config })
        let device = new awsIot.device({ ...config });
        const postDeviceMqttResponse = await device.publish(mqttTopic, JSON.stringify(postMessagePayload));
        return postDeviceMqttResponse
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

export default { postDeviceMqtt }