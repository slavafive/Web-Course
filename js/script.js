apiKey = 'c1fba4b3fbec3b5f92b79c28980e8024';

window.navigator.geolocation.getCurrentPosition(console.log, console.log);

document.getElementById("add-new-city")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("add-city").click();
        }
    });

upload();

function upload() {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            addCity(key);
        }
    }
}

function refresh() {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            let li = getCityElementByCityName(key);
            updateCity(li);
        }
    }
}

function enterCity() {
    let cityName = document.getElementById('add-new-city').value;
    if (localStorage.getItem(cityName) != null) {
        console.log(8);
        return;
    }
    addCity(cityName);
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

function getCityElementByCityName(cityName) {
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

// function getData(cityName) {
//     fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey)
//         .then(response => response.json())
//         .then(data => {
//             parseData(data);
//         })
//         .catch(err => alert(err));
// }
//
// function parseData(data) {
//     console.log(data);
// }

function updateCity(li) {
    let div = li.firstElementChild;

    let h3 = div.firstElementChild;
    let p = h3.nextElementSibling;
    let img = p.nextElementSibling;

    let ul = li.lastElementChild;
    console.log(h3.textContent);

    let isError = false;
    // indicator start
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + h3.textContent + '&appid=' + apiKey)
        .then(response => response.json())
        .then(data => {
            // indicator stop
            let overcast = capitalize(data['weather'][0]['description']);
            img.src = 'images/' + getImageNameByOvercast(overcast);

            p.textContent = (Math.round(data['main']['temp']) - 273).toString() + '\xB0C';

            let weatherConditions = {
                'Wind speed': data['wind']['speed'] + ' m/s',
                'Overcast': overcast,
                'Pressure': data['main']['pressure'] + ' hpa',
                'Humidity': data['main']['humidity'] + ' %',
                'Coordinates': '[' + parseFloat(data['coord']['lat']).toFixed(2) + ', ' + parseFloat(data['coord']['lon']).toFixed(2) + ']'
            };

            let liChild = ul.firstElementChild;
            for (let key in weatherConditions) {
                let value = weatherConditions[key];

                let leftSpan = liChild.firstElementChild;
                leftSpan.textContent = key;

                let rightSpan = liChild.lastElementChild;
                rightSpan.textContent = value;

                liChild = liChild.nextElementSibling;
            }})
        .catch(err => {
            // indicator stop
            alert(err);
            isError = true;
        });

    return isError;
}

function addCity(cityName) {
    let h3 = document.createElement('h3');
    h3.textContent = cityName;

    let p = document.createElement('p');
    p.classList.add('temperature-city-information');

    let img = document.createElement('img');
    img.classList.add('img-city-weather');

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

    let li = document.createElement('li');
    li.classList.add('city-item');
    li.appendChild(div);
    li.appendChild(ulChild);

    let ul = document.getElementById('city-list');
    ul.appendChild(li);

    let isError = updateCity(li);

    localStorage.setItem(cityName, 'true');
}

function removeCity(event) {
    let cityName = event.target.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    event.target.parentElement.parentElement.remove();
    localStorage.removeItem(cityName);
}

function refreshCity(cityName) {
    let ul = document.getElementById('city-list');
    let child = ul.firstElementChild;
    while (child) {
        let currentCityName = child.firstElementChild.firstElementChild.textContent;
        if (cityName == currentCityName) {
            child.firstElementChild.children[1].textContent = '50\xB0C';
            return;
        }
        child = child.nextElementSibling;
    }
}

function removeAllCities() {
    let ul = document.getElementById('city-list');
    let child = ul.lastElementChild;
    while (child) {
        ul.removeChild(child);
        child = ul.lastElementChild;
    }
}

// document.getElementById('refresh').addEventListener('click', getWeather);
// 