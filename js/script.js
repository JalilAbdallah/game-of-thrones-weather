document.addEventListener('DOMContentLoaded', async function() {
    let getWeatherForCity, getCityFromCoordinates;
    try {
        // Dynamically import functions
        ({ getWeatherForCity } = await import('./weather.js'));
        ({ getCityFromCoordinates } = await import('./Location.js'));
    } catch (error) {
        console.error("Error importing modules:", error);
        displayError(new Error("Failed to load required modules. Please try again later."));
        return; // Exit if imports fail
    }

    // --- DOM Elements ---
    const weatherStatus = document.getElementById('weather-status');
    const finalResult = document.getElementById('final-result');
    const quoteElement = document.getElementById('quote');
    const bodyElement = document.body;
    const searchButton = document.querySelector('.search-container i');
    const searchInput = document.getElementById('search');
    const quoteAuthor = document.getElementById('said-by');

    const quotes = [
        { quote: "Winter is coming.", saidBy: "Ned Stark" },
        { quote: "The night is dark and full of terrors.", saidBy: "Melisandre" },
        { quote: "When you play the game of thrones, you win or you die.", saidBy: "Cersei Lannister" },
        { quote: "A lion doesn't concern himself with the opinions of the sheep.", saidBy: "Tywin Lannister" },
        { quote: "Chaos isn't a pit. Chaos is a ladder.", saidBy: "Petyr Baelish" },
        { quote: "A dragon is not a slave.", saidBy: "Daenerys Targaryen" },
        { quote: "The past is already written. The ink is dry.", saidBy: "Bran Stark" },
        { quote: "Winter is here.", saidBy: "House Stark" },
        { quote: "We are the watchers on the wall.", saidBy: "Night's Watch" },
        { quote: "Whats for dinner?." , saidBy: "Ameer Yasen" },
    ];

    // ========================================================================
    // --- Reusable Functions ---
    // ========================================================================

    /**
     * Sets the UI elements to a loading/pending state.
     */
    function setLoadingState(statusMessage = "...") {
        weatherStatus.textContent = statusMessage;
        finalResult.textContent = "...";
        quoteElement.textContent = "Asking the Maesters...";
        // Optionally reset background or set a default loading background
        bodyElement.style.backgroundImage = `url('../assets/images/loading.jpg')`;
    }

    /**
     * Takes weather data, determines region/quote, and updates the UI.
     * @param {object} weatherData - The weather data object from getWeatherForCity.
     */
    function displayWeatherData(weatherData) {
        const temperature = weatherData.current.temperature;
        const regionInfo = getRegionByTemperature(temperature);
        const selectedQuote = getRandomQuote();

        // Update the main HTML elements
        weatherStatus.textContent = `${temperature}°C, ${regionInfo.description}`;
        finalResult.textContent = regionInfo.region;
        quoteElement.textContent = `"${selectedQuote.quote}"`;
        quoteAuthor.textContent = `- ${selectedQuote.saidBy}`;

        // Update background
        bodyElement.style.backgroundImage = `url('${regionInfo.backgroundImage}')`;
    }

    /**
     * Displays an error message in the UI.
     * @param {Error} error - The error object.
     */
    function displayError(error) {
        console.error("Error:", error); // Log the full error for debugging
        weatherStatus.textContent = "";
        finalResult.textContent = "Nothing";
        // Provide a more user-friendly message based on the error type if possible
        let userMessage = "Cant find the weather for your city.";
        if (error.message.includes("404") || error.message.toLowerCase().includes("city not found")) {
             userMessage = "The city you are looking for is not on the map.";
        } else if (error.message.includes("Geolocation error")) {
             userMessage = error.message; // Use the specific geolocation message
        } else if (error.message.includes("determine city name")) {
             userMessage = "Could not pinpoint your location on the map.";
        } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            userMessage = "Could not connect to the weather service. Check your internet connection.";
        } else if (error.message.includes("load required modules")) {
            userMessage = error.message; // Use the specific module loading message
        }

        quoteElement.textContent = userMessage;
        console.log("Displayed Error message:", userMessage); // Log the displayed message
    }

    /**
     * Fetches weather for a given city and updates the UI.
     * Handles the core async logic after a city name is known.
     * @param {string} cityName - The name of the city.
     */
    async function processCityWeather(cityName) {
        weatherStatus.textContent = `Fetching weather for ${cityName}...`; // Update status
        const weatherData = await getWeatherForCity(cityName); // Fetch data
        displayWeatherData(weatherData); // Update UI with results
    }

    /**
     * Gets a random quote from the predefined list.
     * @returns {string} A random quote.
     */
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex] || "Valar Morghulis."; // Default fallback
    }

    /**
     * Determines the Game of Thrones region based on temperature.
     * @param {number} temp - The temperature in Celsius.
     * @returns {object} An object containing region, description, and backgroundImage path.
     */
    function getRegionByTemperature(temp) {
         // ** IMPORTANT: Make sure these image paths are correct relative to your HTML **
        if (temp < -10) return { region: "The Wall", description: "Blizzard", backgroundImage: "../assets/images/the_wall.jpg" };
        if (temp < 5) return { region: "Winterfell", description: "Snowing", backgroundImage: "../assets/images/winterfell.jpg" };
        if (temp < 10) return { region: "The Iron Islands", description: "Stormy", backgroundImage: "../assets/images/the_iron_islands.jpg" };
        if (temp < 15) return { region: "The Vale", description: "Foggy", backgroundImage: "../assets/images/the_vale_of_arryn.jpg" };
        if (temp < 20) return { region: "Dragonstone", description: "Overcast", backgroundImage: "../assets/images/dragonstone.jpg" };
        if (temp < 25) return { region: "King's Landing", description: "Sunny", backgroundImage: "../assets/images/kings_landing.jpg" };
        if (temp < 30) return { region: "The Dothraki Sea", description: "Dry and windy", backgroundImage: "../assets/images/dothraki_sea.jpg" };
        if (temp < 35) return { region: "Meereen", description: "Humid", backgroundImage: "../assets/images/meereen.jpg" };
        if (temp <= 40) return { region: "Dorne", description: "Swelteringly unbearable", backgroundImage: "../assets/images/dorne.jpg" };
        // Default for temperatures outside the defined ranges (e.g., > 40 or potentially <-10 if the first check was different)
        return { region: "Beyond Westeros", description: "Unknown", backgroundImage: "../assets/images/loading.jpg" };
    }

    // ========================================================================
    // --- Event Listeners and Initial Load ---
    // ========================================================================

    // --- Search Button Logic ---
    searchButton.addEventListener('click', async () => {
        const cityName = searchInput.value.trim();
        if (!cityName) {
            displayError(new Error("Please enter a city name."));
            return;
        }

        setLoadingState("Finding city..."); // Set loading state
        searchButton.disabled = true; // Disable button

        try {
            await processCityWeather(cityName); // Use the reusable function
        } catch (error) {
            console.error("Error during search:", error); // Log specific context
            displayError(error); // Display error in UI
        } finally {
            searchButton.disabled = false; // Re-enable button
        }
    });

     // Allow searching by pressing Enter in the input field
     searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it's in a form
            searchButton.click(); // Trigger the search button's click event
        }
    });


    // --- Geolocation Logic ---
    function handleGeolocation() {
        if ("geolocation" in navigator) {
            setLoadingState("Finding location..."); // Set initial loading state

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // Geolocation Success
                    try {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        weatherStatus.textContent = "Finding city from coordinates..."; // More specific status

                        const city = await getCityFromCoordinates(latitude, longitude);

                        if (city && city !== 'Unknown Location') {
                            await processCityWeather(city); // Use the reusable function
                        } else {
                            throw new Error('Could not determine city name from coordinates.');
                        }
                    } catch (error) {
                        console.error("Error processing geolocation data:", error); // Log specific context
                        displayError(error); // Display error in UI
                    }
                },
                (error) => {
                    // Geolocation Error
                    let message = `Geolocation error: ${error.message} (Code: ${error.code})`;
                    if (error.code === error.PERMISSION_DENIED) {
                        message = "Location permission denied. Search for a city manually.";
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        message = "Location information is unavailable. Search for a city manually.";
                    } else if (error.code === error.TIMEOUT) {
                        message = "Location request timed out. Search for a city manually.";
                    }
                    displayError(new Error(message));
                },
                { // Geolocation options
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 600000
                }
            );
        } else {
            // Geolocation not supported
            displayError(new Error("Geolocation is not supported by this browser. Please search for a city."));
        }
    }

    // --- Initial Load ---
    handleGeolocation(); // Attempt to use geolocation on load

});