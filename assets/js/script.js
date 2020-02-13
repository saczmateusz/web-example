const proxy = 'https://cors-anywhere.herokuapp.com/';
const GEO_API_URL = `${proxy}https://darksky.net/geo?q=`;
let WEATHER_API_URL = `${proxy}api.openweathermap.org/data/2.5/weather?units=metric&lang=pl&APPID=5411260f763f2122d29f0fcc8397bbf1`;

let cities = [];
const form = document.querySelector('form');
const loading = document.querySelector('.loading');

window.onload = initialize;

function initialize() {
  loadLocalStorage();
}

function loadLocalStorage() {
  if (localStorage.getItem('cities')) {
    cities = JSON.parse(localStorage.getItem('cities'));
    loadWeatherForLocalStorage();
    document.querySelector('.message').innerHTML = 'Dodane miasta:';
  }
}

function loadWeatherForLocalStorage() {
  cities.map(city => {
    addNewCityToList(city);
  });
}

// Get coordinates for argument city
function getCoordinates(location) {
  return fetch(`${GEO_API_URL}${location}`).then(response => response.json());
}

// Get current weather data for argument coordinates
function getWeather(lat, lng) {
  return fetch(`${WEATHER_API_URL}&lat=${lat}&lon=${lng}`).then(response =>
    response.json(),
  );
}

form.addEventListener('submit', event => {
  // Prevent default submitting with page reload
  event.preventDefault();

  // Retrieve form input data
  var city = form.elements['city'].value;

  // If given city is not an empty string, get data for the closest station
  if (city !== '') {
    loading.style.display = 'flex';
    getCoordinates(city).then(response => {
      getWeather(response.latitude, response.longitude).then(addToLocalStorage);
    });
  } else alert('Formularz nie może być pusty');

  // Clear form input
  form.elements['city'].value = '';
});

// Generate panel with weather data and add it to html body
function addNewCityToList(data) {
  // var templateID = document.getElementById('template');
  var template = document.getElementById('template').cloneNode('true');

  template.querySelector('.city').innerHTML = data.name;
  template.querySelector('.temperature').innerHTML = data.temperature;
  template.querySelector('.humidity').innerHTML = data.humidity;
  template.querySelector('.wind').innerHTML = data.wind;
  template.querySelector('.description').innerHTML = data.description;

  document.getElementById('panels').appendChild(template);
  loading.style.display = 'none';
}

function addToLocalStorage(data) {
  var city = {
    name: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    description: data.weather[0].description,
  };
  if (cities.length === 0) {
    document.querySelector('.message').innerHTML = 'Dodane miasta:';
  }
  if (cities.findIndex(element => element.name === city.name) === -1) {
    cities = [...cities, city];
    localStorage.setItem('cities', JSON.stringify(cities));
    addNewCityToList(city);
  } else {
    loading.style.display = 'none';
    alert('To miasto znajduje się już na Twojej liście');
  }
}

function clearLocalStorage() {
  localStorage.clear();
  cities = [];
  const panels = document.getElementById('panels');
  panels.innerHTML = '';
  document.querySelector('.message').innerHTML = 'Dodaj miasta do swojej listy';
}
