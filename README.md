# Electronics Service Management System

Final Project for CS554

_Group Memebers_:
Chancelor Assiamah, Mahesh Hiremath, Kyle Boberg, Harshdeep Aujla

_Instructions to run project locally_
1. Clone the project locally by running `git clone https://github.com/haujla1/Electronics-repair-shop.git`.
2. Run a local Redis installation on port `6379`.
3. Open a terminal and `cd` into the `my-jsreport-project` folder. Run the `npm install` command, and once finished run `npm start`. Note, that the code in the folder requires a recent version of Node.js, so an update may be required.
4. Open a new terminal and `cd` into the `back-end` folder of the project.
5. Add the backend `.env` file into the `back-end` folder if not already present.
6. Run the `npm install` command.
7. Run `node tasks/seed.js` or `npm run seed` in the terminal to seed the database. This step can be skipped if data already exists in the database. Press CTRL+C to close the seed operation.
8. Run `npm start` to start the server
9. Open a third terminal and `cd` into `front-end` folder.
10. Add the frontend `.env` file into the `front-end` folder if not already present.
11. Run the `npm install`, and once finished run the `npm run dev` command. Click on the link logged in the terminal, and begin using the web app!

_Instructions to test AWS deployed webapp_
1. Visit `http://ec2-3-95-220-90.compute-1.amazonaws.com/`. Explore the deployed version of the code on the `aws_deployment` branch.

_Test User logins (created with the seeding)_
1. Email: `admin@gmail.com`, Password: `Password123!`, role: Admin
2. Email: `tech1@gmail.com`, Password: `Password123!`, role: Technician
3. Email: `tech2@gmail.com`, Password: `Password123!`, role: Technician
4. Email: `randomGuy@gmail.com`, Password: `Password123!`, role: None

_Other Info_

1. The server stores data in a mongoDB database called `Electronics-Repair-Shop`, with the collections `clients` and `users`.
