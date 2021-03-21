apiKey = 'c1fba4b3fbec3b5f92b79c28980e8024';

localStorage.clear();

function refresh() {
    removeAllCities();
    localStorage.clear();
}

function enterCity() {
    let cityName = document.getElementById('add-new-city').value;
    if (localStorage.getItem(cityName) != null) {
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

function updateCity() {

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

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey)
        .then(response => response.json())
        .then(data => {

            console.log(data);

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

            for (let key in weatherConditions) {
                let value = weatherConditions[key];

                let leftSpan = document.createElement('span');
                leftSpan.textContent = key;

                let rightSpan = document.createElement('span');
                rightSpan.textContent = value;

                let item = document.createElement('li');
                item.appendChild(leftSpan);
                item.appendChild(rightSpan);

                ulChild.appendChild(item);

        }})
        .catch(err => alert('Wrong city name!'));

    let li = document.createElement('li');
    li.classList.add('city-item');
    li.appendChild(div);
    li.appendChild(ulChild);

    let ul = document.getElementById('city-list');
    ul.appendChild(li);

    localStorage.setItem(cityName, 'true');
}

function removeCity(event) {
    let cityName = event.target.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    localStorage.removeItem(cityName);
    event.target.parentElement.parentElement.remove();
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