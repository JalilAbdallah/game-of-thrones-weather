function updateUI(data) {
  const temp = parseInt(data.main.temp);
  const weatherDescription = data.weather[0].description;
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

  const location = data.name || "Unknown";

  const { firstLine, secondLine } = splitQuote(quote);

  document.getElementById("weather-status").textContent = weatherStatus;
  document.getElementById("final-result").textContent = region;
  document.getElementById("quote").innerHTML = `${firstLine}<br>${secondLine}`;
  document.getElementById("location-name").textContent = location;

  document.body.style.backgroundImage = `url(../assets/images/${image})`;
}
