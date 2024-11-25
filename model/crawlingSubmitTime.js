//import axios from "axios";
//import * as cheerio from "cheerio";
import kwStudentInfo from "./DTO/submitWithTime.js"
import submitWithTime from "./DTO/submitWithTime.js";

const getHtml = async(customheader, url) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    try {
        const html  = await axios.get(proxyUrl + url, {
            headers: customheader,
            credentials: "include",
        });
        const htmldata = cheerio.load(html.data)
        return (htmldata);
    } catch (error) {
        console.error(error) //debug
        return (-1);
    }
}

/**
 * @param {String} timestr datetime을 string 화 한거에요.
 * YYYY-MM-DD HH:MM:SS (MM월은 M월, DD일은 D일 일수도 있다.)
 * @return {Date} datetime
 */
function stringTo_DateTime(timestr) {
    const datetime = new Date(timestr);
    return (datetime);
}

//현재 광운대학교 학생이 푼 문제 중 가장 최상위 문제의 시간
export const getRecentTime = async($) => {
    const recenttimestr = $("tbody").find('tr').find("td").eq(8).children("a").attr("title")
    const datetime = stringTo_DateTime(recenttimestr)
    return (datetime);
}


/**
 * @param {Date} targetdatetime 
 * @return {list} recent(최근시각) ~ targettime 까지 광운대학교 학생들의 제출 기록
 */
export const getRecent_to_targettime_submitlist = async($, targetdatetime) => {
    let submitlist = [] //class: submitWithTime

    while(1) {
        let stopflag = 0; //1이면 while문 break
        let trlist = $("tbody").find('tr');

        trlist.each((idx, tr) => {
            const tdlist = $(tr).find("td")
            
            const id = $(tdlist).eq(1).children("a").text()
            const pid = $(tdlist).eq(2).children("a").text()
            const t = $(tdlist).eq(8).children("a").attr("title")
    
            //탐색한 t가 targettime까지 인지
            let curdatetime = stringTo_DateTime(t)
            //curdate는 점점 감소중

            console.log(targetdatetime, curdatetime); //debug

            if (targetdatetime <= curdatetime)
                submitlist.push(new submitWithTime(id, pid, t))
            else { //curdate & curtime이 target보다 작아짐. 탐색 중지
                stopflag = 1;
                return false //break
            }
        });

        if (stopflag)
            break
        else { //다음페이지로 이동
            const nextpageurl = "https://www.acmicpc.net" + $("a#next_page").attr("href")
            const header = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            };

            $ = await getHtml(header, nextpageurl)
        }
    }    

    return (submitlist)
}