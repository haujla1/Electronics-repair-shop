import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {createClient} from "../data/clients.js" 
import {addDeviceToClient} from "../data/clients.js"
import {getClientById} from "../data/clients.js"
import {createRepair} from "../data/clients.js"
import {updateRepairAfterRepair} from "../data/clients.js"







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
    // let device1 ;
    // try
    // {
    //     //deviceType, manufacturer, modelName, modelNumber, serialNumber)=>
    //     device1 = await addDeviceToClient(client1._id.toString(),"mobile", "Apple", "iPhone12", "A1234", "123456789");
    //     // console.log(await getClientById(client1._id.toString()));
    // }
    // catch(e)
    // {
    //     console.log(e);
    // }

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
        // let workOrder = {
        //     clientPreferredEmail: "myemail@gmail.com",
        //     clientPreferredPhoneNumber: 9088881234,
        //     issue: "broken screen",
        //     issueOccuranceDate: new Date(),
        //     wasIssueVerified: true,
        //     stepsTakenToReplicateIssue: "has visible crack",
        //     workToBeDone: "replace screen",
        //     conditionOfDevice: "device looks fine besides the broken screen"
        // }
        // // console.log("deviceID: " + device1.Devices[0]._id.toString());
        // let repair1 = await createRepair("654a933f439af6c8af252b98", "654a933f439af6c8af252b99", workOrder);
        // console.log(repair1);

        await updateRepairAfterRepair("654a94f684cbf85558152030","fixed the screen", true)
    }
    catch(e)
    {
        console.log(e);
    }
 
 
    console.log("Seed Done!");
   
    await closeConnection();
    


}

main();