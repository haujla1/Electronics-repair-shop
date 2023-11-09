import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {createClient} from "../data/clients.js" 
import {addDeviceToClient} from "../data/clients.js"
import {getClientById} from "../data/clients.js"
import {createRepair} from "../data/clients.js"
import {updateWorkorderAfterRepair} from "../data/clients.js"
import {getWorkorderById} from "../data/clients.js"
import {updateWorkorderAfterPickup} from "../data/clients.js"
import {getClientByPhoneNumber} from "../data/clients.js"








async function main() 
{
    const db = await dbConnection();
    // await db.dropDatabase();

    // let client1 
    // try
    // {
    //     client1 = await createClient("John Doe", 9088881234);
    //     // console.log (client1)
    // }
    // catch(e)
    // {
    //     console.log(e);
    // }
    let device1 ;
    try
    {
        //deviceType, manufacturer, modelName, modelNumber, serialNumber)=>
        // device1 = await addDeviceToClient("654bbd4b63ec4726bdd3adf1","mobile", "samsung", "S20 ultra", "A1234", "123456789");
        // console.log(await getClientById(client1._id.toString()));
        // console.log(await getWorkorderById("654bc02a553cb8ce55c497ce"));
        // console.log(await getClientByPhoneNumber(1234567890));
    }
    catch(e)
    {
        console.log(e);
    }

 /*
    clientPreferredEmail: string, // this is needed in case the customer has a different email that the want for this repair 
	clientPreferredPhoneNumber: number, // this is needed in case the customer has a different number that the want for this repair 
	repairOrderCreationDate: date,
	issue: string,
	issueOccuranceDate: date,
	wasIssueVerified: Boolean,
	stepsTakenToReplicateIssue: string,
	workToBeDone:string,
	conditionOfDevice: string, */
    try
    {
        let workOrder = {
            clientPreferredEmail: "myemail2@gmail.com",
            clientPreferredPhoneNumber: 9088881234,
            issue: "broken camera",
            wasIssueVerified: true,
            stepsTakenToReplicateIssue: "has visible cracks on the camera",
            workToBeDone: "replace the camera, test it",
            conditionOfDevice: "device looks fine besides the broken camera"
        }
        let workOrder2 = {
            clientPreferredEmail: "myemail23333@gmail.com",
            clientPreferredPhoneNumber: 9088881234,
            issue: "broken camera",
            wasIssueVerified: true,
            stepsTakenToReplicateIssue: "has visible cracks on the camera",
            workToBeDone: "replace the camera, test it",
            conditionOfDevice: "device looks fine besides the broken camera"
        }
        // // console.log("deviceID: " + device1.Devices[0]._id.toString());
        // let repair1 = await createRepair("654a933f439af6c8af252b98", "654a933f439af6c8af252b99", workOrder);
        // console.log(repair1);

        // await updateWorkorderAfterRepair("654a94f684cbf85558152030","Replaced the screen, tested the new screen", true)

    //    console.log( await updateWorkorderAfterPickup("654a94f684cbf85558152030", true, "customer was happy with the repair"));
    // await createRepair("654bbd4b63ec4726bdd3adf1", "654bbdddfe23317aca8c71ae", workOrder2)
    // await createRepair("654a933f439af6c8af252b98", "654a933f439af6c8af252b99", workOrder2)
    // await updateWorkorderAfterRepair("654bc02a553cb8ce55c497ce", "replaced the camera, tested it, camera works", true)
        // await updateWorkorderAfterPickup("654bc02a553cb8ce55c497ce", true, "customer was happy with the repair")
    }
    catch(e)
    {
        console.log(e);
    }
 
    // try
    // {
    //     await updateWorkorderAfterRepair
    // }
 
    console.log("Seed Done!");
   
    await closeConnection();
    


}

main();