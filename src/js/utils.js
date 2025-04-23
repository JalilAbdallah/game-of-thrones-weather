function getTemperatureRange(temp) {
  if (temp >= -30 && temp < -10) return "-30_-10";
  if (temp >= -10 && temp < 5) return "-10_5";
  if (temp >= 5 && temp < 10) return "5_10";
  if (temp >= 10 && temp < 15) return "10_15";
  if (temp >= 15 && temp < 20) return "15_20";
  if (temp >= 20 && temp < 25) return "20_25";
  if (temp >= 25 && temp < 30) return "25_30";
  if (temp >= 30 && temp < 35) return "30_35";
  if (temp >= 35 && temp <= 40) return "35_40";
  return null;
}

function splitQuote(quote) {
  const words = quote.split(" ");
  let firstLine = "";
  let secondLine = "";
  let midPoint = Math.ceil(words.length / 2);

  for (let i = 0; i < words.length; i++) {
    if (i < midPoint) {
      firstLine += words[i] + " ";
    } else {
      secondLine += words[i] + " ";
    }
  }

  return { firstLine: firstLine.trim(), secondLine: secondLine.trim() };
}
