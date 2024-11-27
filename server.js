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

