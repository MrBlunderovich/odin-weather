export function populateSecondarySection(data, targetNode) {
  const isMetric = JSON.parse(localStorage.getItem("isMetric"));
  //console.log(data);
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
  ];
  const fragment = SecondaryWeatherSection(secondaryElements);
  targetNode.innerHTML = "";
  targetNode.appendChild(fragment);
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
  //icon.textContent = "@";
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
