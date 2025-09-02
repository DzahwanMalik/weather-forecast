const APIKEY = "983d7d11163542989ee62640251307";
const city = document.querySelector(".search-city").value;

function getIconEmoji(code, isNight){
    if([1000].includes(code)) return isNight ? "🌙" : "☀";
    if([1003].includes(code)) return "🌤"
    if([1006, 1009].includes(code)) return "☁"
    if([1030, 1135, 1147].includes(code)) return "🌫";
    if([1063, 1150, 1153,1180, 1183, 1240].includes(code)) return isNight ? "🌧" : "🌦";
    if([1186, 1189, 1192, 1195, 1243, 1246].includes(code)) return "🌧"
    if([1066, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return "❄"
    if([1069, 1072, 1168, 1171, 1204, 1207, 1237, 1249, 1252, 1261, 1264].includes(code)) return "❄"
    if([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈"
    return "🌡"
}

function isNight(hour) {
    return hour >= 18 || hour <= 6;
}

function getWeatherByCity(city) {
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${city}`;

    fetch(URL)
    .then(res => res.json())
    .then(data => {
        // Data dari API
        const location = data.location;
        const current = data.current;
        const forecast = data.forecast;

        // Cek Kondisi Malam
        const localHour = new Date(location.localtime).getHours();
        const nightMode = isNight(localHour);
        const forecastByHours = forecast.forecastday[0].hour;
        console.log(data)
        
        // Diambil dari Tag HTML
        const body = document.body;
        const card = document.querySelector(".weather-card");
        const sun = document.querySelector(".sun");
        const moon = document.querySelector(".moon");

        if(nightMode) {
            body.dataset.mode = "night";
            card.dataset.mode = "night";
            sun.style.display = "none";
            moon.style.display = "block";
        } else {
            body.dataset.mode = "day";
            card.dataset.mode = "day";
            sun.style.display = "block";
            moon.style.display = "none";
        }

        // Isi Konten Card nya
        document.querySelector(".city").textContent = location.name;

        document.querySelector(".date").textContent = new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        document.querySelector(".humidity").textContent = `💧 ${current.humidity} %`;
        document.querySelector(".wind").textContent = `💨 ${current.wind_kph} km/h`;
        document.querySelector(".weather-icon-img").src = current.condition.icon;
        document.querySelector(".temperature").textContent = `${current.temp_c} °C`;
        document.querySelectorAll(".forecast-icon-img").forEach((el, index) => {
            el.src = forecastByHours[index].condition.icon;
        });
        document.querySelectorAll(".forecast-temp").forEach((el, index) => {
            el.textContent = `${forecastByHours[index].temp_c} °C`;
        }) 
        document.querySelectorAll(".forecast-hour").forEach((el, index) => {
            el.textContent = forecastByHours[index].time.slice(-5);
        });

        // Menampilkan card forecast 24 jam
        forecastByHours.forEach((hourData, index) => {
            const slide = document.createElement("div");
            slide.classList.add("swiper-slide");
            slide.innerHTML = `
                <img src="${hourData.condition.icon}" alt="" class="forecast-icon-img" />
                <div class="forecast-temp">${hourData.temp_c} °C</div>
                <div class="forecast-hour">${hourData.time.slice(-5)}</div>
            `;
            document.querySelector(".swiper-wrapper").appendChild(slide);
        });

        // Function untuk update jam nya
        function updateClock() {
            const now = new Date().toLocaleTimeString();
            document.querySelector(".time").textContent = `${now}`;
        }

        updateClock();
        setInterval(updateClock, 1000)
    }).catch(err => {
        console.error(err);
    });
}

document.querySelector(".search-button").addEventListener("click", () => {
    const city = document.querySelector(".search-city").value;
    getWeatherByCity(city);
});

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,
  slidesPerView: 5
});