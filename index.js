import { populateSecondarySection } from "./SecondaryWeatherSection.js";
import { populatePrimarySection } from "./PrimaryWeatherSection.js";

const main = document.querySelector("main");
const searchInput = document.querySelector("#location");
const primarySection = document.querySelector(".weather__primary");
const secondarySection = document.querySelector(".weather__secondary");

document.addEventListener("submit", handleUserInput);
document.addEventListener("click", handleClick);
/* const form = document.querySelector("form");
form.addEventListener("submit", handleUserInput); */

function handleClick(event) {
  const target = event.target;
  if (target.matches(".units")) {
    const oldToggleState = JSON.parse(localStorage.getItem("isMetric"));
    localStorage.setItem("isMetric", JSON.stringify(!oldToggleState));
    fetchAndDisplay();
  }
}

function handleUserInput(event) {
  event.preventDefault();
  const location = event.target.location.value;
  localStorage.setItem("location", location);
  fetchAndDisplay();
}

async function fetchAndDisplay() {
  const location = localStorage.getItem("location");
  const weatherData = await weatherAPICall(location);
  const weatherObject = composeWeatherObject(weatherData);
  if (searchInput) {
    searchInput.value = weatherObject.location;
  }
  populatePrimarySection(weatherData, primarySection);
  populateSecondarySection(weatherData, secondarySection);
}

async function weatherAPICall(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=2117d4ad55ed429e97e74657230904&days=7&q=${location}`,
      {
        mode: "cors",
      }
    );
    const data = await response.json();

    //console.log(data);
    return data;
  } catch (err) {
    console.warn(err);
  }
}

function composeWeatherObject(data) {
  console.log(data);
  const current = data.current;
  const location = data.location;
  const forecast = data.forecast;
  const dayForecast = forecast.forecastday[0].day;
  //console.log(location);
  const primary = {
    condition: current.condition.text,
    location: location.name,
    localtime: location.localtime,
    temperature: current.temp_c,
    metricImperial: "Display F",
    icon: current.condition.icon,
  };
  const secondary = {
    feelsLike: current.feelslike_c,
    humidity: current.humidity,
    chanceOfRain: dayForecast.daily_chance_of_rain,
    windSpeedMPS: Math.floor(+current.wind_kph * 0.28),
    windDirection: current.wind_degree,
  };
  //console.log(primary);
  //console.log(secondary);
  return {
    location: location.name,
    localtime: location.localtime,
    condition: current.condition.text,
    icon: current.condition.icon,
    humidity: current.humidity,
    windDirection: current.wind_degree,
    windSpeedMPS: Math.floor(+current.wind_kph * 0.28),
    temperature: current.temp_c,
    precipitation: current.precip_mm,
    primary,
    secondary,
  };
}

/* function populateSecondarySection(data) {
  console.log(data);
  const secondaryElements = [
    {
      name: "feelsLike",
      value: data.current.feelslike_c + " C",
      caption: "Feels Like",
      icon: "wi-thermometer",
    },
    {
      name: "humidity",
      value: data.current.humidity + " %",
      caption: "Humidity",
      icon: "wi-humidity",
    },
    {
      name: "chanceOfRain",
      value: data.forecast.forecastday[0].day.daily_chance_of_rain + " %",
      caption: "Chance of Rain",
      icon: "wi-sprinkle",
    },
    {
      name: "windSpeed",
      value: data.current.wind_kph + " km/h",
      caption: "Wind Speed",
      icon: "wi-strong-wind",
    },
  ];
  const fragment = SecondaryWeatherSection(secondaryElements);
  secondarySection.innerHTML = "";
  secondarySection.appendChild(fragment);
} */

window.onload = () => {
  if (!localStorage.getItem("isMetric")) {
    localStorage.setItem("isMetric", true);
  }
  if (!localStorage.getItem("location")) {
    localStorage.setItem("location", "Vladivostok");
  }
  //const location = localStorage.getItem("location");
  fetchAndDisplay();
};
