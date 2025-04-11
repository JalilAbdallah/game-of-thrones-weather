function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      (error) => {
        showModal("Unable to retrieve your location. Please search for a city instead.");
        console.error("Geolocation error:", error);
      }
    );
  } else {
    showModal("Geolocation is not supported by your browser. Please search for a city.");
  }
}