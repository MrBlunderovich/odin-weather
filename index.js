import { populateSecondarySection } from "./SecondaryWeatherSection.js";
import { populatePrimarySection } from "./PrimaryWeatherSection.js";

const main = document.querySelector("main");
const searchInput = document.querySelector("#location");
const primarySection = document.querySelector(".weather__primary");
const secondarySection = document.querySelector(".weather__secondary");

document.addEventListener("submit", handleUserInput);
document.addEventListener("click", handleClick);

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

window.onload = () => {
  if (!localStorage.getItem("isMetric")) {
    localStorage.setItem("isMetric", true);
  }
  if (!localStorage.getItem("location")) {
    localStorage.setItem("location", "Vladivostok");
  }
  fetchAndDisplay();
};
