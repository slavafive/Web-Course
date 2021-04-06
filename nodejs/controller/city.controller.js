const apiKey = 'ae89b8a5c63d75e64e33be5a6e8f6ce2'
const https = require('https')

const database = require('../database')


function makeRequest(url, callback, onError) {
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            if (resp.statusCode >= 400 && resp.statusCode < 500) {
                onError(resp.statusMessage)
            } else {
                callback(data)
            }
        });
    }).on("error", (err) => {
        onError(err)
    })
}

function performQuery(sql, callback, onError) {
    database.query(sql, (err, data) => {
        if (err) {
            onError(err)
        } else {
            callback(data)
        }
    })
}

class CityController {

    async createCity(req, res) {
        const cityName = req.body.name
        database.query(`SELECT name FROM city WHERE name = '${cityName}'`, (err, data) => {
            if (err) {
                res.status(404).send(err)
            } else {
                if (data.rows.length === 0) {
                    performQuery(`INSERT INTO city (name) VALUES ('${cityName}') RETURNING *`,
                        function (data) {
                            res.status(200).send(data.rows)
                        }, function (error) {
                            res.status(404).send(error)
                        })
                } else {
                    res.status(404).send('City already exists')
                }
            }
        })
    }

    async getCities(req, res) {
        performQuery('SELECT name FROM city',
            function (data) {
                let cities = []
                for (let i = 0; i < data.rows.length; i++) {
                    cities.push(data.rows[i]['name'])
                }
                res.status(200).send(cities)
            }, function (error) {
                res.status(404).send(error)
            })
    }

    async deleteCity(req, res) {
        const cityName = req.body.name
        performQuery(`DELETE FROM city WHERE name = '${cityName}'`,
            function (data) {
                res.status(200).send(data)
            }, function (error) {
                res.status(404).send(error)
            })
    }

    async getCityWeatherByName(req, res) {
        const cityName = req.query.q
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        makeRequest(url,
            function (data) {
                res.status(200).send(data)
            }, function (error) {
                res.status(404).send(error)
            })
    }

    async getCityWeatherByCoordinates(req, res) {
        const latitude = req.query.lat
        const longitude = req.query.lon
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        makeRequest(url,
            function (data) {
                res.status(200).send(data)
            }, function (error) {
                res.status(404).send(error)
            })
    }

}

module.exports = new CityController()