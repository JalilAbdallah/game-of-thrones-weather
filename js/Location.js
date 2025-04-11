async function getCityFromCoordinates(latitude, longitude) {
    // Use HTTPS for Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    console.log("Fetching city from:", nominatimUrl); // Debug log
    const response = await fetch(nominatimUrl, {
        headers: {
            'Accept': 'application/json' // Sometimes helps
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error from Nominatim! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Nominatim response:", data); // Debug log
    if (!data.address) {
         throw new Error('Nominatim did not return address information.');
    }
    // Extract city (may be in city, town, or village)
    return data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown Location'; // Added county fallback
}
export { getCityFromCoordinates };