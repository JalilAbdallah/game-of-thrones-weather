function updateUI(data) {
  const temp = data.current.temperature;
  const weatherDescription = data.current.weather_descriptions[0];
  const rangeKey = getTemperatureRange(temp);

  if (!rangeKey) {
    showModal("Temperature out of supported range (-30°C to 40°C).");
    return;
  }

  const mapping = weatherMapping[rangeKey];
  const weatherStatus = `${temp}°C, ${weatherDescription} huh?`;
  const region = mapping.region.toUpperCase();
  const quote = mapping.quote;
  const image = mapping.image;

  const { firstLine, secondLine } = splitQuote(quote);

  document.getElementById("weather-status").textContent = weatherStatus;
  document.getElementById("final-result").textContent = region;
  document.getElementById("quote").innerHTML = `${firstLine}<br>${secondLine}`; // Use innerHTML to add <br> for line break

  document.body.style.backgroundImage = `url(../assets/images/${image})`;
}
