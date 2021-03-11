const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const config = require('./config/config')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({
    type: 'application/json'
}))

app.use(cors())

require('./routes')(app)

app.listen(config.port, err => err ? console.log(err) : console.log('Listening on port ' + config.port))
