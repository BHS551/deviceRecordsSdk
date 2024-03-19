import { insertRecord } from "./data/records";

insertRecord({ "test": "test1" }, "mqttpublisherstack-mqttpublisherstore0e6186ff-rkppe6lcxwnw").then((res) => {
    console.log(res)
})