let API_KEY = ''
const proxy = 'https://cors-anywhere.herokuapp.com/'
const WEATHER_API_URL = `${proxy}api.openweathermap.org/data/2.5/forecast?units=metric&lang=pl&APPID=${API_KEY}`
const GEO_API_URL = `${proxy}https://darksky.net/geo?q=`

function loadScript() {
  var xobj = new XMLHttpRequest()
  xobj.open('GET', './js/API_KEY.json', true)
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == '200') {
      API_KEY = JSON.parse(xobj.responseText)
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

// XD nie patrz tu