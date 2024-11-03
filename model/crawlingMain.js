import axios from "axios";
import * as cheerio from "cheerio";
import * as crawlingStudent from "./crawlingStudent.js"
import * as crawlingSubmit from "./crawlingSubmitTime.js"

const cache_numofpeople = 0;
const cache_lasttime = 0;
let kwstudents = []

const getHtml = async(url) => {
    try {
        const html  = await axios.get(url);
        const htmldata = cheerio.load(html.data)
        return (htmldata);
    } catch (error) {
        console.error(error)
        return (-1);
    }
}

/////////////////////////////////////////////////////////////

//return: Array of kwStudentInfo
const getkwStudentInfo = async() => {
    const url = "https://solved.ac/ranking/o/222"
    const mainhtml = await getHtml(url)
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
            kwstudents = ksiarray
            return (ksiarray)
        }
    }
}

//return: 제출 시간 순으로 정렬
const getSubmitOrderTime = async() => {
    const result_id = 4; //-1: 전체, 4: 맞았습니다
    const school_id = 222; //222: 광운대학교
    const url = `https://www.acmicpc.net/status?&result_id=${result_id}&school_id=${school_id}`
    const mainhtml = await getHtml(url)
    if (mainhtml == -1)
        return ("Error! html 데이터 추출 중 에러")

    let recentdate, recentTime = await crawlingSubmit.getRecentTime(mainhtml)
    
}


///////////////////////////////////////////////////////////

const testmain = async() => {
    const ksi = await getkwStudentInfo();
    if (ksi.includes("Error!")) {
        console.log(ksi); //debug
    }
}
testmain();