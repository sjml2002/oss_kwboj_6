//import axios from "axios";
//import * as cheerio from "cheerio";
import universityRank from "./DTO/universityRank.js"

const getHtml = async(customheader, url) => {
    if (customheader === "" || customheader === "undefined") {
        customheader = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        }
    }

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
 * 대학교 순위 받아오기 (~100위까지)
 * @param {html}$ 초기 html 페이지
 * @return {Map} {학교이름: 학교정보}
 */
export const unirank100 = async($) => {
    let unirank = new Map();
    try {
        const trlist = $("table#ranklist").children("tbody").find("tr");
        
        trlist.each((idx, tr) => {
            const tdlist = $(tr).find("td");
            
            const rank = $(tdlist).eq(0).text();
            const name = $(tdlist).eq(1).children("a").text();
            const members = $(tdlist).eq(2).text();
            const solvedcnt = $(tdlist).eq(3).children("a").text();
            const submitcnt = $(tdlist).eq(4).children("a").text();
            const percent = $(tdlist).eq(5).text(); //정답률
            
            unirank.set(name, new universityRank(rank, name, members, solvedcnt, submitcnt, percent));
        });
        return (unirank);
    } catch (err) {
        console.error(err);
        return (new Map());
    }
}