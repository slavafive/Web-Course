function addItem() {
    // var city = document.createElement("li");
    // city.setAttribute('class', 'city-item');
    // document.getElementById("city-list").appendChild(city);

    /*
            <h3>Paris</h3>
            <p class="temperature-city-information">18&#176;C</p>
            <img src="images/cloudy.png" class="img-city-weather">
            <button type="submit" class="round">x</button>
     */

    let h3 = document.createElement('h3');
    let cityName = document.getElementById('add-new-city').value;
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
}