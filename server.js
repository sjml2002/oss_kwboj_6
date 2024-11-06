import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as crawlingData from "./model/crawlingMain.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

//// Setting ////
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static(path.join(__dirname, "model"))); //model 안의 파일들 사용하기




///////////////////////  Routing  /////////////////////////////////////////
app.get('/', (req, res) => {
  //__dirname: 현재 폴더의 위치 (전역변수)
  res.sendFile(path.join(__dirname, "view", "main.html"))
})

app.get("/studentInfo", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "studentInfo.html"))
})

//// Example for 시각화 맴버들
// app.get("/HTML파일이름", (req, res) => {
//   res.sendFile(path.join(__dirname, "view", "HTML파일이름.html"))
// })

app.get('/model/crawling', (req, res) => {
  res.sendStatus(401)
  res.send("접근 금지")
})
/////////////////////////////////////////////////////////////////////




//// fetching ////
app.get("/getkwStudentInfo", async(req, res) => {
  let kwstudents = await crawlingData.getkwStudentInfo()
  res.json(kwstudents); //json 타입으로 데이터 전달
})

app.get("/getUniversityRanking", async(req, res) => {
  let unirank = await crawlingData.getUniversityRanking()
  res.json(unirank); //json 타입으로 데이터 전달
})

app.get("/getSubmitInfo", async(req, res) => {
  let kwsubmit = await crawlingData.getSubmitOrderTime()
  res.json(kwsubmit); //json 타입으로 데이터 전달
})