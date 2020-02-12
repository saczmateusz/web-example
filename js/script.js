const proxy = 'https://cors-anywhere.herokuapp.com/';
const GEO_API_URL = `${proxy}https://darksky.net/geo?q=`;
let WEATHER_API_URL = `${proxy}api.openweathermap.org/data/2.5/weather?units=metric&lang=pl&APPID=`;

var form = document.forms[0];
let lat = '';
let lon = '';
let cities = [];

window.onload = loadScript;

function loadScript() {
  var xobj = new XMLHttpRequest();
  xobj.open('GET', './js/API_KEY.json', true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == '200') {
      var API_KEY = JSON.parse(xobj.responseText);
      WEATHER_API_URL = `${WEATHER_API_URL}${API_KEY['key']}`;
    }
  };
  xobj.send(null);
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

function submitForm() {
  // Retrieve form input
  var city = form.elements['city'].value;

  // If city is not an empty string then find its coordinates
  if (city !== '') {
    getCoordinates(city).then(response => {
      lat = response.latitude;
      lon = response.longitude;
      getWeather(lat, lon).then(response => addToLocalStorage(response));
    });
  } else alert('Formularz nie może być pusty');
  // Clear form input
  form.elements['city'].value = '';
}

// Generate panel with weather data and add it to html body
function addNewCityToList(data) {
  var templateID = document.getElementById('template');
  var template = templateID.cloneNode('true');

  template.querySelector('.city').innerHTML = data.name;
  template.querySelector('.temperature').innerHTML = data.temperature;
  template.querySelector('.humidity').innerHTML = data.humidity;
  template.querySelector('.wind').innerHTML = data.wind;
  template.querySelector('.description').innerHTML = data.description;

  document.getElementById('panels').appendChild(template);
  // addToLocalStorage(data);
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
  } else alert('To miasto znajduje się już na Twojej liście');
}

function clearLocalStorage() {
  localStorage.clear();
  const panels = document.getElementById('panels');
  panels.innerHTML = '';
  document.querySelector('.message').innerHTML = 'Dodaj miasta do swojej listy';
}
