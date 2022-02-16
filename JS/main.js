const API_KEY = `8c43d0ea2c915987d0bd3f665e9427c1`;

const getLocation = async (e) => {
	e.preventDefault();
	const data = await fetch(
		`http://api.openweathermap.org/geo/1.0/direct?q=${search.value}&limit=5&appid=8c43d0ea2c915987d0bd3f665e9427c1`
	);
	const response = await data.json();
	let { name, country } = response[0];
	location.innerText = `${name}, ${country}`;
	let { lat, lon } = response[0];
	getWeatherData(lat, lon);
};

const getWeatherData = async (lat, lon) => {
	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${API_KEY}`;
	const data = await fetch(url);
	const weatherData = await data.json();
	const { icon } = weatherData.current.weather[0];
	displayDailyWeather(weatherData.daily);
	temperature.innerText = weatherData.current.temp;
	windSpeed.innerText = weatherData.current.wind_speed;
	humidity.innerText = weatherData.current.humidity;
	weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	weatherDescription.innerText = weatherData.current.weather[0].description;
};

const displayDailyWeather = (days) => {
	weeklyForecast.innerHTML = '';
	days.forEach((dayData) => {
		const { day, night } = dayData.temp;
		const { icon } = dayData.weather[0];
		console.log(icon);

		///////////////
		const div = document.createElement('div');
		div.classList.add('day');

		const weekDay = document.createElement('p');
		weekDay.innerText = `Today`;
		div.appendChild(weekDay);

		const dayNight = document.createElement('div');
		dayNight.classList.add('day-night');
		dayNight.innerHTML = `<p>${day}  °c</p> <p class='dark'>${night} °c</p>`;
		div.appendChild(dayNight);

		const image = document.createElement('img');
		image.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
		image.classList.add('week-icon');
		div.appendChild(image);

		weeklyForecast.appendChild(div);
	});
};

const toggleFahrenheit = () => {
	if (unit.innerText === '°c') {
		unit.innerText = '°F';
		const c = temperature.innerText;
		const f = (c * 9) / 5 + 32;
		temperature.innerText = f.toFixed(2);
	} else {
		unit.innerText = '°c';
		const f = temperature.innerText;
		const c = (f - 32) / 1.8;
		temperature.innerText = c.toFixed(2);
	}
};

const form = document.querySelector('form');
const temperature = document.querySelector('.temperature');
const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.humidity-percent');
const location = document.querySelector('.location-current');
const weatherIcon = document.querySelector('.weather-icon');
const tempContainer = document.querySelector('.current-temp');
const unit = document.querySelector('.unit');
const weatherDescription = document.querySelector('.weather-description');
const weeklyForecast = document.querySelector('.week-container');

form.addEventListener('submit', getLocation);
tempContainer.addEventListener('click', toggleFahrenheit);
