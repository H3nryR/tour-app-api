const mongoose = require("mongoose");
//
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
//
const app = require("./app");

/// DB CONNECTION
mongoose
  .connect(process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => console.log(`DB Connection Successful`))
  .catch((err) => {
    console.log("DB Connection Error: " + err);
  });

/// SERVER CONNECTION
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
