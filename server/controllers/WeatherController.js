const weather = require('./../service/weather')
const fetch = require('node-fetch')

module.exports = {
  async today(req, res) {
    try {
      const city = req.params.city
      const url = `${weather.api.endpoint + weather.api.type.weather}q=${city}&appid=${weather.api.key}&units=metric`
      fetch(url)
        .then(response => response.json())
        .then(data => res.send(data))
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
