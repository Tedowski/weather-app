import React from 'react'
import queryString from 'query-string'
import './App.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'


import WeatherService from './services/WeatherService'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: {
        name: 'Copenhagen',
        temp: 0,
        temp_max: 0,
        temp_min: 0,
        desc: 'Clear',
        desc_long: 'clear',
        time: 15712628660000,
        timezone: 7200,
        sunrise: 1571262866,
        sunset: 1571262866
      },
      night_mode: false,
      loading: true,
      error: null
    }
  }

  async componentDidMount() {
    const query = queryString.parse(window.location.search)

    const city = query.city ?? null

    if (city) {
      this.handleCityNameSearch(city)
    } else {
      this.getWeather()
    }
  }

  async getWeather() {
    await this.setState({
      error: null,
      loading: true
    })

    try {
      const city = (await WeatherService.weather(this.state.city.name)).data
      console.log(city)

      const currentTs = city.dt
      const sunrise = city.sys.sunrise
      const sunset = city.sys.sunset

      await this.setState({
        city: {
          name: city.name,
          temp: city.main.temp,
          temp_max: city.main.temp_max,
          temp_min: city.main.temp_min,
          desc: city.weather[0].main,
          desc_long: city.weather[0].description,
          time: city.dt,
          timezone: city.timezone,
          sunrise: city.sys.sunrise,
          sunset: city.sys.sunset,
          humidity: city.main.humidity,
          pressure: city.main.pressure,
          visibility: city.visibility,
          wind: city.wind.speed
        },
        night_mode: (currentTs < sunrise || currentTs > sunset)
      })
    } catch (err) {
      this.setState({
          error: err.message
      })
    } finally {
      this.setState({
        loading: false
      })
    }
  }

  handleCityNameSearch = async cityName => {
      await this.setState(prevState => ({
          city: {
              ...prevState.city,
              name: cityName,
          },
      }))

      const query = queryString.parse(window.location.search)
      const city = query.city ?? null

      if (city !== cityName) {
        this.insertUrlParam('city', cityName)
      }

      await this.getWeather()
  }

  handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      this.handleCityNameSearch(evt.target.value)
      evt.target.value = ''
    }
  }

  insertUrlParam(key, value) {
    let searchParams = new URLSearchParams(window.location.search)
    searchParams.set(key, value)
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString()
    window.history.pushState({path: newurl}, '', newurl)
  }

  render() {
    const { city, night_mode } = this.state

    return (
      <div className={night_mode ? 'bg-dark' : 'bg-light'} style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Container>
          <Row>
            <Col>
              <Card className="mt-5">
                <Card.Header>
                  <Form.Control type="text" placeholder="City.." onKeyDown={evt => this.handleKeyDown(evt)}/>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    <ListGroup.Item>Weather in {city.name}</ListGroup.Item>
                    <ListGroup.Item>Temperature: {city.temp + '°C'}</ListGroup.Item>
                    <ListGroup.Item>Humidity: {city.humidity}%</ListGroup.Item>
                    <ListGroup.Item>Wind: {city.wind} m/s</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default App
