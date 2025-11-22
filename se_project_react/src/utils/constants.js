const coordinates = { lat: "29.562921", lon: "-98.899023" };
const apiKey = "35fa9b30534f462d16831bb55657ab90";

const weatherConditionImages = {
    day: {
        clear: {
            name: "clear",
            image: new URL("../assets/day/clearsky_day.png", import.meta.url).href,
        },
        cloudy: {
            name: "cloudy",
            image: new URL("../assets/day/cloudy_day.png", import.meta.url).href,
        },
        fog: {
            name: "fog",
            image: new URL("../assets/day/fog_day.png", import.meta.url).href,
        },
        rainy: {
            name: "rainy",
            image: new URL("../assets/day/rain_day.png", import.meta.url).href,
        },
        snowy: {
            name: "snowy",
            image: new URL("../assets/day/snow_day.png", import.meta.url).href,
        },
        storm: {
            name: "storm",
            image: new URL("../assets/day/storm_day.png", import.meta.url).href,
        }
    },
    night: {
        clear: {
            name: "clear",
            image: new URL("../assets/night/clearsky_night.png", import.meta.url).href,
        },
        cloudy: {
            name: "cloudy",
            image: new URL("../assets/night/cloudy_night.png", import.meta.url).href,
        },
        fog: {
            name: "fog",
            image: new URL("../assets/night/fog_night.png", import.meta.url).href,
        },
        rainy: {
            name: "rainy",
            image: new URL("../assets/night/rain_night.png", import.meta.url).href,
        },
        snowy: {
            name: "snowy",
            image: new URL("../assets/night/snow_night.png", import.meta.url).href,
        },
        storm: {
            name: "storm",
            image: new URL("../assets/night/storm_night.png", import.meta.url).href,
        }
    },
}

export { coordinates, apiKey, weatherConditionImages };