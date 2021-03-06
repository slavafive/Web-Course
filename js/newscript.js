apiKey = 'ae89b8a5c63d75e64e33be5a6e8f6ce2'

// -------------------------------------------------------------------------
upload()

function upload() {
    hideLoader()
    document.getElementById('form').addEventListener('submit', submitForm)
    document.querySelector('.refresh-small').addEventListener('click', refresh)
    document.querySelector('.refresh-big').addEventListener('click', refresh)
    getCurrentGeoposition()
    uploadCities()
}

function submitForm(event) {
    let field = document.getElementById('add-new-city')
    let cityName = field.value

    addUnkownCity(cityName)

    field.value = ''
    event.preventDefault()
}


function uploadCities() {
    let url = 'http://localhost:8080/favourites'
    fetch(url)
        .then(handleErrors)
        .then((response) => {
            return response.json()
        })
        .then((cities) => {
            for (let i = 0; i < cities.length; i++) {
                addKnownCity(cities[i])
            }
        })
        .catch(function(error) {
            alert(error)
        })
}

// refresh
// -------------------------------------------------------------------------
function refresh() {
    let mainCityList = document.getElementById('main-city-information-list')
    unFillCard(mainCityList)
    getCurrentGeoposition()
}

// geoposition
// -------------------------------------------------------------------------
function getCurrentGeoposition() {
    showMainLoader()
    let geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(getCurrentLocation, geolocationError)
}

function getCurrentLocation(position) {
    let url = `http://localhost:8080/weather/coordinates?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
    getCityWeather(url,{}, function(data) {
        showWeatherForMainCity(data)
    })
}

function geolocationError(err) {
    let url = `http://localhost:8080/weather/city?q=Moscow`
    getCityWeather(url,{}, function(data) {
        showWeatherForMainCity(data)
    })
}


// fetching json
// -------------------------------------------------------------------------
function getCityWeather(url, params, callback) {
    fetch(url, params)
        .then(handleErrors)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            callback(parseWeatherConditions(data))
        })
        .catch(function(error) {
            if (error === 'Bad Request') {
                alert(`City was already added to the list`)
            } else if (error === 'Not Found') {
                alert('City was not found')
            } else {
                alert(error)
            }
            hideLoader()
        })
}

function handleErrors(response) {
    if (!response.ok) {
        throw response.statusText
    }
    return response
}


// parsing
// -------------------------------------------------------------------------
function parseWeatherConditions(data) {
    let overcast = capitalize(data['weather'][0]['description'])
    let iconType = data['weather'][0]['icon']
    return {
        'Id': data['id'],
        'City': data['name'],
        'Icon': `https://openweathermap.org/img/wn/${iconType}@2x.png`,
        'Temperature': (Math.round(data['main']['temp'])).toString() + '\xB0C',
        'Wind speed': data['wind']['speed'] + ' m/s',
        'Overcast': overcast,
        'Pressure': data['main']['pressure'] + ' hpa',
        'Humidity': data['main']['humidity'] + ' %',
        'Coordinates': '[' + parseFloat(data['coord']['lat']).toFixed(2) + ', ' + parseFloat(data['coord']['lon']).toFixed(2) + ']'
    }
}

function capitalize(str) {
    return str.replace(/^\w/, (c) => c.toUpperCase());
}


function addUnkownCity(cityName) {
    showLoader()
    let url = `http://localhost:8080/favourites`
    let params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': cityName })
    }
    getCityWeather(url, params, function(data) {
            let cityItem = createCity(data)
            let cityList = document.getElementById('city-list')
            cityList.appendChild(cityItem)
            hideLoader()
        }
    )
}

function addKnownCity(cityName) {
    let cityList = document.getElementById('city-list')
    let loader = createLoader(cityName)
    cityList.appendChild(loader)
    let url = `http://localhost:8080/weather/city?q=${cityName}`
    getCityWeather(url, {}, function(data) {
            try {
                let newCityItem = createCity(data)
                cityList.removeChild(loader)
                cityList.appendChild(newCityItem)
            } catch (error) {
                return
            }
        }
    )
}

