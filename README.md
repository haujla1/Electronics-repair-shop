# Electronics Service Management System

Final Project for CS554

*Group Memebers*:
Chancelor Assiamah, Mahesh Hiremath, Kyle Boberg, Harshdeep Aujla


*Instructions to run project*

1. Clone the project locally by running `git clone https://github.com/haujla1/Electronics-repair-shop.git`.
2. Run a local Redis installation on port `6379`.
3. Open a terminal and `cd` into the `my-jsreport-project` folder. Run the `npm install` command, and once finished run `npm start`. Note, that the code in the folder requires a recent version of Node.js, so an update may be required.
4. Open a new terminal and `cd` into the `back-end` folder of the project.
5. Add the backend `.env` file into the `back-end` folder if not already present.
6. Run `node tasks/seed.js` in the terminal to seed the database. This step can be skipped if data already exists in the database.
7. Run the `npm install` command. Once finished, run `npm start` to start the server
8. Open a third terminal and `cd` into `front-end` folder.
9. Add the frontend `.env` file into the `front-end` folder if not already present.
10. Run the `npm install command`, and once finished run the `npm run dev` command. Click on the link logged in the terminal, and begin using the web app!

*Test User logins (created with the seeding)*
1. Email: `admin@gmail.com`, Password: `Password123!`, role: Admin
2. Email: `tech1@gmail.com`, Password: `Password123!`, role: Technician
3. Email: `tech2@gmail.com`, Password: `Password123!`, role: Technician
4. Email: `randomGuy@gmail.com`, Password: `Password123!`, role: None

*Other Info*
1. The server stores data in a mongoDB database called `Electronics-Repair-Shop`, with the collections `clients` and `users`.


