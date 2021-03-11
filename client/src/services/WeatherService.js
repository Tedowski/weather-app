import api from './api'

export default {
    weather (city) {
        return api.get(`/weather/${city}`)
    },
}
