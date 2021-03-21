apiKey = 'c1fba4b3fbec3b5f92b79c28980e8024';

localStorage.clear();

function refresh() {
    let cities = []
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        cities.push(key);
    }
    localStorage.clear();
    for (let i = 0; i < cities.length; i++) {
        localStorage.setItem(cities[i], 'true');
        addCity(cities[i]);
    }
}

function enterCity() {
    let cityName = document.getElementById('add-new-city').value;

    if (localStorage.getItem(cityName) != null) {
        return;
    }

    addCity(cityName);
}

function addCity(cityName) {

    let h3 = document.createElement('h3');
    h3.textContent = cityName;

    let p = document.createElement('p');
    p.classList.add('temperature-city-information');
    p.textContent = '30\xB0C';

    let img = document.createElement('img');
    img.src = 'images/cloudy.png';
    img.classList.add('img-city-weather');

    let button = document.createElement('button');
    button.type = 'submit';
    button.classList.add('round');
    button.textContent = 'x';

    let div = document.createElement('div')
    div.classList.add('city-information');

    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(img);
    div.appendChild(button);

    let ulChild = document.createElement('ul');
    ulChild.classList.add('city-information-list');

    let weatherConditions = {
        'Wind': 'Moderate breeze, 6.0 m/s',
        'Overcast': 'Broken clouds',
        'Pressure': '1013 hpa',
        'Humidity': '52 %',
        'Coordinates': '[59.88, 30.42]'
    }

    // let weatherConditions = getWeather(cityName);
    try {
        let a = getWeather(cityName);
        console.log(weatherConditions);
    } catch(error) {
        console.log(error);
        return;
    }

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
    }

    let li = document.createElement('li');
    li.classList.add('city-item');
    li.appendChild(div);
    li.appendChild(ulChild);

    let ul = document.getElementById('city-list');
    ul.appendChild(li);

    localStorage.setItem(cityName, 'true');
}

function removeCity() {

}

// document.getElementById('refresh').addEventListener('click', getWeather);

function getWeather(city) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey)
        .then(response => response.json())
        .then(data => {
            let dict = {
                'latitude': data['coord']['lat'],
                'longitude': data['coord']['lon'],
                'windSpeed': data['wind']['speed'],
                'description': data['weather'][0]['description']
            };
            return 5;
        })
        .catch(err => alert('Wrong city name!'));
}