document.addEventListener('DOMContentLoaded', async function() {
    const { getWeatherForCity } = await import('./weather.js'); // Dynamically import the function from Weather.js
    const { getCityFromCoordinates } = await import('./Location.js'); // Dynamically import the function from Location.js
    
    // Main HTML elements from index.html
    const witherStatus = document.getElementById('wither-status');
    const finalResult = document.getElementById('final-result');
    const quoteElement = document.getElementById('quote'); // Renamed for clarity
    const bodyElement = document.body;

    // Dummy Quotes
    const quotes = [
        "Winter is coming.",
        "The night is dark and full of terrors.",
        "When you play the game of thrones, you win or you die.",
        "A lion doesn't concern himself with the opinions of the sheep.",
        "Chaos isn't a pit. Chaos is a ladder.",
        "The things I do for love."];

    // Function to get a random quote
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex] || "Valar Morghulis."; // Default if array empty
    }

    // Function for region mapping based on temperature
    function getRegionByTemperature(temp) {
        // ** IMPORTANT: Make sure these image paths are correct relative to your HTML **
        if (temp >= -30 && temp < -10) return { region: "The Wall", description: "Blizzard", backgroundImage: "../assets/images/the_wall.jpg" };
        if (temp >= -10 && temp < 5) return { region: "Winterfell", description: "Snowing", backgroundImage: "../assets/images/winterfell.jpg" };
        if (temp >= 5 && temp < 10) return { region: "The Iron Islands", description: "Stormy", backgroundImage: "../assets/images/the_iron_islands.jpg" };
        if (temp >= 10 && temp < 15) return { region: "The Vale", description: "Foggy", backgroundImage: "../assets/images/the_vale_of_arryn.jpg" };
        if (temp >= 15 && temp < 20) return { region: "Dragonstone", description: "Overcast", backgroundImage: "../assets/images/dragonstone.jpg" };
        if (temp >= 20 && temp < 25) return { region: "King's Landing", description: "Sunny", backgroundImage: "../assets/images/kings_landing.jpg" };
        if (temp >= 25 && temp < 30) return { region: "The Dothraki Sea", description: "Dry and windy", backgroundImage: "../assets/images/dothraki_sea.jpg" };
        if (temp >= 30 && temp < 35) return { region: "Meereen", description: "Humid", backgroundImage: "../assets/images/meereen.jpg" };
        if (temp >= 35 && temp <= 40) return { region: "Dorne", description: "Swelteringly unbearable", backgroundImage: "../assets/images/dorne.jpg" };
        // Add cases for > 40 or < -30 if needed
        return { region: "Beyond Westeros", description: "Unknown", backgroundImage: "../assets/images/default.jpg" }; // Default
    }   

    // --- Helper to update UI with Error ---
    function displayError(error) {
        console.error("Error:", error); // Log the full error for debugging
        witherStatus.textContent = "Sorry";
        finalResult.textContent = "Nothing";
        console.log("Error message:", error.message); // Log the error message for debugging
        quoteElement.textContent = `The city you are looking for is not on the map`;
    }


    if ("geolocation" in navigator) {
        witherStatus.textContent = "Finding location...";
        finalResult.textContent = "...";
        quoteElement.textContent = "Asking the Maesters...";

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(`Geolocation acquired: Lat=${latitude}, Lon=${longitude}`);

                    witherStatus.textContent = "Finding city...";
                    const city = await getCityFromCoordinates(latitude, longitude);
                    console.log(`City found: ${city}`);

                    if (city && city !== 'Unknown Location') {
                        witherStatus.textContent = "Fetching weather...";
                        const weatherData = await getWeatherForCity(city);

                        // No need for the 'if (weatherData.current...)' check here,
                        // as getWeatherForCity now throws an error if data is bad.

                        const temperature = weatherData.current.temperature;
                        const regionInfo = getRegionByTemperature(temperature);
                        const selectedQuote = getRandomQuote();

                        // Update the main HTML elements
                        witherStatus.textContent = `${temperature}°C, ${regionInfo.description}`; // e.g., "Snowing"
                        finalResult.textContent = regionInfo.region; // e.g., "Winterfell"
                        // Display temp and quote in the footer/quote element perhaps?
                        // Adjust where you display things based on your design preference:
                        // finalResult.textContent = `${temperature}°C`; // Option: Display temp here
                        // quoteElement.textContent = regionInfo.region; // Option: Display region here

                        quoteElement.textContent = `"${selectedQuote}"`; // Example combined display

                        // Update background
                        bodyElement.style.backgroundImage = `url('${regionInfo.backgroundImage}')`;

                    } else {
                        // Handle case where Nominatim couldn't find a usable city name
                        throw new Error('Could not determine city name from coordinates.');
                    }
                } catch (error) {
                    displayError(error); // Use the helper function to show error in UI
                }
            },
            (error) => {
                // Handle error getting the geolocation itself
                let message = `Geolocation error: ${error.message} (Code: ${error.code})`;
                 if (error.code === error.PERMISSION_DENIED) {
                    message = "Location permission denied. Please allow location access.";
                 } else if (error.code === error.POSITION_UNAVAILABLE) {
                     message = "Location information is unavailable.";
                 } else if (error.code === error.TIMEOUT) {
                     message = "Location request timed out.";
                 }
                displayError(new Error(message));
            },
            { // Geolocation options
                enableHighAccuracy: false, // Can be true, but uses more battery
                timeout: 10000, // 10 seconds
                maximumAge: 600000 // Use cached position up to 10 minutes old
            }
        );
    } else {
        displayError(new Error("Geolocation is not supported by this browser."));
    }
});