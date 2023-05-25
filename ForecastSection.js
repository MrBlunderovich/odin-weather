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
  arrayOf72Hours.forEach((hour, index) => {
    tableRowElements.dayName.appendChild(dayNameTd(hour, index));
    tableRowElements.dayNumber.appendChild(dayNumberTd(hour, index));
    tableRowElements.dayHour.appendChild(dayHourTd(hour, index));
    tableRowElements.windSpeed.appendChild(windSpeedTd(hour));
    tableRowElements.windGusts.appendChild(windGustsTd(hour));
    tableRowElements.windDirectrion.appendChild(windDirectrionTd(hour));
    tableRowElements.temperature.appendChild(temperatureTd(hour));
    tableRowElements.clouding.appendChild(cloudingTd(hour));
    tableRowElements.precipitation.appendChild(precipitationTd(hour));
  });
  console.log(tableRowElements);

  fragment.appendChild(tableElement);
  return fragment;

  /////////// new td functions
  function dayOrNight(data) {
    const isDay = data.is_day;
    return isDay ? "is-day" : "is-night";
  }
  function isOddDay(index) {
    if (index > 23 && index < 48) {
      return "odd-day";
    } else {
      return "even-day";
    }
  }

  ///////////////
  function dayNameTd(data, index) {
    const timeData = data.time;
    const dateTime = processDateTime(timeData);
    const dataCell = document.createElement("td");
    dataCell.textContent = dateTime.dayName.slice(0, 2);
    dataCell.classList.add("table-header", isOddDay(index));
    //dataCell.style = "background-color:gray;";
    return dataCell;
  }

  function dayNumberTd(data, index) {
    const timeData = data.time;
    const dateTime = processDateTime(timeData);
    const dataCell = document.createElement("td");
    dataCell.textContent = dateTime.dayNumber + ".";
    dataCell.classList.add("table-header", isOddDay(index));
    return dataCell;
  }

  function dayHourTd(data) {
    const timeData = data.time;
    const dateTime = processDateTime(timeData);
    const dataCell = document.createElement("td");
    dataCell.textContent = dateTime.dateHours + "h";
    dataCell.classList.add("table-header", dayOrNight(data));
    return dataCell;
  }

  function windSpeedTd(data) {
    const dataCell = document.createElement("td");
    const metricValue = Math.floor(data.wind_kph * 0.28);
    dataCell.dataset.wind = metricValue;
    dataCell.textContent = isMetric ? metricValue : Math.floor(data.wind_mph);
    return dataCell;
  }

  function windGustsTd(data) {
    const dataCell = document.createElement("td");
    const metricValue = Math.floor(data.gust_kph * 0.28);
    dataCell.dataset.wind = metricValue;
    dataCell.textContent = isMetric ? metricValue : Math.floor(data.gust_mph);
    return dataCell;
  }

  function windDirectrionTd(data) {
    const dataCell = document.createElement("td");
    dataCell.textContent = "->";
    return dataCell;
  }

  function temperatureTd(data) {
    const dataCell = document.createElement("td");
    dataCell.textContent = isMetric
      ? Math.round(data.temp_c)
      : Math.round(hourData.temp_f);
    return dataCell;
  }

  function cloudingTd(data) {
    const dataCell = document.createElement("td");
    dataCell.textContent = +data.cloud >= 5 ? data.cloud : "";
    dataCell.classList.add("table-clouding");
    dataCell.style = `background-color: ${cloudColor(data.cloud)};`;
    return dataCell;

    function cloudColor(cloudiness) {
      const percentage = +data.cloud >= 5 ? 100 - cloudiness / 2 : 100;
      return `hsl(0,0%,${percentage}%)`;
    }
  }

  function precipitationTd(data) {
    const dataCell = document.createElement("td");
    dataCell.textContent = data.precip_mm;
    return dataCell;
  }
  ///////////
  /* 
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
  } */
}
