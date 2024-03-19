import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import moment from "moment";

const s3Client = new S3Client({});

const insertRecord = async (recordData, bucketName) => {
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

export { insertRecord }