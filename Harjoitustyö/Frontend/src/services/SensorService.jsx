import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/bmp'

const getLatest = () => {
  return axios.get(`${baseUrl}/latest`)
}

const getToday = () => {
  return axios.get(`${baseUrl}/today`)
}

const getByDate = (dateStr) => {
  // dateStr format: YYYY-MM-DD
  return axios.get(`${baseUrl}/date`, { params: { date: dateStr } })
}

export default { 
  getLatest: getLatest,
  getToday: getToday,
  getByDate: getByDate,
}
