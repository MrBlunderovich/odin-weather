export function populatePrimarySection(data, targetNode) {
  const isMetric = JSON.parse(localStorage.getItem("isMetric"));
  //console.log(data);

  targetNode.innerHTML = `
  <p class="conditions">${data.current.condition.text}</p>
  <p class="location">${`${data.location.name}, ${data.location.country}`}</p>
  <p class="date">${data.location.localtime}</p>
  <p class="temperature">
    ${
      isMetric
        ? Math.round(data.current.temp_c) + " &deg;C"
        : Math.round(data.current.temp_f) + " &deg;F"
    }
  </p>
  <p class="units">Display ${isMetric ? "Freedom Units" : "Metric Units"}</p>
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

  const primaryElements = [
    {
      name: "conditions",
      value: data.current.condition.text,
    },
    {
      name: "location",
      value: `${data.location.name}, ${data.location.country}`,
    },
    {
      name: "date",
      value: data.location.localtime,
    },
    {
      name: "temperature",
      value: data.current.temp_c + " deg.C",
    },
    {
      name: "units",
      value: "Display deg.F",
    },
    {
      name: "icon",
      value: "Icon",
    },
  ];
  console.log(formatDateTime(data.location.localtime));
}

function formatDateTime(timeData) {
  console.log(timeData);
  const dateTime = new Date(timeData);

  let imperialTime =
    dateTime.getHours() <= 12
      ? dateTime.getHours() + ":" + dateTime.getMinutes() + " am"
      : dateTime.getHours() - 12 + ":" + dateTime.getMinutes() + " pm";

  const dayNumber = dateTime.getDay();
  console.log({ dayNumber });
  let dayName = "noName";
  switch (dayNumber) {
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

  return {
    metricTime: dateTime.getHours() + ":" + dateTime.getMinutes(),
    imperialTime: imperialTime,
    day: dayName,
  };
}
