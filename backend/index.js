const express = require("express");
const cors = require("cors");
const https = require("https");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

let dates = {
  start_date: "",
  end_date: "",
};

app.post("/data", (req, res) => {
  console.log(req.body);
  dates.start_date = req.body.startdate; // Corrected property name
  dates.end_date = req.body.enddate; // Corrected property name
  console.log(dates);
  res.send(dates);
});

app.get("/backenddata", (req, res) => {
  https
    .get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dates.start_date}&end_date=${dates.end_date}&api_key=${process.env.API_KEY}`,
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          console.log(data);
          res.json(JSON.parse(data));
        });
      }
    )
    .on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
});

app.listen(process.env.PORT||4200, () => {
  console.log("Server connected");
});
