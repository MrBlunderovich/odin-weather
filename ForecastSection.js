import { processDateTime } from "./index.js";

const isMetric = JSON.parse(localStorage.getItem("isMetric"));

export function populateForecastSection(data, targetNode) {
  console.log(data);
  const arrayOf72Hours = composeHoursArray(data);
  console.log(arrayOf72Hours);
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
    dataCell.style = `background-color: ${windColor(metricValue)};`;
    return dataCell;
  }

  function windGustsTd(data) {
    const dataCell = document.createElement("td");
    const metricValue = Math.floor(data.gust_kph * 0.28);
    dataCell.dataset.wind = metricValue;
    dataCell.textContent = isMetric ? metricValue : Math.floor(data.gust_mph);
    dataCell.style = `background-color: ${windColor(metricValue)};`;
    return dataCell;
  }

  function windColor(windSpeed) {
    let hue = 200;
    let lightness = 80;
    if (windSpeed <= 2) {
      lightness = 100;
    } else if (windSpeed <= 12) {
      hue = map(windSpeed, 3, 12, 170, 0);
    } else if (windSpeed <= 20) {
      hue = map(windSpeed, 13, 20, 359, 270);
    } else {
      hue = 270;
    }
    return `hsl(${hue},100%,${lightness}%)`;
  }

  function windDirectrionTd(data) {
    const dataCell = document.createElement("td");
    const angle = data.wind_degree;
    const arrow = document.createElement("i");
    dataCell.classList.add("wind-direction-cell");
    arrow.classList.add("wind-arrow", "wi", "wi-direction-down");
    arrow.style = `transform:rotate(${angle}deg);`;
    arrow.dataset.direction = data.wind_dir;
    dataCell.dataset.direction = data.wind_dir + `(${data.wind_degree}°)`;
    dataCell.appendChild(arrow);
    return dataCell;
  }

  function temperatureTd(data) {
    const dataCell = document.createElement("td");
    dataCell.textContent = isMetric
      ? Math.round(data.temp_c)
      : Math.round(hourData.temp_f);
    dataCell.style = `background-color: ${tempColor(data.temp_c)};`;
    return dataCell;

    function tempColor(temperature) {
      let hue = 80;
      let lightness = 80;
      if (temperature < -30) {
        hue = 225;
        lightness = 60;
      } else if (temperature <= 0) {
        hue = map(temperature, -30, 0, 225, 190);
        lightness = map(temperature, -30, 0, 60, 80);
      } else if (temperature < 31) {
        hue = map(temperature, 1, 30, 75, 1);
        lightness = map(temperature, 1, 30, 80, 60);
      } else {
        hue = 1;
        lightness = 60;
      }
      return `hsl(${hue},100%,${lightness}%)`;
    }
  }

  function cloudingTd(data) {
    const dataCell = document.createElement("td");
    dataCell.textContent = +data.cloud >= 5 ? data.cloud : "";
    dataCell.style = `background-color: ${cloudColor(data.cloud)};`;
    return dataCell;

    function cloudColor(cloudiness) {
      const lightness = +cloudiness >= 5 ? 100 - cloudiness / 2 : 100;
      return `hsl(0,0%,${lightness}%)`;
    }
  }

  function precipitationTd(data) {
    const dataCell = document.createElement("td");
    dataCell.textContent = +data.precip_mm > 0 ? data.precip_mm : "";
    dataCell.style = `background-color: ${rainColor(data.precip_mm)};`;
    return dataCell;

    function rainColor(raininess) {
      let lightness =
        +raininess >= 0.1 ? map(+raininess * 10, 1, 100, 950, 500) / 10 : 100;
      //let lightness = +raininess >= 0.1 ? 100 - raininess * 20 : 100;
      if (lightness < 30) {
        lightness = 30;
      }
      return `hsl(212,100%,${lightness}%)`;
    }
  }

  function map(input, in_min, in_max, out_min, out_max) {
    return (
      ((input - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  }
}
///////// drag-scrolling
let isDown = false;
let startX = 0;
let scrollLeft = 0;
export function handleDrag(event) {
  if (event.target === "document" || !event.target.closest(".forecast")) {
    return;
  }
  const slider = document.querySelector(".forecast");
  //console.log(event);
  const eventType = event.type;
  switch (eventType) {
    case "mousedown":
      handleMouseDown(event);
      break;
    case "mouseleave":
      handleMouseUp(event);
      break;
    case "mouseup":
      handleMouseUp(event);
      break;
    case "mousemove":
      handleMouseMove(event);
      break;

    default:
      break;
  }
  function handleMouseDown(event) {
    isDown = true;
    slider.classList.add("active");
    startX = event.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  }
  function handleMouseUp(event) {
    isDown = false;
    slider.classList.remove("active");
  }
  function handleMouseMove(event) {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = x - startX;
    slider.scrollLeft = scrollLeft - walk;
  }
}
