import axios from "axios";
import * as cheerio from "cheerio";
import * as crawlingStudent from "./crawlingStudent.js";
import * as crawlingSubmit from "./crawlingSubmitTime.js";
import * as crawlingUniRank from "./crawlingUniversityRanking.js";

const cache_numofpeople = 0;
const cache_lastdatetime = 0;
const cache_lastupdate = new Date("2000-01-01 00:00:00"); //마지막으로 업데이트 한 시간

//view에 쓸 데이터
let data_kwstudents = []
let data_kwsubmitlist = []
let data_unirank = []

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
const getkwStudentInfo = async() => {
    const url = "https://solved.ac/ranking/o/222"
    const mainhtml = await getHtml("", url)
    if (mainhtml == -1) 
        return ("Error! html 데이터 추출 중 에러")

    const numofpeople = await crawlingStudent.curPeopleCnt(mainhtml);
    if (numofpeople > cache_numofpeople) { //kwStudentInfo 배열 업데이트
        console.log("kwStudentInfo 업데이트 해야됨") //debug
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
        console.log("kwstudents는 cache에 저장된거 return 했쪄") //debug
        return (data_kwstudents)
    }
}

//return: 시간 순으로 정렬된 submitWithTime
const getSubmitOrderTime = async() => {
    const result_id = 4; //-1: 전체, 4: 맞았습니다
    const school_id = 222; //222: 광운대학교
    const url = `https://www.acmicpc.net/status?&result_id=${result_id}&school_id=${school_id}`
    const header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    }

    console.log(url) //debug

    const mainhtml = await getHtml(header, url)
    if (mainhtml == -1)
        return ("Error! html 데이터 추출 중 에러")

    let recentdatetime = await crawlingSubmit.getRecentTime(mainhtml)
    
    if (cache_lastdatetime < recentdatetime) {
        //새롭게 업데이트 진행
        const today = new Date();
        today.setHours(0, 0, 0, 0); //오늘 자정으로 설정
        let data_kwsubmitlist = await crawlingSubmit.getRecent_to_targettime_submitlist(mainhtml, today);
        return (data_kwsubmitlist)
    }
    else { //그냥 이미 저장되어있던 데이터 list return
        console.log("kwsublist는 cache에 저장된거 return 했쪄") //debug
        return (data_kwsubmitlist)
    }
}

const getUniversityRanking = async() => {
    //하루에 한번씩만 업데이트 하도록 설정
    const today = new Date();
    let diffDate = today.getTime() - cache_lastupdate.getTime();
    diffDate = Math.abs(diffDate / (1000*60*60*24)); //밀리세컨*초*분*시 = 일
    if (diffDate < 1 && !data_unirank.empty())
        return (data_unirank);

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

///////////////////////////////////////////////////////////

const testmain = async() => {
    // const ksi = await getkwStudentInfo();
    // if (ksi.includes("Error!")) {
    //     console.log(ksi); //debug
    // }
    // else {
    //     data_kwstudents = ksi;
    //     console.log("테스트: ", data_kwstudents) //success debug
    // }

    // const sot = await getSubmitOrderTime();
    // if (sot.includes("Error!")) {
    //     console.log(sot)
    // }
    // else {
    //     data_kwsubmitlist = sot;
    //     console.log("테스트: ", data_kwsubmitlist)
    // }

    const unirank = await getUniversityRanking();
    if (unirank.includes("Error!")) {
        console.log(unirank)
    }
    else {
        data_unirank = unirank;
        console.log("테스트: ", data_unirank)
    }
}
testmain();