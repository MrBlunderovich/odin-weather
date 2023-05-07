async function weatherAPICall(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2117d4ad55ed429e97e74657230904&q=${location}`,
      {
        mode: "cors",
      }
    );
    const data = await response.json();
    console.log(data);
    const current = data.current;
    console.log(current);
  } catch (err) {
    console.warn(err);
  }
}

weatherAPICall("bishkek");
