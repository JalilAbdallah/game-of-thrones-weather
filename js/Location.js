function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        
        fetchWeather(`lon=${longitude}&lat=${latitude}`);
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