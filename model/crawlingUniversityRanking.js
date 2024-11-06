import axios from "axios";
import * as cheerio from "cheerio";
import universityRank from "./DTO/universityRank.js"

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

//대학교 순위 받아오기 (~100위까지)
export const unirank100 = async($) => {

    let unirank = []
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

            unirank.push(new universityRank(rank, name, members, solvedcnt, submitcnt, percent))
        });
        return (unirank);
    } catch (err) {
        console.error(err);
        return ([])
    }
}