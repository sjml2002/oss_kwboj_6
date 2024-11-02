const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async() => {
    try {
        const url = "https://solved.ac";

        const html  = await axios.get(url);
        
        const htmldata = cheerio.load(html.data);

        console.log(htmldata.html.toString());

    } catch (error) {
        console.error("Error 발생: ", error);
    }
}

getHtml();