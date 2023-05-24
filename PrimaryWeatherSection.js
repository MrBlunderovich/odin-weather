//import conditionsCodes from "./weather_conditions";

export function populatePrimarySection(data, targetNode) {
  const isMetric = JSON.parse(localStorage.getItem("isMetric"));
  const errorElement = document.querySelector(".error");
  if (data.error && errorElement) {
    errorElement.textContent = data.error.message;
  } else {
    renderPrimarySection(data);
  }

  function renderPrimarySection(data) {
    targetNode.innerHTML = `
  <p class="conditions">${data.current.condition.text}</p>
  <p class="location">${`${data.location.name}, ${data.location.country}`}</p>
  <p class="date">${formatDateTime(data.location.localtime, isMetric)}</p>
  <p class="temperature">
    ${
      isMetric
        ? Math.round(data.current.temp_c) + " &deg;C"
        : Math.round(data.current.temp_f) + " &deg;F"
    }
  </p>
  <p class="units">Switch to ${isMetric ? "Freedom Units" : "Metric Units"}</p>
  <i class="primary__icon wi element.icon ${"wi-day-cloudy"}"></i>
  <form class="primary__form" action='#'>
    <label>
      <input type="text" class="location-input"
      name="location" id="location"
      placeholder="Search Location..." />
    </label>
    <button type="submit" class="search-button">
      <i class="search-icon material-icons-outlined">search</i>
    </button>
  </form>
  <p class="error"></p>
  `;
  }
}

function formatDateTime(timeData, isMetric) {
  const dateTime = new Date(timeData);
  const dateMinutes = String(dateTime.getMinutes()).padStart(2, "0");
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

  return isMetric
    ? `${dayName}, ${dayNumber}, ${monthName} ${year}<br/>${metricTime}`
    : `${dayName}, ${monthName} ${dayNumber} ${year}<br/>${imperialTime}`;
}
