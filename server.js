import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as crawlingData from "./model/crawlingMain.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

// Static 파일 서빙 설정
app.use(express.static(path.join(__dirname, "view/STYLE"))); // ranking.js 경로
app.use(express.static(path.join(__dirname, "rankingImage"))); // 이미지 경로
app.use(express.static(path.join(__dirname, "mdImage"))); // 다른 이미지 경로
app.use(express.static(path.join(__dirname, "model"))); // 모델 경로
app.use(express.static("./")); // 프로젝트 루트

<<<<<<< HEAD
//// Setting ////
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static("./"));
app.use(express.static(path.join(__dirname, "model"))); //model 안의 파일들 사용하기
app.use(express.static(path.join(__dirname, "view/STYLE",))); //view/STYLE 안의 파일들 사용하기
app.use(express.static(path.join(__dirname, "mdImage"))); //view/STYLE 안의 파일들 사용하기


///////////////////////  Routing  /////////////////////////////////////////
app.get('/', (req, res) => {
  //__dirname: 현재 폴더의 위치 (전역변수)
  res.send("Hello, Elastic Beanstalk!");
})

app.get('/main_page', (req, res) => {
  //__dirname: 현재 폴더의 위치 (전역변수)
  res.sendFile(path.join(__dirname, "view", "main_page.html"))
})

app.get("/studentInfo", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "studentInfo.html"))
})

app.get("/todayranking", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "todayranking.html"))
})

app.get("/contribution", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "contribution.html"))
})

app.get("/medalRanking", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "medalRanking.html"))
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
=======
// 라우팅
app.get('/piechart', (req, res) => {
    res.sendFile(path.join(__dirname, "view", "piechart.html"));
});
app.get('/studentInfo', (req, res) => {
    res.sendFile(path.join(__dirname, "view", "studentInfo.html"));
});
app.get('/medalRanking', (req, res) => {
    res.sendFile(path.join(__dirname, "view", "medalRanking.html"));
});
app.get('/contribution', (req, res) => {
    res.sendFile(path.join(__dirname, "view", "contribution.html"));
});

// 데이터 Fetching
>>>>>>> 039a46b377d9f3d38a42cc0668efc221b6a1ac62
app.get("/getkwStudentInfo", async (req, res) => {
    try {
        const data = await crawlingData.getkwStudentInfo();
        res.json(data);
    } catch (error) {
        console.error("Error fetching KW student info:", error);
        res.status(500).json({ error: "Failed to fetch KW student info" });
    }
});

app.get("/getUniversityRanking", async (req, res) => {
<<<<<<< HEAD
  let unirank = await crawlingData.getUniversityRanking()
  const arraydata = Array.from(unirank.values()); //map to array
  arraydata.sort((a, b) => a._rank < b._rank); //랭킹 오름차순 정렬
  res.json(arraydata); //json 타입으로 데이터 전달
})

app.get("/getSubmitInfo", async (req, res) => {
  let kwsubmit = await crawlingData.getSubmitOrderTime()
  res.json(kwsubmit); //json 타입으로 데이터 전달
})

app.get("/getTodaysProblem", async (req, res) => {
  let problems = await crawlingData.getTodaysProblem()
  res.json(problems); //json 타입으로 데이터 전달
})
=======
    try {
        const data = await crawlingData.getUniversityRanking();
        res.json(data);
    } catch (error) {
        console.error("Error fetching university ranking:", error);
        res.status(500).json({ error: "Failed to fetch university ranking" });
    }
});

app.get("/getSubmitInfo", async (req, res) => {
    try {
        const data = await crawlingData.getSubmitOrderTime();
        res.json(data);
    } catch (error) {
        console.error("Error fetching submit info:", error);
        res.status(500).json({ error: "Failed to fetch submit info" });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

>>>>>>> 039a46b377d9f3d38a42cc0668efc221b6a1ac62
