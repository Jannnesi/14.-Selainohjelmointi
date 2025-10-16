import axios from 'axios'
const baseUrl = 'https://bmp.jannenkoti.com/api'

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
