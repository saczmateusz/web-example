const proxy = 'https://cors-anywhere.herokuapp.com/'
const GEO_API_URL = `${proxy}https://darksky.net/geo?q=`
let WEATHER_API_URL = `${proxy}api.openweathermap.org/data/2.5/weather?units=metric&lang=pl&APPID=`

var form = document.forms[0]
let lat = ''
let lon = ''

function loadScript() {
  var xobj = new XMLHttpRequest()
  xobj.open('GET', './js/API_KEY.json', true)
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == '200') {
      var API_KEY = JSON.parse(xobj.responseText)
      WEATHER_API_URL = `${WEATHER_API_URL}${API_KEY['key']}`
    }
  }
  xobj.send(null)
}

function getCoordinates(location) {
  return fetch(`${GEO_API_URL}${location}`).then(response => response.json())
}

function getForecast(lat, lng) {
  return fetch(`${WEATHER_API_URL}&lat=${lat}&lon=${lng}`).then(response =>
    response.json(),
  )
}

function submitForm() {
  var city = form.elements['city'].value
  getCoordinates(city).then(response => {
    lat = response.latitude
    lon = response.longitude
    getForecast(lat, lon).then(response => append(response))
  })

  form.elements['city'].value = '';
}

function append(data) {
  var templateID = document.getElementById("template");
  var template = templateID.cloneNode("true");

  template.querySelector(".city").innerHTML = data.name;
  template.querySelector(".temperature").innerHTML = data.main.temp;
  template.querySelector(".humidity").innerHTML = data.main.humidity;
  template.querySelector(".wind").innerHTML = data.wind.speed;
  template.querySelector(".description").innerHTML = data.weather[0].description;

  document.getElementById('panels').appendChild(template)
}
