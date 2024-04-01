import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import moment from "moment";

const s3Client = new S3Client({});

const insertDeviceRecord = async (recordData, bucketName) => {
    try {
        let putCommandPayload = [recordData]
        const currentDate = moment().format('yyyy-MM-DD').toString()
        const dateTime = moment().format('yyyy-MM-DD HH:mm:ss').toString()
        try {
            const deviceRecordsList = await listDeviceRecords(bucketName, currentDate)
            putCommandPayload = [...deviceRecordsList, { ...recordData, dateTime }]
        } catch (err) {
            console.log("bucket object does not exist, creating it...")
        }
        const command = new PutObjectCommand({
            Bucket: bucketName, Body: JSON.stringify(putCommandPayload), Key: `${currentDate}.txt`
        });
        const result = await s3Client.send(command);
        return result
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const listDeviceRecords = async (bucketName, date) => {
    try {
        const fileKey = date || moment().format('yyyy-MM-DD').toString()
        const command = new GetObjectCommand({
            Bucket: bucketName, Key: `${fileKey}.txt`
        });
        const response = await s3Client.send(command);
        return JSON.parse(await response.Body.transformToString())
    } catch (err) {
        console.error(err);
        throw new Error(err)
    }
}

export default { listDeviceRecords, insertDeviceRecord }