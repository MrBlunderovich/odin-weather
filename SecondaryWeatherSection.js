export default function SecondaryWeatherSection(elements) {
  const fragment = document.createDocumentFragment();
  /*  elements.forEach((element) => {
    const newElement = SecondaryWeatherElement(data, element);
    fragment.appendChild(newElement);
  }); */
  for (let element of elements) {
    const newElement = SecondaryWeatherElement(element);
    fragment.appendChild(newElement);
  }
  return fragment;
}

/* const icons = {
  windSpeed: "wi-strong-wind",
  feelsLike: "wi-thermometer",
  humidity: "wi-humidity",
  chanceOfRain: "wi-sprinkle",
}; */

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
  value.textContent = element.value;
  container.appendChild(icon);
  container.appendChild(caption);
  container.appendChild(value);

  return container;
}
