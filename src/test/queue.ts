import { GET } from '@util/axios'

function test() {
  for (let i = 1; i <= 5; i++) {
    GET(`https://localhost:9000/api/system/ping`).then(data => console.log('queue:', data))
  }
}

// setTimeout(test, 3000)
