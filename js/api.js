async function fetchWeather(city) {
    const accessKey = "b6e34458710a3bd3a7e3d8598e9d4813"; // Your Weatherstack API key
    const url = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${city}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error.info || "City not found.");
      }
  
      updateUI(data);
    } catch (error) {
      showModal(`Error: ${error.message}`);

      document.getElementById("weather-status").textContent = "Huh?";
      document.getElementById("final-result").textContent = "NOTHING";
      document.getElementById("quote").textContent = "Loading Up ...";
      document.getElementById("said-by").textContent = "";
      document.body.style.backgroundImage = `url(../assets/images/loading.jpg)`;
    }
  }