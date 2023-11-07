import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {createClient} from "../data/clients.js" 
import {addDeviceToClient} from "../data/clients.js"
import {getClientById} from "../data/clients.js"





async function main() 
{
    const db = await dbConnection();
    await db.dropDatabase();

    let client1 
    try
    {
        client1 = await createClient("John Doe", 9088881234);
        console.log (client1)
    }
    catch(e)
    {
        console.log(e);
    }

    try
    {
        //deviceType, manufacturer, modelName, modelNumber, serialNumber)=>
        console.log(await addDeviceToClient(client1._id.toString(),"mobile", "Apple", "iPhone12", "A1234", "123456789"));
        // console.log(await getClientById(client1._id.toString()));
    }
    catch(e)
    {
        console.log(e);
    }
 
    console.log("Seed Done!");
   
    await closeConnection();
    


}

main();