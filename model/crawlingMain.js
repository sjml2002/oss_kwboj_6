import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from 'fs';
import * as crawlingStudent from "./crawlingStudent.js";
import * as crawlingSubmit from "./crawlingSubmitTime.js";
import * as crawlingUniRank from "./crawlingUniversityRanking.js";
import * as crawlingTodayProblem from "./crawlingTodaysProblem.js";

let cache_numofpeople = 0;
let cache_lastsubmittime = 0;
let cache_lastunirankupdatetime = new Date("2000-01-01 00:00:00"); //마지막으로 업데이트 한 시간
let cache_lasttodayproblem = new Date("2000-01-01 00:00:00"); //today problem 마지막 업데이트

//view에 쓸 데이터
let data_kwstudents = [];
let data_kwsubmitlist = [];
let data_unirank = new Map();
let data_todaysProblem = [];

const getHtml = async(customheader, url) => {
    try {
        const html  = await axios.get(url, {
            headers: customheader,
        });
        const htmldata = cheerio.load(html.data)
        return (htmldata);
    } catch (error) {
        console.error(error) //debug
        return (-1);
    }
}

/////////////////////////////////////////////////////////////

//return: Array of kwStudentInfo
export const getkwStudentInfo = async() => {
    const url = "https://solved.ac/ranking/o/222"
    const header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    }
    const mainhtml = await getHtml(header, url)
    if (mainhtml == -1) 
        return ("Error! html 데이터 추출 중 에러")

    const numofpeople = await crawlingStudent.curPeopleCnt(mainhtml);

    if (numofpeople > cache_numofpeople) { //kwStudentInfo 배열 업데이트
        cache_numofpeople = numofpeople; //cache update
        const ksiarray = await crawlingStudent.updateKwStudentInfo(mainhtml);

        //이거 그냥 return (ksiarray) 한 다음에 view(front-end) 단에서 처리해도 될듯
        if (ksiarray.empty)
            return ("Error! kwStudentInfo 업데이트 중 에러")
        else {   //최종 return
            data_kwstudents = ksiarray
            return (data_kwstudents)
        }
    }
    else { //그냥 이미 저장된 데이터 list return
        return (data_kwstudents)
    }
}

/**
 * targetTime ~ 호출한 시각까지 모두 구해옴
 * @param {Date} targetTime 
 * @returns {list} data_kwsubmitlist
 */
export const getSubmitOrderTime = async(targetTime) => {
    const result_id = 4; //-1: 전체, 4: 맞았습니다
    const school_id = 222; //222: 광운대학교
    const url = `https://www.acmicpc.net/status?&result_id=${result_id}&school_id=${school_id}`
    const header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    }
    const mainhtml = await getHtml(header, url)
    if (mainhtml == -1)
        return ("Error! html 데이터 추출 중 에러")

    let recentdatetime = await crawlingSubmit.getRecentTime(mainhtml)
    console.log("recentdatatime: ", recentdatetime); //debug

    if (cache_lastsubmittime == 0) {
        const jsondata = fs.readFileSync(`json/kwsubmitData.json`);
        data_kwsubmitlist = JSON.parse(jsondata); //231216 ~ 231217 제출기록
        cache_lastsubmittime = new Date("2024-12-17 17:37:37");
        console.log("json후 캐시:", cache_lastsubmittime); //debug
    }
    if (cache_lastsubmittime < recentdatetime) {
        // 테스트할 때는 없던 부분인데, 혹시 몰라서 주석 처리 해놓음
        /* 
        let newsubmitlist = await crawlingSubmit.getRecent_to_targettime_submitlist(mainhtml, cache_lastdatetime);
        data_kwsubmitlist.push(newsubmitlist);
        */
        //새롭게 업데이트 진행
        const newsubmit = await crawlingSubmit.getRecent_to_targettime_submitlist(mainhtml, cache_lastsubmittime);
        console.log(Array.isArray(newsubmit)); //debug
        data_kwsubmitlist = newsubmit.concat(data_kwsubmitlist); //data_kwsubmitlist + newsubmit
        cache_lastsubmittime = recentdatetime; //cache update
        return (data_kwsubmitlist)
    }
    else { //그냥 이미 저장되어있던 데이터 list return
        return (data_kwsubmitlist)
    }
}

