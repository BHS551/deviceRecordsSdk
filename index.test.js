import deviceRecordsSdk from "./data/records";

deviceRecordsSdk.insertDeviceRecord({ "test": "test1" }, "mqttpublisherstack-mqttpublisherstore0e6186ff-rkppe6lcxwnw").then((res) => {
    console.log("insertDeviceRecord: ", JSON.stringify(res))
})

deviceRecordsSdk.listDeviceRecords("mqttpublisherstack-mqttpublisherstore0e6186ff-rkppe6lcxwnw").then((res) => {
    console.log("listDeviceRecords: ", JSON.stringify(res))
})
