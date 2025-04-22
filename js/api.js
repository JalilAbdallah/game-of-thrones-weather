async function fetchWeather(query) {
    const accessKey = "c3cba97b6ac265d8eeef2c2947697d77"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${accessKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.cod !== 200) {
        throw new Error("City not found.");
      }
      console.log(data);
      
      updateUI(data);
    } catch (error) {
      showModal(error);

      document.getElementById("weather-status").textContent = "Huh?";
      document.getElementById("final-result").textContent = "NOTHING";
      document.getElementById("quote").textContent = "Loading Up ...";
      document.getElementById("said-by").textContent = "";
      document.getElementById("location-name").textContent = "Unknown";
      document.body.style.backgroundImage = `url(../assets/images/loading.jpg)`;
    }
  }