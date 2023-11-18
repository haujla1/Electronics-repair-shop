import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createClient } from "../data/clients.js";
import { addDeviceToClient } from "../data/clients.js";
import { getClientById, getClientByPhoneNumber } from "../data/clients.js";
import { createUser } from "../data/users.js";
import {
  createRepair,
  updateWorkorderAfterRepair,
  updateWorkorderAfterPickup,
  getWorkorderById,
} from "../data/repairs.js";

async function main() {
  const db = await dbConnection();
  // await db.dropDatabase();
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
      stepsTakenToReplicateIssue: "visible cracks on screen",
      workToBeDone: "screen replacement",
      conditionOfDevice: "other than screen, device in good condition",
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
    // console.log(repair2);
    // console.log(client2);

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
    admin = await createUser("Mr.Admin", "admin@gmail.com", "123123", "Approved", "Admin", "dI1ek0bE7MdzXRE3VxNwG8Amzhj1") //password: test123

    user1 = await createUser("Tech1", "tech@gmail.com", "123123", "Approved", "Technician", "8WIjdBNWd3QyvmaKjvYhKQ0ME4I2") //password: test123

    user2 = await createUser("Tech2", "tech2@gmail.com", "123123", "Approved", "Technician", "uBaG1LK71aPgvURqYBws0cgb0sG2") //password: test123

    pending = await createUser("Random Guy", "random@gmail.com", "123123", "Pending", "Technician", "mQkXg5hn6Odga5zZOHWAFPqrvN42") //password: test123
    //console.log(device2);
  } catch (e) {
    console.log(e);
  }

  console.log("Seed Done!");

  await closeConnection();
}

main();
