apiKey = 'ae89b8a5c63d75e64e33be5a6e8f6ce2'

getCurrentGeoposition()
uploadCities()

// upload
// -------------------------------------------------------------------------
function uploadCities() {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            console.log(key)
            addCity(key);
        }
    }
}

// refresh
// -------------------------------------------------------------------------
function refresh() {
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
    getCityWeather(url, function(data) {
        showWeatherForMainCity(data)
    })
}


// fetching json
// -------------------------------------------------------------------------
function getCityWeather(url, loader, callback) {
    // let ul = document.getElementById('city-list')
    // let i = ul.children.length
    // let li = createLoader()
    // ul.appendChild(li)
    fetch(url)
        .then(handleErrors)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            callback(parseWeatherConditions(data)) // showWeatherForMainCity, hideMainLoader
        })
        .catch(function(error) {
            // if (loader != null) {
            //     let ul = document.getElementById('city-list')
            //     ul.removeChild(loader)
            // }
            if (error == 'Not Found') {
                alert('City was not found')
            } else {
                alert(error)
            }
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
    let overcast = capitalize(data['weather'][0]['description']);
    return {
        'City': data['name'],
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


// add city
// -------------------------------------------------------------------------
function enterCity() {
    let cityName = document.getElementById('add-new-city').value;
    if (!cityName || '' === cityName) {
        alert('The city name is empty')
        return
    }
    if (localStorage.getItem(cityName) != null) {
        alert('City ' + cityName + ' was already added to the list')
        return
    }
    addCity(cityName)
}

function addCity(cityName) {
    let ul = document.getElementById('city-list')
    let loader = createLoader(cityName)
    ul.appendChild(loader)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    getCityWeather(url, loader, function(data) {
            let newLi = createCity(data)
            // if loader exists (it could have been deleted) only then do this
            ul.removeChild(loader)
            ul.appendChild(newLi)
            localStorage.setItem(data['City'], 'true')
            // hideLoader(newLi)
        }
    )
}

document.getElementById("add-new-city").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("add-city").click();
        }
    });

/*
function createCity(data) {
    let h3 = document.createElement('h3');
    h3.textContent = data['City']

    let p = document.createElement('p');
    p.classList.add('temperature-city-information');
    p.textContent = data['Temperature']

    let img = document.createElement('img');
    img.classList.add('img-city-weather');
    img.src = data['Image']

    let button = document.createElement('button');
    button.type = 'submit';
    button.classList.add('round');
    button.textContent = 'x';
    button.addEventListener('click', removeCity);

    let div = document.createElement('div')
    div.classList.add('city-information');

    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(img);
    div.appendChild(button);

    let ulChild = document.createElement('ul');
    ulChild.classList.add('city-information-list');

    for (let i = 0; i < 5; i++) {
        let li = document.createElement('li');
        li.appendChild(document.createElement('span'))
        li.appendChild(document.createElement('span'));
        ulChild.appendChild(li);
    }

    fillCard(ulChild, data)

    let li = document.createElement('li');
    li.classList.add('city-item');
    li.appendChild(div);

    // let loader = createLoader()
    // li.appendChild(loader)

    li.appendChild(ulChild)

    // let ul = document.getElementById('city-list');
    // ul.appendChild(li);

    return li
}

 */

function createCity(data) {
    let cityTemplate = document.getElementById('city-template')
    let cityCard = document.importNode(cityTemplate.content, true)
    cityCard.querySelector('.city-name').textContent = data['City']
    cityCard.querySelector('.temperature-city-information').textContent = data['Temperature']
    cityCard.querySelector('.img-city-weather').src = data['Image']
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
    img.src = data['Image']
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


// loader
// -------------------------------------------------------------------------
function showMainLoader() {
    document.getElementById('header-city').hidden = true
    document.getElementById('header-loader').hidden = false
    document.getElementById('main-city-information-list').hidden = true
}

function hideMainLoader() {
    document.getElementById('header-city').hidden = false
    document.getElementById('header-loader').hidden = true
    document.getElementById('main-city-information-list').hidden = false
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

function showLoader(li) {
    let div = li.getElementsByClassName('city-information')[0]
    let loader = li.getElementsByClassName('loader')[0]
    let ul = li.getElementsByClassName('city-information-list')[0]

    div.getElementsByTagName('p')[0].hidden = true
    div.getElementsByTagName('img')[0].hidden = true
    ul.hidden = true

    loader.hidden = false
}

function hideLoader(li) {
    let div = li.getElementsByClassName('city-information')[0]
    let loader = li.getElementsByClassName('loader')[0]
    let ul = li.getElementsByClassName('city-information-list')[0]

    div.getElementsByTagName('p')[0].hidden = false
    div.getElementsByTagName('img')[0].hidden = false
    ul.hidden = false

    loader.hidden = true
}

function getListElementByCityName(cityName) {
    let ul = document.getElementById('city-list');
    let child = ul.firstElementChild;
    while (child) {
        let currentCityName = child.firstElementChild.firstElementChild.textContent;
        if (cityName == currentCityName) {
            return child;
        }
        child = child.nextElementSibling;
    }
    return null;
}

function removeLoader(event) {
    let cityName = event.target.previousElementSibling.textContent;
    event.target.parentElement.parentElement.remove();
    localStorage.removeItem(cityName);
}