import axios from "axios";
import * as cheerio from "cheerio";

const getHtml = async(customheader, url) => {
    if (customheader === "" || customheader === "undefined") {
        customheader = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        }
    }

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

/**
 * 오늘의 문제 cnt개 받아오기
 * @param {html}$ 초기 html 페이지
 * @param {number}cnt 문제 갯수
 * @param {Array}kwproblems 광운대학교 학생이 푼 문제들 (중복 안되어야함)
 * @return {Array} [문제번호]
 */
export const todaysProblem = async($, cnt, kwproblems) => {
    let todaysproblems = []
    try {
        const pnumlist = $("td.list_problem_id");
        
        pnumlist.each((idx, td) => {
            if (todaysproblems.length == cnt)
                return ;
            const problemid = pnumlist.eq(idx).text();
            if (!kwproblems.includes(problemid.toString()))
                todaysproblems.push(parseInt(problemid))
        });

        //문제 수가 6개 안되었을 경우 임의 문제 넣기
        let defaultproblem = 1000;
        while (todaysproblems.length < cnt) {
            todaysproblems.push(defaultproblem);
            defaultproblem += 1;
        }
        return (todaysproblems);
    } catch (err) {
        console.error(err);
        let defaultproblem = 1000;
        while (todaysproblems.length < cnt) {
            todaysproblems.push(defaultproblem);
            defaultproblem += 1;
        }
        return (todaysproblems);
    }
}