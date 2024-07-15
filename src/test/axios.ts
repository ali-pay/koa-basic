import { GET, POST } from '@util/axios'

function test() {
  GET('https://localhost:9000').then(data => console.log('GET:', data))
  POST('https://localhost:9000/api/system/ping').then(data => console.log('POST:', data))
}

// setTimeout(test, 3000)
