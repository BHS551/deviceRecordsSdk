import deviceRecordsSdk from "./data/records";

const bucket = 'mqttpublisherstack-mqttpublisherstore0e6186ff-rkppe6lcxwnw'

deviceRecordsSdk.insertDeviceRecord({ "testo": "5555" }, bucket).then((res) => {
    console.log("insertDeviceRecord: ", JSON.stringify(res))
    deviceRecordsSdk.listDeviceRecords(bucket).then((res) => {
        console.log("listDeviceRecords: ", JSON.stringify(res))
    })

})