const express = require('express')
const path = require ('path')

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//// Routing ////

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "view", "main.html")) //__dirname: 현재 폴더의 위치 (전역변수)
})

app.get('/model/crawling', (req, res) => {
  res.sendStatus(401)
  res.send("접근 금지")
})