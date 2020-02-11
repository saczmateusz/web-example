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
  var newPanel = document.createElement('div')
  var insideDiv = document.createElement('div')
  var h3 = document.createElement('h3')
  var p1 = document.createElement('p')
  var p2 = document.createElement('p')
  var p3 = document.createElement('p')
  var p4 = document.createElement('p')
  newPanel.classList = 'child center'
  insideDiv.classList = 'card padding'
  insideDiv.style.cssText = 'min-height: 240px'
  h3.innerHTML = `${data.name}`
  p1.innerHTML = `Temperatura ${data.main.temp} st. C`
  p2.innerHTML = `Wilgotność: ${data.main.humidity}%`
  p3.innerHTML = `${data.weather[0].description}`
  p4.innerHTML = `Wiatr: ${data.wind.speed} m/s`
  insideDiv.appendChild(h3)
  insideDiv.appendChild(p1)
  insideDiv.appendChild(p2)
  insideDiv.appendChild(p3)
  insideDiv.appendChild(p4)
  newPanel.appendChild(insideDiv)

  document.getElementById('panels').appendChild(newPanel)
}
