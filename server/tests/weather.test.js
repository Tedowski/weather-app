const weather = require('./../service/weather')
const fetch = require('node-fetch')

let url = (city, apiKey) => `${weather.api.endpoint + weather.api.type.weather}q=${city}&appid=${apiKey}&units=metric`

test('Unauthorized', () => {
  return fetch(url('copenhagen', null))
    .catch(err => expect(err).toBe('Unauthorized'))
})

test('Get city', () => {
  return fetch(url('copenhagen', weather.api.key))
    .then(response => response.json())
    .then(data => expect(data.name.toLowerCase()).toBe('copenhagen'))
})
