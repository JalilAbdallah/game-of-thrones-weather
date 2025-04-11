// Function to fetch weather data using city name from WeatherStack
const accessKey = '8e33c4e74154e8c8b80c304be91796c4'; // <-- Replace if needed
async function getWeatherForCity(city) {
    const weatherUrl = `https://api.weatherstack.com/current?access_key=${accessKey}&query=${encodeURIComponent(city)}`;
    // console.log("Fetching weather from:", weatherUrl); // Debug log

    const response = await fetch(weatherUrl);

    // if (!response.ok) {
    //     // Attempt to provide more context for common errors like mixed content
    //      if (window.location.protocol === 'https:' && weatherUrl.startsWith('https://')) {
    //          throw new Error(`WeatherStack HTTP Error: ${response.status}. Possible mixed content issue (page is HTTPS, API is HTTP).`);
    //      } else {
    //          throw new Error(`HTTP error from WeatherStack! Status: ${response.status}`);
    //      }
    // }
    
    const data = await response.json();
    console.log("WeatherStack response:", data); // Debug log

    if (data.error) {
         let errorInfo = data.error.info || 'Unknown Weatherstack API error';
         if (data.error.code === 101) { // Specific check for key error
             errorInfo = "Invalid or Inactive API Key provided to Weatherstack.";
         } else if (data.error.code === 615) { // Request failed / location not found
              errorInfo = `Weatherstack could not find location: ${city}. (${data.error.info})`;
         }
         throw new Error(`Weatherstack API Error ${data.error.code}: ${errorInfo}`);
    }
    if (!data.current || typeof data.current.temperature === 'undefined') {
         throw new Error('Weatherstack response missing current weather data or temperature.');
    }
    return data;
}
export { getWeatherForCity };