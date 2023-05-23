import { populateSecondarySection } from "./SecondaryWeatherSection.js";
import { populatePrimarySection } from "./PrimaryWeatherSection.js";

const main = document.querySelector("main");
//const searchInput = document.querySelector("#location");
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

async function handleUserInput(event) {
  console.log(event);
  event.preventDefault();
  const location = event.target.location.value;
  const weatherData = await fetchAndDisplay(location);
  if (!weatherData.error) {
    localStorage.setItem("location", weatherData.location.name);
  } else {
    console.log(weatherData.error.message);
  }
}

async function fetchAndDisplay(location) {
  if (!location) {
    location = localStorage.getItem("location");
  }
  const weatherData = await weatherAPICall(location);
  if (!weatherData.error) {
    populatePrimarySection(weatherData, primarySection);
    populateSecondarySection(weatherData, secondarySection);
  } else {
    populatePrimarySection(weatherData, primarySection);
  }

  return weatherData;
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
    console.log(data);

    return data;
  } catch (err) {
    console.warn(err);
  }
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
