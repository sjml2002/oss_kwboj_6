import axios from "axios";
import * as cheerio from "cheerio";
import kwStudentInfo from "./DTO/kwStudentInfo.js"

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

//현재 광운대학교 학생 수 세기 (가장 꼴지인 사람의 순위)
//이때, 동순위가 있을 수도 있다.
export const curPeopleCnt = async($) => {
    const page = $("div.css-18lc7iz")
    const lastpagenum = page.find('a').last().text();
    
    $ = await getHtml("https://solved.ac/ranking/o/222?page=" + lastpagenum);
    const tbody = $("tbody");
    const tr = tbody.find('tr').last()
    const td = tr.find("td").eq(1)
    const numofpeople = td.children("div").text();
    return (numofpeople);
}

//kwStudentInfo 업데이트
//return: Array of kwStudentInfo
export const updateKwStudentInfo = async($) => {
    const page = $("div.css-18lc7iz")
    const lastpagenum = page.find('a').last().text();

    try {
        let kwstudents = []
        for(let pi=1; pi<=lastpagenum; pi++) {
            $ = await getHtml("https://solved.ac/ranking/o/222?page=" + pi);
            const tbody = $("tbody");
            tbody.find('tr').each((idx, tr) => {
                const ranking = $(tr).find('td').eq(0).children("div").text();
                const rankingInKWU = $(tr).find('td').eq(1).children("div").text();
                
                const td3imgtag = $(tr).find('td').eq(2).find("img.css-1vnxcg0");
                const tier = td3imgtag.attr("alt")
                const tierimg = td3imgtag.attr("src")

                const ID = $(tr).find('td').eq(2).find("b").text();
                const acrating = $(tr).find('td').eq(3).find("span").text();
                const classlevel = $(tr).find('td').eq(4).children("div").text();
                const solvedcnt= $(tr).find('td').eq(5).children("div").text();
                
                const student = new kwStudentInfo(ID,tier,tierimg,ranking,rankingInKWU,acrating,classlevel,solvedcnt);
                kwstudents.push(student)
            })
        }
        return (kwstudents)
    }
    catch (err) {
        console.error(err);
        return ([])
    }
}