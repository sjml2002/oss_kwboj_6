import axios from "axios";
import * as cheerio from "cheerio";
import kwStudentInfo from "./DTO/kwStudentInfo.js"

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
        if (html.status !== 200) {
            console.log("회원탈퇴!!", html.status); //debug
            throw ("회원탈퇴", html.status);
        }
        const htmldata = cheerio.load(html.data)
        return (htmldata);
    } catch (error) {
        console.error(error) //debug
        return (-1);
    }
}

/**
 * 현재 광운대학교 학생 수 세기 
 * 이때, 동순위가 있을 수도 있다.
 * @param {html}$ 처음 html 파일
 * @returns 광운대학교 sokved 인원 중 가장 꼴지의 순위
 */
export const curPeopleCnt = async($) => {
    const page = $("div.css-18lc7iz")
    const lastpagenum = page.find('a').last().text();

    const url = "https://solved.ac/ranking/o/222?page=" + lastpagenum;
    $ = await getHtml("", url);
    const tbody = $("tbody");
    const tr = tbody.find('tr').last()
    const td = tr.find("td").eq(1)
    const numofpeople = td.children("div").text();
    return (numofpeople);
}

/**
 * solved에 등록된 광운대학교 학생들을 업데이트 (필요 시)
 * @param {string}$ 맨 처음 html 파일
 * @returns Array of updated kwStudentInfo
 */
export const updateKwStudentInfo = async($) => {
    const page = $("div.css-18lc7iz")
    const lastpagenum = page.find('a').last().text();

    try {
        let kwstudents = []
        for(let pi=1; pi<=lastpagenum; pi++) {
            $ = await getHtml("", "https://solved.ac/ranking/o/222?page=" + pi);
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

/**
 * 광운대학생이 푼 총 문제를 업데이트 하는 함수
 * @param {Array}studentsID Array of 학생의 백준 ID
 * @return {set} 업데이트 된 totalProblems
 */
export const updateTotalProblem = async(studentsID) => {
    const header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    };

    let totalProblems = new Set();
    try {
        for(const ID of studentsID) {
            const url = "https://www.acmicpc.net/user/" + ID;
            const $ = await getHtml(header, url);
            if ($ === -1) //백준 회원탈퇴 유저, undefined
                continue ;
            const alist = $("div.problem-list").eq(0).find('a');
            alist.each((idx, a) => {
                totalProblems.add(alist.eq(idx).text());
            })
            console.log(totalProblems.size); //debug
        }
        console.log("총 문제: ", totalProblems.size); //debug
        return (totalProblems);
    }
    catch (err) {
        console.error("에러!",err);
        return (new Set());
    }
}