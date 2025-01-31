const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  if (req.url === '/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      Connection: 'keep-alive',
      'Keep-Alive': 'timeout=30',
    })

    let count = 0
    const maxCount = 1000

    const writeData = () => {
      const json = JSON.stringify({
        id: count,
        message: `This is message number ${count}`,
      })
      if (!res.write(json + '\n')) {
        res.once('drain', writeData)
        return
      }
      count++
      if (count < maxCount) {
        process.nextTick(writeData)
        return
      }
      res.end()
    }

    writeData()
    return
  }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(fs.readFileSync(path.resolve(__dirname, 'client/index.html')))
    return
  }

  if (req.url.startsWith('/') && req.method === 'GET') {
    let filePath = req.url.startsWith('/dist')
      ? path.join(__dirname, '../', req.url)
      : path.join(__dirname, 'client', req.url)
    if (!path.extname(filePath)) {
      filePath += '.js'
    }
    const extname = String(path.extname(filePath)).toLowerCase()
    const contentType =
      {
        '.js': 'text/javascript',
        '.html': 'text/html',
        '.css': 'text/css',
      }[extname] || 'application/octet-stream'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
        return
      }
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    })
    return
  }
})

server.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
