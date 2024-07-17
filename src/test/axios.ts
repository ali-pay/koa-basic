import { axiosGet, axiosPost } from '@util/axios'

function test() {
  axiosGet('https://localhost:9000/api/system/ping').then(data => console.log('axiosGet:', data))
  axiosPost('https://localhost:9000/api/system/ping').then(data => console.log('axiosPost:', data))
}

// setTimeout(test, 3000)
