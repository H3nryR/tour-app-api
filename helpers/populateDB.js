const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const tourModel = require("./../models/tourModel");
//
dotenv.config({ path: "./config.env" });

// DB connection
mongoose
  .connect(process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB Connection Successful`))
  .catch((err) => {
    console.log("DB Connection Error: " + err);
  });

// Read JSON file
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf8")
);

// Import DATA into DB
const importData = async () => {
  try {
    await tourModel.create(data);
    console.log("Data imported!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete data from DB
const deleteData = async () => {
  try {
    await tourModel.deleteMany();
    console.log("Data imported!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// console.log(process.argv);
// console.log(process.argv[2]);

//////////////////////////////////////////////
if (process.argv[2] === "--import") {
  importData();
  console.log("DB successfully populated");
} else if (process.argv[2] === "--delete") {
  deleteData();
  console.log("DB successfully deleted");
}

// CONSOLE CMD
// console.log(process.argv);
// node helpers/populateDB.js --import
// node helpers/populateDB.js --delete
