export function populateSecondarySection(data, targetNode) {
  const isMetric = JSON.parse(localStorage.getItem("isMetric"));
  const astroData = data.forecast.forecastday[0].astro;
  const secondaryElements = [
    {
      name: "feelsLike",
      value: isMetric
        ? Math.round(data.current.feelslike_c) + " &deg;C"
        : Math.round(data.current.feelslike_f) + " &deg;F",
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
      value: isMetric
        ? Math.floor(+data.current.wind_kph * 0.28) + " m/s"
        : Math.floor(+data.current.wind_mph) + " mph",
      caption: "Wind Speed",
      icon: "wi-strong-wind",
    },
    {
      name: "sunrise",
      value: formatTime(astroData.sunrise, isMetric),
      caption: "Sunrize at",
      icon: "wi-sunrise",
    },
    {
      name: "sunset",
      value: formatTime(astroData.sunset, isMetric),
      caption: "Sunset at",
      icon: "wi-sunset",
    },
  ];
  console.log(astroData);
  const fragment = SecondaryWeatherSection(secondaryElements);
  targetNode.innerHTML = "";
  targetNode.appendChild(fragment);
}

function formatTime(time, isMetric) {
  if (isMetric) {
    const amPm = time.slice(-2);
    const amHours = time.slice(0, 2);
    const pmHours = String(+amHours + 12).padStart(2, "0");
    const metricHours = amPm === "AM" ? amHours : pmHours;
    const minutes = time.slice(3, 5);
    return `${metricHours}:${minutes}`;
  } else {
    //return time.toLowerCase();
    return `${time.slice(0, 5)} <span class="am-pm">${time
      .slice(-2)
      .toLowerCase()}</span>`;
  }
}

function SecondaryWeatherSection(elements) {
  const fragment = document.createDocumentFragment();
  for (let element of elements) {
    const newElement = SecondaryWeatherElement(element);
    fragment.appendChild(newElement);
  }
  return fragment;
}

function SecondaryWeatherElement(element) {
  const container = document.createElement("div");
  container.classList.add(`secondary__${element.name}`, "secondary");
  const icon = document.createElement("i");
  icon.classList.add("secondary__icon", "wi", element.icon);
  const caption = document.createElement("span");
  caption.classList.add("secondary__caption");
  caption.textContent = element.caption;
  const value = document.createElement("span");
  value.classList.add("secondary__value");
  value.innerHTML = element.value;
  container.appendChild(icon);
  container.appendChild(caption);
  container.appendChild(value);

  return container;
}
