import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
  const cityName = req.body.city;
  try {
    const geoResponse = await axios.get(
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
        cityName +
        "&limit=1&appid=c295b97480f3be8a3f4df8a93fef1713"
    );
    const lat = geoResponse.data[0].lat;
    const lon = geoResponse.data[0].lon;
    const weatherResponse = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=c295b97480f3be8a3f4df8a93fef1713&units=metric"
    );
    const today = new Date();

    const fiveForecast = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=c295b97480f3be8a3f4df8a93fef1713&units=metric"
    );

    // Add 1 day to get tomorrow
    const dayOne = new Date(today);
    dayOne.setDate(today.getDate() + 1);

    // Add 2 days to get the day after tomorrow
    const dayTwo = new Date(today);
    dayTwo.setDate(today.getDate() + 2);

    // Add 3 days to get the day after the day after tomorrow
    const dayThree = new Date(today);
    dayThree.setDate(today.getDate() + 3);

    const dayFour = new Date(today);
    dayFour.setDate(today.getDate() + 4);

    res.render("index.ejs", {
      name: geoResponse.data[0].name,
      temperature: Math.floor(weatherResponse.data.main.temp),
      wind: Math.floor(weatherResponse.data.wind.speed),
      humidity: weatherResponse.data.main.humidity,
      weatherIcon: weatherResponse.data.weather[0].icon,
      dayOne,
      dayTwo,
      dayThree,
      dayFour,
      fiveForecast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log("Server is runnig on port " + port);
});
