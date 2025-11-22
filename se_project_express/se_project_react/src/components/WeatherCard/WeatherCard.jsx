import { useContext } from "react";
import React from "react";
import "./WeatherCard.css";
import CurrentTemperatureUnitContext from "../../../contexts/CurrentTemperatureUnitContext.js";
import { weatherConditionImages } from "../../utils/constants.js";


function WeatherCard({ weatherData }) {
  const contextValue = useContext(CurrentTemperatureUnitContext);

  // Use the temperature value directly, no conversion
  const temp = Math.round(Number(weatherData.temp));

  const condition = weatherData.condition || "clear";
  const timeOfDay = weatherData.timeOfDay || "day";

  const weatherImage =
    weatherConditionImages[timeOfDay]?.[condition]?.image ||
    weatherConditionImages["day"]["clear"].image;

  return (
    <section className="weather-card">
      <img
        src={weatherImage}
        alt={`${condition} weather`}
        className="weather-card__image"
      />
      <p className="weather-card__temp">
        {temp}&deg; {contextValue}
      </p>
    </section>
  );
}

export default WeatherCard;