import { axiosInstance } from '@util/axios'

function test() {
  for (let i = 1; i <= 5; i++) {
    axiosInstance.get(`https://localhost:9000/api/system/info`).then(({ data }) => console.log('data:', data))
  }
}

// setTimeout(test, 3000)
