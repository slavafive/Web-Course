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
            console.log('Data: ' + data)
            callback(data)
        }
    })
}

function getCityWeatherByName(req, res, cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    makeRequest(url,
        function (data) {
            res.status(200).send(data)
        }, function (error) {
            res.status(404).send(error)
        })
}

function idExists(id) {
    performQuery(`SELECT id FROM city WHERE id = ${id}`, function(data) { console.log('Yes') }, function(error) { console.log('No') })
    // performQuery(`SELECT id FROM city WHERE id = ${id}`,
    //     function(data) {
    //         console.log(111)
    //         console.log(data.rows.length)
    //         // return data.rows.length > 0
    //         return true
    //     },
    //     function (error) {
    //         return false
    //     }
    // )
}

function getIds(callback, onError) {
    let sql = `SELECT id FROM city`
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
        console.log('createCity() ' + cityName)
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        makeRequest(url,
            function (data) {
                let id = JSON.parse(data).id
                let city = JSON.parse(data).name
                let err = false

                getIds(function(ids) {
                    let ids_list = ids.rows.values()
                    for (let id_item of ids_list) {
                        if (id_item.id == id) {
                            err = true
                        }
                    }
                    if (err) {
                        res.status(400).json({msg: `City ${cityName} was already added`})
                    } else {
                        database.query(`INSERT INTO city (id, name) VALUES (${id}, '${city}')`)
                        res.status(200).json(JSON.parse(data))
                    }

                }, function(error) {
                    res.status(404).json(error)
                })

            }, function (error) {
                res.status(404).send(error)
            })
    }

    async getCities(req, res) {
        console.log('getCities()')
        performQuery('SELECT name FROM city',
            function (data) {
                let cities = []
                for (let i = 0; i < data.rows.length; i++) {
                    cities.push(data.rows[i]['name'])
                }
                console.log(cities)
                res.status(200).send(cities)
            }, function (error) {
                res.status(404).send(error)
            })
    }

    async deleteCity(req, res) {
        const cityName = req.body.name
        console.log('deleteCity() ' + cityName)
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