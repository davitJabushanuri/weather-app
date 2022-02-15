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
	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${API_KEY}`;
	const data = await fetch(url);
	const weather = await data.json();

	temperature.innerText = weather.current.temp;
	windSpeed.innerText = weather.current.wind_speed;
	humidity.innerText = weather.current.humidity;
};

const toggleFahrenheit = () => {
	if (unit.innerText === 'C') {
		unit.innerText = 'F';
		const c = temperature.innerText;
		const f = (c * 9) / 5 + 32;
		temperature.innerText = f;
	} else {
		unit.innerText = 'C';
		const f = temperature.innerText;
		const c = (f - 32) / 1.8;
		temperature.innerText = c;
	}
};

const form = document.querySelector('form');
const temperature = document.querySelector('.temperature');
const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.humidity-percent');
const location = document.querySelector('.location-current');
const tempContainer = document.querySelector('.current-temp');
const unit = document.querySelector('.unit');

form.addEventListener('submit', getLocation);
tempContainer.addEventListener('click', toggleFahrenheit);
