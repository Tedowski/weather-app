const WeatherController = require('./controllers/WeatherController')

module.exports = (app) => {
  app.get('/weather/:city',
    WeatherController.today
  )
}
