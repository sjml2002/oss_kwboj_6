import express from "express";
import cors from "cors";
import path from "path";
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

app.use(cors({
  origin: "*", // 접근 권한을 부여하는 도메인
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
}));

app.use(express.static("./"));
app.use(express.static(path.join(__dirname, "model"))); //model 안의 파일들 사용하기
app.use(express.static(path.join(__dirname, "view/STYLE",))); //view/STYLE 안의 파일들 사용하기
app.use(express.static(path.join(__dirname, "mdImage"))); //view/STYLE 안의 파일들 사용하기


///////////////////////  Routing  /////////////////////////////////////////
app.get('/main_page', (req, res) => {
  //__dirname: 현재 폴더의 위치 (전역변수)
  res.sendFile(path.join(__dirname, "view", "main_page.html"))
})

app.get("/studentInfo", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "studentInfo.html"))
})

// Example for 시각화 맴버들
app.get("/contribution", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "contribution.html"))
})

app.get('/model/crawling', (req, res) => {
  res.sendStatus(401)
  res.send("접근 금지")
})
/////////////////////////////////////////////////////////////////////




//// fetching ////
app.get("/getkwStudentInfo", async (req, res) => {
  let kwstudents = await crawlingData.getkwStudentInfo()
  res.json(kwstudents); //json 타입으로 데이터 전달
})

app.get("/getUniversityRanking", async (req, res) => {
  let unirank = await crawlingData.getUniversityRanking()
  res.json(unirank); //json 타입으로 데이터 전달
})

app.get("/getSubmitInfo", async (req, res) => {
  let kwsubmit = await crawlingData.getSubmitOrderTime()
  res.json(kwsubmit); //json 타입으로 데이터 전달
})