const API_KEY = `8c43d0ea2c915987d0bd3f665e9427c1`;
const DEFAULT_CITY = 'Barcelona';

const displayCurrentLocation = async (lat, lon) => {
	const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`;
	const data = await fetch(url);
	const currentLocation = await data.json();
	const name = currentLocation[0].local_names.en;
	const country = currentLocation[0].country;
	location.innerText = `${name}, ${country}`;
	getWeatherData(lat, lon);
};

const getCurrentLocation = () => {
	try {
		navigator.geolocation.getCurrentPosition((position) => {
			let lat = position.coords.latitude;
			let lon = position.coords.longitude;
			displayCurrentLocation(lat, lon);
		});
	} catch (error) {
		console.log(error);
	}
};

const getLocation = async (city) => {
	try {
		const data = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`,
			{
				mode: 'cors',
			}
		);
		const response = await data.json();
		let { name, country } = response[0];
		location.innerText = `${name}, ${country}`;
		let { lat, lon } = response[0];
		getWeatherData(lat, lon);
	} catch (error) {
		console.log(error);
	}
};

const getWeatherData = async (lat, lon) => {
	try {
		const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${API_KEY}`;
		const data = await fetch(url, {
			mode: 'cors',
		});
		const weatherData = await data.json();
		const { icon } = weatherData.current.weather[0];
		displayDailyWeather(weatherData.daily);
		const epoch = weatherData.current.dt;
		const a = new Date(epoch * 1000).toDateString();
		date.innerText = a;
		temperature.innerText = weatherData.current.temp;
		windSpeed.innerText = weatherData.current.wind_speed + ' km/h';
		humidity.innerText = weatherData.current.humidity + ' %';
		weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
		weatherDescription.innerText = weatherData.current.weather[0].description;
	} catch (error) {
		console.log(error);
	}
};

const displayDailyWeather = (days) => {
	weeklyForecast.innerHTML = '';
	days.forEach((dayData) => {
		const { day, night } = dayData.temp;
		const { icon } = dayData.weather[0];
		const epoch = dayData.dt;
		const weekdays = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];
		const a = new Date(epoch * 1000);
		const weekday = weekdays[a.getDay()];

		const div = document.createElement('div');
		div.classList.add('day');

		const weekDay = document.createElement('p');
		weekDay.innerText = weekday;
		weekDay.classList.add('week-day');
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
const search = document.querySelector('#search');
const temperature = document.querySelector('.temperature');
const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.humidity-percent');
const location = document.querySelector('.location-current');
const weatherIcon = document.querySelector('.weather-icon');
const tempContainer = document.querySelector('.current-temp');
const unit = document.querySelector('.unit');
const weatherDescription = document.querySelector('.weather-description');
const weeklyForecast = document.querySelector('.week-container');
const date = document.querySelector('.date');
const getMyLocation = document.querySelector('#get-location');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	getLocation(search.value);
});
tempContainer.addEventListener('click', toggleFahrenheit);

window.addEventListener('load', getLocation(DEFAULT_CITY));

getMyLocation.addEventListener('click', (e) => {
	e.preventDefault();
	getCurrentLocation();
});
