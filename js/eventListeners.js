function setupEventListeners() {
  document.getElementById("search").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const city = event.target.value.trim();
      if (city) {
        fetchWeather(city);
      } else {
        showModal("Please enter a city name.");
      }
    }
  });

  document
    .querySelector(".ph-magnifying-glass")
    .addEventListener("click", () => {
      const city = document.getElementById("search").value.trim();
      if (city) {
        fetchWeather(city);
      } else {
        showModal("Please enter a city name.");
      }
    });
}
