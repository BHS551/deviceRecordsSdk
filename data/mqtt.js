import * as awsIot from 'aws-iot-device-sdk';

const postDeviceMqtt = async (mqttTopic, postMessagePayload) => {
    try {
        const secretsManager = new AWS.SecretsManager();
        const params = {
            SecretId: 'aws_certificates',
        };
        const secrets = JSON.parse((await secretsManager.getSecretValue(params)).secretString);
        const config = {
            keyPath: secrets.AWS_IOT_PRIVATE_KEY_PATH,
            certPath: secrets.AWS_IOT_CERTIFICATE_PATH,
            caPath: secrets.AWS_IOT_ROOT_CA_PATH,
            clientId: secrets.AWS_IOT_CLIENT_ID,
            host: secrets.AWS_IOT_ENDPOINT
        }

        let device = new awsIot.device({ ...config });
        const postDeviceMqttResponse = await device.publish(mqttTopic, JSON.stringify(postMessagePayload));
        return postDeviceMqttResponse
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

export default { postDeviceMqtt }