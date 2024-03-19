import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import moment from "moment";

const s3Client = new S3Client({});

const insertDeviceRecord = async (recordData, bucketName) => {
    try {
        const currentDate = moment().format('yyyy-MM-DD').toString()
        console.log(currentDate)
        const command = new PutObjectCommand({
            Bucket: bucketName, Body: JSON.stringify(recordData), Key: `${currentDate}.txt`
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
        console.log(fileKey)
        const command = new GetObjectCommand({
            Bucket: bucketName, Key: `${fileKey}.txt`
        });
        const response = await s3Client.send(command);
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        const str = await response.Body.transformToString();
        console.log(str);
        return str
    } catch (err) {
        console.error(err);
    }
}

export default { listDeviceRecords, insertDeviceRecord }