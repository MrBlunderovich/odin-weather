export function populatePrimarySection(data, targetNode) {
  const isMetric = JSON.parse(localStorage.getItem("isMetric"));
  //console.log(data);

  targetNode.innerHTML = `
  <p class="conditions">${data.current.condition.text}</p>
  <p class="location">${`${data.location.name}, ${data.location.country}`}</p>
  <p class="date">${data.location.localtime}</p>
  <p class="temperature">${data.current.temp_c} &deg;C</p>
  <p class="units">Display &deg;${isMetric ? "F" : "C"}</p>
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
  /* const fragment = PrimaryWeatherSection(primaryElements);
  targetNode.innerHTML = "";
  targetNode.appendChild(fragment); */
}

/* function PrimaryWeatherSection(elements) {
  const fragment = document.createDocumentFragment();
  for (let element of elements) {
    const newElement = PrimaryWeatherElement(element);
    fragment.appendChild(newElement);
  }
  return fragment;
}

function PrimaryWeatherElement(element) {
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
} */
