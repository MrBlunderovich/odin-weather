import { populateSecondarySection } from "./SecondaryWeatherSection.js";
import { populatePrimarySection } from "./PrimaryWeatherSection.js";
import { populateForecastSection, handleDrag } from "./ForecastSection.js";

const primarySection = document.querySelector(".weather__primary");
const secondarySection = document.querySelector(".weather__secondary");
const forecastSection = document.querySelector(".forecast");
const root = document.documentElement;

document.addEventListener("submit", handleUserInput);
document.addEventListener("click", handleClick);
///
document.addEventListener("mousedown", handleDrag);
document.addEventListener("mouseleave", handleDrag);
document.addEventListener("mouseup", handleDrag);
document.addEventListener("mousemove", handleDrag);

function handleClick(event) {
  const target = event.target;
  if (target.matches(".units")) {
    const oldToggleState = JSON.parse(localStorage.getItem("isMetric"));
    localStorage.setItem("isMetric", JSON.stringify(!oldToggleState));
    fetchAndDisplay();
  }
}

async function handleUserInput(event) {
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
    const isDay = weatherData.current.is_day ? true : false;
    root.style.setProperty(
      "--bg-image",
      isDay
        ? 'url("https://picsum.photos/id/984/4000/2248")'
        : 'url("https://picsum.photos/id/869/2000/1333")'
    );
    populatePrimarySection(weatherData, primarySection);
    populateSecondarySection(weatherData, secondarySection);
    populateForecastSection(weatherData, forecastSection);
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

export function processDateTime(timeData) {
  const dateTime = new Date(timeData);
  const dateMinutes = String(dateTime.getMinutes()).padStart(2, "0");
  const dateHours = String(dateTime.getHours()).padStart(2, "0");
  const metricTime = dateTime.getHours() + ":" + dateMinutes;
  let imperialTime =
    dateTime.getHours() <= 12
      ? dateTime.getHours() + ":" + dateMinutes + " am"
      : dateTime.getHours() - 12 + ":" + dateMinutes + " pm";

  const dayIndex = dateTime.getDay();
  const year = dateTime.getFullYear();
  const dayNumber = dateTime.getDate();
  let dayName = "noName";
  switch (dayIndex) {
    case 0:
      dayName = "Sunday";
      break;
    case 1:
      dayName = "Monday";
      break;
    case 2:
      dayName = "Tuesday";
      break;
    case 3:
      dayName = "Wednesday";
      break;
    case 4:
      dayName = "Thursday";
      break;
    case 5:
      dayName = "Friday";
      break;
    case 6:
      dayName = "Saturday";
      break;

    default:
      break;
  }
  const monthNumber = dateTime.getMonth();
  let monthName = "noName";
  switch (monthNumber) {
    case 0:
      monthName = "January";
      break;
    case 1:
      monthName = "February";
      break;
    case 2:
      monthName = "March";
      break;
    case 3:
      monthName = "April";
      break;
    case 4:
      monthName = "May";
      break;
    case 5:
      monthName = "June";
      break;
    case 6:
      monthName = "July";
      break;
    case 7:
      monthName = "August";
      break;
    case 8:
      monthName = "September";
      break;
    case 9:
      monthName = "October";
      break;
    case 10:
      monthName = "November";
      break;
    case 11:
      monthName = "December";
      break;

    default:
      break;
  }

  return {
    dayName,
    dayNumber,
    monthName,
    year,
    metricTime,
    imperialTime,
    dateHours,
  };
}
