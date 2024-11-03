import axios from "axios";
import * as cheerio from "cheerio";
import kwStudentInfo from "./DTO/submitWithTime.js"

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

//YYYY년 MM월 DD일 HH:MM:SS (MM월은 M월, DD일은 D일 일수도 있다.)
//YYYY년 MM월 DD일을 日수로 (Date)
//HH:MM:SS 을 초 단위로 (Time)
//return: date, time
function stringTo_DateTime(timestr) {
    const splittimestr = timestr.split(' ')

    const year = splittimestr[0].slice(0, 4);
    const month = splittimestr[1].slice(0, splittimestr[1].length-1);
    const day = splittimestr[2].slice(0, splittimestr[2].length-1);
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let date = (year - 1) * 365; // 전년도까지의 총 일수
    for(let i=0; i<month-1; i++) {
        date += daysInMonth[i];
    }
    date += day;
    
    const hour = splittimestr[3][0] + splittimestr[3][1]
    const minute = splittimestr[3][3] + splittimestr[3][4]
    const second = splittimestr[3][6] + splittimestr[3][7]
    const time = hour*3600 + minute*60 + second;

    return (date, time)
}

//현재 광운대학교 학생이 푼 문제 중 가장 최상위 문제의 시간
export const getRecentTime = async($) => {
    



    //return (date, time)
}