export const getUniversityRanking = async() => {
    //하루에 한번씩만 업데이트 하도록 설정
    const today = new Date();
    let diffDate = today.getTime() - cache_lastunirankupdatetime.getTime();
    diffDate = Math.abs(diffDate / (1000*60*60*24)); //밀리세컨*초*분*시 = 일
    console.log(typeof data_unirank); //debug
    if (diffDate < 1)
        return (data_unirank);
    //업데이트 어차피 할거니까 cache를 오늘 자정으로 설정
    cache_lastunirankupdatetime = today;

    const url = "https://www.acmicpc.net/ranklist/university/1";
    const header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    }

    const mainhtml = await getHtml(header, url);
    if (mainhtml == -1)
        return ("Error! html 데이터 추출 중 에러")

    data_unirank = await crawlingUniRank.unirank100(mainhtml)
    return (data_unirank);
}

//광운대학생이 푼 총 문제
// export const getTotalProblem = async() => {
//     data_kwstudents = await getkwStudentInfo();
//     const studentsID = data_kwstudents.map((student) => student._ID);

//     data_totalProblems = await crawlingStudent.updateTotalProblem(studentsID);
//     console.log("data_totalProblems: ", data_totalProblems); //debug
//     const jsondata = JSON.stringify([...data_totalProblems]);
//     fs.writeFileSync("test.json", jsondata);

//     console.log("여기는? ", data_totalProblems); //debug
//     return (data_totalProblems);

//오늘의 추천 문제 6문제
export const getTodaysProblem = async() => {
    //오늘 이미 업데이트 되었다면 딱히 추천하지 않기
    const today = new Date();
    let diffDate = today.getTime() - cache_lasttodayproblem.getTime();
    diffDate = Math.abs(diffDate / (1000*60*60*24)); //밀리세컨*초*분*시 = 일
    if (diffDate < 1 && data_todaysProblem.length != 0)
        return (data_todaysProblem);
    cache_lasttodayproblem = today;

    const jsondata = fs.readFileSync(`json/totalProblem.json`);
    const parsedata = JSON.parse(jsondata); //광운대학생이 푼 문제 array

    const url = "https://www.acmicpc.net/problem/added/0"; //한국어로 된 새로 추가된 문제
    const header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    }
    const mainhtml = await getHtml(header, url);
    if (mainhtml == -1)
        return ("Error! html 데이터 추출 중 에러")

    data_todaysProblem = await crawlingTodayProblem.todaysProblem(mainhtml, 6, parsedata); //초기화
    return (data_todaysProblem);
}


// ///////////////////////////////////////////////////////////
// //debug
// // const testmain = async() => {
// //     // const ksi = await getkwStudentInfo();
// //     // if (ksi.includes("Error!")) {
// //     //     console.log(ksi); //debug
// //     // }
// //     // else {
// //     //     data_kwstudents = ksi;
// //     //     console.log("테스트: ", data_kwstudents) //success debug
// //     // }

// //     // const sot = await getSubmitOrderTime();
// //     // if (sot.includes("Error!")) {
// //     //     console.log(sot)
// //     // }
// //     // else {
// //     //     data_kwsubmitlist = sot;
// //     //     console.log("테스트: ", data_kwsubmitlist)
// //     // }

// //     // const unirank = await getUniversityRanking();
// //     // if (unirank.includes("Error!")) {
// //     //     console.log(unirank)
// //     // }
// //     // else {
// //     //     data_unirank = unirank;
// //     //     console.log("테스트: ", data_unirank)
// //     // }

// //     // data_totalProblems = await getTotalProblem();
// //     // console.log("테스트: ", data_totalProblems); //deubg
// //     // data_totalProblems = await getTotalProblem();
// //     // console.log("캐시 테스트: ", data_totalProblems); //debug

// //     // data_todaysProblem = getTodaysProblem();
// //     // console.log(data_todaysProblem);
// //     // data_todaysProblem = getTodaysProblem();
// //     // console.log(data_todaysProblem);
// // }
// // testmain();