import { processDateTime } from "./index.js";

const isMetric = JSON.parse(localStorage.getItem("isMetric"));

export function populateForecastSection(data, targetNode) {
  console.log(data);
  //const threeDayForecast = data.forecast.forecastday;
  //console.log(threeDayForecast);
  //constructTable(threeDayForecast);
  const arrayOf72Hours = composeHoursArray(data);
  console.log(arrayOf72Hours);
  //console.table(arrayOf72Hours);
  targetNode.innerHTML = "";
  targetNode.appendChild(constructTable(arrayOf72Hours));
}

function composeHoursArray(data) {
  const threeDaysForecast = data.forecast.forecastday;
  const seventyTwoHours = [
    ...threeDaysForecast[0].hour,
    ...threeDaysForecast[1].hour,
    ...threeDaysForecast[2].hour,
  ];
  return seventyTwoHours;
}

function constructTable(arrayOf72Hours) {
  const tableRows = [
    "dayName",
    "dayNumber",
    "dayHour",
    "windSpeed",
    "windGusts",
    "windDirectrion",
    "temperature",
    "clouding",
    "precipitation",
  ];
  const tableRowElements = {};
  const fragment = document.createDocumentFragment();
  const tableElement = document.createElement("table");
  tableElement.classList.add("forecast-table");
  tableRows.forEach((rowName, index) => {
    const newRow = document.createElement("tr");
    newRow.classList.add("row-" + rowName, "forecast-table__row");
    newRow.dataset.index = index;
    newRow.dataset.name = rowName;
    tableElement.appendChild(newRow);
    tableRowElements[rowName] = newRow;
  });
  arrayOf72Hours.forEach((hour) => {
    tableRowElements.dayName.appendChild(makeTd(shortDayName(hour.time)));
    tableRowElements.dayNumber.appendChild(makeTd(dayNumber(hour.time)));
    tableRowElements.dayHour.appendChild(makeTd(dayHour(hour.time)));
    tableRowElements.windSpeed.appendChild(makeTd(windSpeed(hour)));
    tableRowElements.windGusts.appendChild(makeTd(windGusts(hour)));
    tableRowElements.windDirectrion.appendChild(makeTd(">"));
    tableRowElements.temperature.appendChild(makeTd(temperature(hour)));
    tableRowElements.clouding.appendChild(makeTd(hour.cloud));
    tableRowElements.precipitation.appendChild(makeTd(hour.precip_mm));
  });
  console.log(tableRowElements);

  fragment.appendChild(tableElement);
  return fragment;

  function makeTd(content) {
    const dataCell = document.createElement("td");
    dataCell.textContent = content;
    return dataCell;
  }

  function shortDayName(timeData) {
    const dateTime = processDateTime(timeData);
    return dateTime.dayName.slice(0, 2);
  }

  function dayNumber(timeData) {
    const dateTime = processDateTime(timeData);
    return dateTime.dayNumber;
  }

  function dayHour(timeData) {
    const dateTime = processDateTime(timeData);
    //String(dateTime.getMinutes()).padStart(2, "0")
    return dateTime.dateHours + "h";
  }

  function windSpeed(hourData) {
    return isMetric
      ? Math.floor(hourData.wind_kph * 0.28)
      : Math.floor(hourData.wind_mph);
  }

  function windGusts(hourData) {
    return isMetric
      ? Math.floor(hourData.gust_kph * 0.28)
      : Math.floor(hourData.gust_mph);
  }

  function temperature(hourData) {
    return isMetric ? Math.round(hourData.temp_c) : Math.round(hourData.temp_f);
  }
}
