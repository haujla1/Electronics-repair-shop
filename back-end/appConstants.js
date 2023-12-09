const constants = {
  pwRounds: 16,
  min_age: 13,
  max_age: 150,
  stringLimits: {
    title: 100,
    textBody: 200,
    tag: 20,
    password: 8,
    first_last_names: 20,
    address: 100,
    deviceType: 20,
    manufacturer: 20,
    modelName: 20,
    modelNumber: 20,
    serialNumber: 20,
    issue: 200,
    stepsTaken: 200,
    workToBeDone: 200,
    conditionOfDevice: 200,
  },
  repairStatus: ["In progress", "Completed", "Picked-up"],
};

export default constants;
