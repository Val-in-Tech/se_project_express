import React from "react";
import WeatherCard from "../WeatherCard/WeatherCard.jsx";
import ItemCard from "../ItemCard/ItemCard.jsx";
import "./Main.css";
import "../../vendor/fonts/fonts.css";
import { defaultClothingItems } from "../../utils/defaultClothingItems";

function Main({ clothingItems, onCardClick, weatherData, tempUnit, onCardLike, currentUser }) {
  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <p className="main__text">
        Today is {weatherData.temp}°{tempUnit} / You may want to wear:
      </p>
      <div className="main__container">
        <ul className="main__card-list">
          {clothingItems.map((item) => (
            <ItemCard
              key={item._id}
              data={item}
              onImageClick={() => onCardClick(item)}
              onCardLike={onCardLike}
              currentUser={currentUser}
            />
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Main;