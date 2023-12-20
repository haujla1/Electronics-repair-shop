import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createClient } from "../data/clients.js";
import { addDeviceToClient } from "../data/clients.js";
import { getClientById, getClientByPhoneNumber } from "../data/clients.js";
import { createUser } from "../data/users.js";
import { redisClient } from "../redis.js";
import redis from "redis";
import {
  createRepair,
  updateWorkorderAfterRepair,
  updateWorkorderAfterPickup,
  getWorkorderById,
} from "../data/repairs.js";

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  let client1, client2, device1, device2;
  try {
    client1 = await createClient(
      "John",
      "Doe",
      "9088881234",
      "johndoe@example.com",
      "123 Main St, Anytown, USA",
      30
    );
    //console.log(client1);

    client2 = await createClient(
      "Jane",
      "Smith",
      "1234567890",
      "janesmith@example.com",
      "456 Elm St, Othertown, USA",
      25
    );
    //console.log(client2);

    device1 = await addDeviceToClient(
      client1._id.toString(),
      "mobile",
      "Samsung",
      "S20 Ultra",
      "A1234",
      "123456789"
    );
    //console.log(device1);

    device2 = await addDeviceToClient(
      client2._id.toString(),
      "tablet",
      "Apple",
      "iPad Pro",
      "B5678",
      "987654321"
    );
    //console.log(device2);
  } catch (e) {
    console.log(e);
  }

  try {
    let workOrder1 = {
      clientPreferredEmail: "alternate1@example.com",
      clientPreferredPhoneNumber: "1112223333",
      issue: "broken screen",
      wasIssueVerified: true,
      stepsTakenToReplicateIssue: "visible cracks on screen  ",
      workToBeDone: "screen replacement  ",
      conditionOfDevice: "other than screen, device in good condition  ",
    };

    let workOrder2 = {
      clientPreferredEmail: "alternate2@example.com",
      clientPreferredPhoneNumber: "4445556666",
      issue: "battery issue",
      wasIssueVerified: true,
      stepsTakenToReplicateIssue: "battery drains quickly",
      workToBeDone: "battery replacement",
      conditionOfDevice: "good condition except battery",
    };
    let workOrder3 = {
      clientPreferredEmail: "haujla@stevens.edu",
      clientPreferredPhoneNumber: "4445556666",
      issue: "battery issue",
      wasIssueVerified: true,
      stepsTakenToReplicateIssue: "battery drains quickly",
      workToBeDone: "battery replacement",
      conditionOfDevice: "good condition except battery",
    };

    let repair1 = await createRepair(
      client1._id.toString(),
      device1._id.toString(),
      workOrder1
    );
    // console.log(repair1);
    // console.log(client1);

    let repair2 = await createRepair(
      client2._id.toString(),
      device2._id.toString(),
      workOrder2
    );
    let repair3 = await createRepair(
      client2._id.toString(),
      device2._id.toString(),
      workOrder2
    );

    let repair4 = await createRepair(
      client2._id.toString(),
      device2._id.toString(),
      workOrder2
    );

    let repair5 = await createRepair(
      client2._id.toString(),
      device2._id.toString(),
      workOrder2
    );

    let repair6 = await createRepair(
      client2._id.toString(),
      device2._id.toString(),
      workOrder3
    );

    for (let i = 0; i < 10; i++) {
      let repair = await createRepair(
        client2._id.toString(),
        device2._id.toString(),
        workOrder2
      );
    }




    // console.log(repair2);
    // console.log(client2);

    await updateWorkorderAfterRepair(
      repair6._id.toString(),
      "battery replaced and tested",
      true
    );

    await updateWorkorderAfterRepair(
      repair1._id.toString(),
      "Screen replaced and tested",
      true
    );
    await updateWorkorderAfterPickup(
      repair1._id.toString(),
      true,
      "Customer satisfied with repair"
    );

    await updateWorkorderAfterRepair(
      repair2._id.toString(),
      "Battery replaced and tested",
      true
    );

    await updateWorkorderAfterRepair(
      repair3._id.toString(),
      "Battery replaced and tested",
      true
    );

    await updateWorkorderAfterRepair(
      repair4._id.toString(),
      "Battery replaced and tested",
      true
    );

    await updateWorkorderAfterRepair(
      repair5._id.toString(),
      "Battery replaced and tested",
      true
    );


    await updateWorkorderAfterPickup(
      repair2._id.toString(),
      true,
      "Customer satisfied with repair"
    );
    // console.log(typeof client1._id);
    // console.log(client2._id);
    // console.log(repair1._id);
    // console.log(repair2._id);
    // console.log(typeof device1._id);
    // console.log(device2._id);
    const a = await getClientById(client1._id);
    console.log(a);
  } catch (e) {
    console.log(e);
  }

  let admin, user1, user2, pending;
  try {
    admin = await createUser("Mr.Admin", "admin@gmail.com", "123123", "Approved", "Admin", "rEtzQQqMiqfeFYExAhmtMGrL3sy2") //password: test123

    user1 = await createUser("Tech1", "tech@gmail.com", "123123", "Approved", "Technician", "45jyg6qo1qaS9UXcKATCGcMHWqn1") //password: test123

    user2 = await createUser("Tech2", "tech2@gmail.com", "123123", "Approved", "Technician", "o0hFX7rwuufveUWsOR2tyUxwhS12") //password: test123

    pending = await createUser("Random Guy", "random@gmail.com", "123123", "Pending", "Technician", "UeeUeIDpC4TPwYaR1Keu6E51jCX2") //password: test123
    //console.log(device2);
  } catch (e) {
    console.log(e);
  }

  console.log("Seed Done!");
  await closeConnection();
  await redisClient.quit()
  return 


   
}

await main();


