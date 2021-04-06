const Router = require('express')
const router = new Router()
const cityController = require('../controller/city.controller')

router.post('/favourites', cityController.createCity)
router.get('/favourites', cityController.getCities)
router.delete('/favourites', cityController.deleteCity)
router.get('/weather/city', cityController.getCityWeatherByName)
router.get('/weather/coordinates', cityController.getCityWeatherByCoordinates)

module.exports = router