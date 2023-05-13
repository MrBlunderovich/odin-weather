const main = document.querySelector("main");
const searchInput = document.querySelector("#location");

const form = document.querySelector("form");
form.addEventListener("submit", handleUserInput);

async function handleUserInput(event) {
  event.preventDefault();
  const location = event.target.location.value;
  const weatherData = await weatherAPICall(location);
  const weatherObject = composeWeatherObject(weatherData);
  console.table([weatherObject]);
  searchInput.value = weatherObject.location;
}

async function weatherAPICall(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=2117d4ad55ed429e97e74657230904&days=7&q=${location}`,
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
  console.log(data);
  const current = data.current;
  const location = data.location;
  const forecast = data.forecast;
  const dayForecast = forecast.forecastday[0].day;
  //console.log(location);
  const primary = {
    condition: current.condition.text,
    location: location.name,
    localtime: location.localtime,
    temperature: current.temp_c,
    metricImperial: "Display F",
    icon: current.condition.icon,
  };
  const secondary = {
    feelsLike: current.feelslike_c,
    humidity: current.humidity,
    chanceOfRain: dayForecast.daily_chance_of_rain,
    windSpeedMPS: Math.floor(+current.wind_kph * 0.28),
    windDirection: current.wind_degree,
  };
  return {
    location: location.name,
    localtime: location.localtime,
    condition: current.condition.text,
    icon: current.condition.icon,
    humidity: current.humidity,
    windDirection: current.wind_degree,
    windSpeedMPS: Math.floor(+current.wind_kph * 0.28),
    temperature: current.temp_c,
    precipitation: current.precip_mm,
  };
}

function populatePrimarySection(data) {
  console.log(data);
}
/* function makeTextOutput(weatherObject) {
  let output = "";
  for (let property in weatherObject) {
    //console.log(property);
    output = output.concat("\r\n", property, ": ", weatherObject[property]);
  }
  return output;
} */