function createCity(data) {
    let cityTemplate = document.getElementById('city-template')
    let cityCard = document.importNode(cityTemplate.content, true)
    cityCard.querySelector('.city-name').textContent = data['City']
    cityCard.querySelector('.temperature-city-information').textContent = data['Temperature']
    cityCard.querySelector('.img-city-weather').src = data['Icon']
    cityCard.querySelector('.round').addEventListener('click', removeCity)
    let ul = cityCard.querySelector('#city-information-list')
    fillCard(ul, data)
    return cityCard
}


// remove city
// -------------------------------------------------------------------------
function removeCity(event) {
    let cityName = event.target.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    event.target.parentElement.parentElement.remove();
    removeCityFromStorage(cityName)
}


// display weather
// -------------------------------------------------------------------------
function showWeatherForMainCity(data) {
    let headerDiv = document.getElementById('header-city')

    headerDiv.getElementsByTagName('h2')[0].textContent = data['City']
    let divChild = headerDiv.getElementsByTagName('div')[0]
    divChild.getElementsByTagName('img')[0].src = data['Icon']
    divChild.getElementsByTagName('p')[0].textContent = data['Temperature']
    let ul = document.getElementById('main-city-information-list')

    fillCard(ul, data)

    hideMainLoader()
}

function fillCard(ul, data) {
    let keys = ['Wind speed', 'Overcast', 'Pressure', 'Humidity', 'Coordinates']
    let currentElement = ul.firstElementChild
    for (let i = 0; i < keys.length; i++) {
        currentElement.firstElementChild.textContent = keys[i]
        currentElement.lastElementChild.textContent = data[keys[i]]
        currentElement = currentElement.nextElementSibling
    }
}


function unFillCard(ul) {
    let currentElement = ul.firstElementChild
    for (let i = 0; i < 5; i++) {
        currentElement.lastElementChild.textContent = ''
        currentElement = currentElement.nextElementSibling
    }
}


// loader
// -------------------------------------------------------------------------
function showMainLoader() {
    document.querySelector('.img-header-city').hidden = true
    document.querySelector('.temperature-header-city').hidden = true
    document.getElementById('h2').hidden = true
    // document.getElementById('main-city-information-list').hidden = true
    document.getElementById('header-loader').hidden = false
}

function hideMainLoader() {
    document.querySelector('.img-header-city').hidden = false
    document.querySelector('.temperature-header-city').hidden = false
    document.getElementById('h2').hidden = false
    // document.getElementById('main-city-information-list').hidden = false
    document.getElementById('header-loader').hidden = true
}

function createLoader(cityName) {
    let loaderTemplate = document.getElementById('loader-template')
    let loaderCard = document.importNode(loaderTemplate.content, true)
    loaderCard.querySelector('.city-name').textContent = cityName
    loaderCard.querySelector('.round').addEventListener('click', removeLoader)
    loaderCard.querySelector('.city-item').id = 'loader-' + cityName
    return loaderCard.querySelector('.city-item')
}

function showLoader() {
    document.getElementById('add-loader-wrapper').hidden = false
    document.getElementById('add-loader-child').hidden = false
}

function hideLoader() {
    document.getElementById('add-loader-wrapper').hidden = true
    document.getElementById('add-loader-child').hidden = true
}

function removeLoader(event) {
    let cityName = event.target.previousElementSibling.textContent
    event.target.parentElement.parentElement.remove()
    removeCityFromStorage(cityName)
}

function removeCityFromStorage(cityName) {
    let url = 'http://localhost:8080/favourites'
    let params = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': cityName })
    }

    fetch(url, params)
        .then(handleErrors)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
        })
        .catch(function(error) {
            alert(error)
        })
}