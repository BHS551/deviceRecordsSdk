import awsIot from 'aws-iot-device-sdk';

let device = new awsIot.device({
    keyPath: process.env.AWS_IOT_PRIVATE_KEY_PATH,
    certPath: process.env.AWS_IOT_CERTIFICATE_PATH,
    caPath: process.env.AWS_IOT_ROOT_CA_PATH,
    clientId: process.env.AWS_IOT_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT
});

const postDeviceMqtt = async (postMessagePayload) => {
    try {
        const config = {
            keyPath: process.env.AWS_IOT_PRIVATE_KEY_PATH,
            certPath: process.env.AWS_IOT_CERTIFICATE_PATH,
            caPath: process.env.AWS_IOT_ROOT_CA_PATH,
            clientId: process.env.AWS_IOT_CLIENT_ID,
            host: process.env.AWS_IOT_ENDPOINT
        }
        console.log(config)
        const postDeviceMqttResponse = await device.publish(process.env.AWS_IOT_TOPIC, JSON.stringify(postMessagePayload));
        return postDeviceMqttResponse
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

export default { postDeviceMqtt }