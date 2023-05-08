const form = document.querySelector("form");
form.addEventListener("submit", handleUserInput);

function handleUserInput(event) {
  event.preventDefault();
  console.log(event);
  const location = event.target.location.value;
  makeAPICall(location);
}

async function weatherAPICall(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2117d4ad55ed429e97e74657230904&q=${location}`,
      {
        mode: "cors",
      }
    );
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (err) {
    console.warn(err);
  }
}

function composeWeatherObject(data) {
  //console.log(data);
  const current = data.current;
  const location = data.location;
  //console.log(location);
  return {
    location: location.name,
    condition: current.condition.text,
    icon: current.condition.icon,
    humidity: current.humidity,
    windDirection: current.wind_degree,
    windSpeedMPS: Math.floor(+current.wind_kph * 0.28),
    temperature: current.temp_c,
    precipitation: current.precip_mm,
  };
}

function makeAPICall(location) {
  let weatherData = {};
  weatherAPICall(location)
    .then((data) => {
      weatherData = data;
    })
    .then(() => console.table([composeWeatherObject(weatherData)]));
}
