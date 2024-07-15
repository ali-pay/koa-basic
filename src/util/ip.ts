import os from 'node:os'

function ip() {
  const ips: string[] = []
  const interfaces = os.networkInterfaces()
  for (const iface of Object.keys(interfaces)) {
    for (const info of interfaces[iface]) {
      if (info.family === 'IPv4' && info.address !== '127.0.0.1') {
        ips.push(info.address)
      }
    }
  }
  return ips
}

export default ip
