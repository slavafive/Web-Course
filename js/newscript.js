apiKey = 'ae89b8a5c63d75e64e33be5a6e8f6ce2'

// localStorage.clear()
hideLoader()
upload()
getCurrentGeoposition()
uploadCities()


// upload
// -------------------------------------------------------------------------
function upload() {
    document.getElementById('form').addEventListener('submit', submitForm)
    document.querySelector('.refresh-small').addEventListener('click', refresh)
    document.querySelector('.refresh-big').addEventListener('click', refresh)
}

function submitForm(event) {
    let field = document.getElementById('add-new-city')
    let cityName = field.value

    if (localStorage.getItem(cityName) != null) {
        alert('City ' + cityName + ' was already added to the list')
    } else {
        addUnkownCity(cityName)
    }

    field.value = ''
    event.preventDefault()
}


function uploadCities() {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            console.log(key)
            addKnownCity(key);
        }
    }
}

// refresh
// -------------------------------------------------------------------------
function refresh() {
    let ul = document.getElementById('main-city-information-list')
    unFillCard(ul)
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
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`
    getCityWeather(url, null,function(data) {
        showWeatherForMainCity(data)
    })
}

function geolocationError(err) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=${apiKey})`
    getCityWeather(url, null,function(data) {
        showWeatherForMainCity(data)
    })
}


// fetching json
// -------------------------------------------------------------------------
function getCityWeather(url, loader, callback) {
    fetch(url)
        .then(handleErrors)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            callback(parseWeatherConditions(data))
        })
        .catch(function(error) {
            if (error === 'Not Found') {
                alert('City was not found')
                hideLoader()
            } else {
                alert(error)
            }
        })
}

function handleErrors(response) {
    if (!response.ok) {
        console.log('error')
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
        'City': data['name'],
        'Icon': `https://openweathermap.org/img/wn/${iconType}@2x.png`,
        'Temperature': (Math.round(data['main']['temp']) - 273).toString() + '\xB0C',
        'Image': 'images/' + getImageNameByOvercast(overcast),
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

function getImageNameByOvercast(overcast) {
    switch (overcast) {
        case 'Few clouds':
            return 'sunny-cloudy.png';
        case 'Clear sky':
        case 'Sunny':
            return 'sunny.png';
        case 'Rain':
            return 'rain.png';
        case 'Light snow':
        case 'Snow':
        case 'Heavy snow':
            return 'snow.png';
        default:
            return 'cloudy.png';
    }
}


function addUnkownCity(cityName) {
    showLoader()
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    getCityWeather(url, null, function(data) {
            let li = createCity(data)
            let ul = document.getElementById('city-list')
            ul.appendChild(li)
            hideLoader()
            localStorage.setItem(cityName, 'true')
            console.log('Set: ' + cityName)
        }
    )
}

function addKnownCity(cityName) {
    let ul = document.getElementById('city-list')
    let loader = createLoader(cityName)
    ul.appendChild(loader)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    getCityWeather(url, loader, function(data) {
            let newLi = createCity(data)
            ul.removeChild(loader)
            ul.appendChild(newLi)
            // localStorage.setItem(cityName, 'true')
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
    localStorage.removeItem(cityName);
}


// display weather
// -------------------------------------------------------------------------
function showWeatherForMainCity(data) {
    let div = document.getElementById('header-city')

    let h2 = div.firstElementChild
    let divChild = div.lastElementChild
    let img = divChild.firstElementChild
    let p = divChild.lastElementChild
    let ul = document.getElementById('main-city-information-list')

    h2.textContent = data['City']
    img.src = data['Icon']
    p.textContent = data['Temperature']

    fillCard(ul, data)

    hideMainLoader()
}

function fillCard(ul, data) {
    let keys = ['Wind speed', 'Overcast', 'Pressure', 'Humidity', 'Coordinates']
    let currentElement = ul.firstElementChild
    for (let i = 0; i < keys.length; i++) {
        currentElement.firstElementChild.textContent = keys[i] // first span
        currentElement.lastElementChild.textContent = data[keys[i]] // second span
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
    // let loaderTemplate = document.getElementById('loader-template')
    // let loaderCard = document.importNode(loaderTemplate.content, true)
    // loaderCard.querySelector('.city-name').textContent = cityName
    // return loaderCard

    let divCityInformation = document.createElement('div')
    divCityInformation.classList.add('city-information')

    let h3 = document.createElement('h3')
    h3.textContent = cityName

    let button = document.createElement('button');
    button.type = 'submit';
    button.classList.add('round');
    button.textContent = 'x';
    button.addEventListener('click', removeLoader);

    divCityInformation.appendChild(h3)
    divCityInformation.appendChild(button)

    let divLoaderWrapper = document.createElement('div')
    divLoaderWrapper.classList.add('loader-wrapper')

    let divLoader = document.createElement('div')
    divLoader.classList.add('loader')

    divLoaderWrapper.appendChild(divLoader)

    let divCityItem = document.createElement('li')
    divCityItem.classList.add('city-item')
    divCityItem.appendChild(divCityInformation)
    divCityItem.appendChild(divLoaderWrapper)

    return divCityItem
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
    let cityName = event.target.previousElementSibling.textContent;
    event.target.parentElement.parentElement.remove();
    localStorage.removeItem(cityName);
}