import { apiKey, coordinates } from "./constants.js";

export function getWeatherData() {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${apiKey}`
  ).then((res) => 
    (res.ok ? 
    res.json() 
    : Promise.reject(`Error from weather API: ${res.status}`)
  ))
  .then((data) => {
    return parseWeatherData(data);
  });
}

function parseWeatherData(data) {
  const parsedData = {};
  parsedData.city = data.name;
  parsedData.temp = Math.round(data.main.temp);
  parsedData.sunrise = data.sys.sunrise; 
  parsedData.sunset = data.sys.sunset;   
  parsedData.condition = data.weather[0].main.toLowerCase(); 
  return parsedData;
}