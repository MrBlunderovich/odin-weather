import { processDateTime } from "./index.js";

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
  <img class="primary__icon" src="${
    data.current.condition.icon
  }" alt="conditions icon" width="128">
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

export function formatDateTime(timeData, isMetric) {
  const dateTime = processDateTime(timeData);
  const dayName = dateTime.dayName;
  const dayNumber = dateTime.dayNumber;
  const monthName = dateTime.monthName;
  const year = dateTime.year;
  const metricTime = dateTime.metricTime;
  const imperialTime = dateTime.imperialTime;

  return isMetric
    ? `${dayName}, ${dayNumber}, ${monthName} ${year}<br/>${metricTime}`
    : `${dayName}, ${monthName} ${dayNumber} ${year}<br/>${imperialTime}`;
}
