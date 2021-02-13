const puppeteer = require('puppeteer-core');
const path = require("path");
const axios = require("axios");
// const executablePath = path.join(__dirname,"../../AppData/Local/Google/Chrome/Application/chrome.exe")

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: path.join(__dirname, "../../../AppData/Local/Google/Chrome/Application/chrome.exe"),
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 })
    await page.goto('https://maoyan.com/films?showType=3');
    page.$$eval(".movie-list>dd>.movie-item>a", (dds) => {
        const urls = [];
        dds.forEach(it => urls.push(it.href))
        return urls;
    }).then(res => {
        // 进入电影详情页
         joinDetaileHandle(res.slice(18,-1));
    })

})();


async function joinDetaileHandle(res) {
    const url = res.shift();
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: path.join(__dirname, "../../../AppData/Local/Google/Chrome/Application/chrome.exe"),
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 })
    const obj = {
        areas: [],
        description: "",
        isClassic: true,
        isComing: true,
        name: "",
        poster: "",
        timeLong: "",
        types: [],

    }
    await page.goto(url);
    obj.name = await page.$eval(".name", (dom) => { return dom.innerText })
    obj.description = await page.$eval(".mod-content>.dra", (dom) => { return dom.innerText })
    obj.poster = await page.$eval(".avatar-shadow>.avatar", (dom) => { return dom.src })
    const temp = await page.$$eval("ul>.ellipsis", (doms) => {
        const typesDom = doms[0].getElementsByTagName("a");
        const temp = {
            types: []
        }
        for (const dom of typesDom) {
            temp.types.push(dom.innerText)
        }
        console.log(temp)

        let str = doms[1].innerText.split("/");
        temp.areas = str[0];
        temp.timeLong = str[1].slice(0, -2);

        return temp;
    })
    obj.areas = [temp.areas];
    obj.types = temp.types
    obj.timeLong = temp.timeLong;
    await addMovie(obj)
    page.close()
    if(res.length > 0){
         joinDetaileHandle(res)
    }



}

async function addMovie(obj) {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: path.join(__dirname, "../../../AppData/Local/Google/Chrome/Application/chrome.exe"),
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 })
    await page.goto('http://121.36.51.141:1997/add');
    axios.post("http://121.36.51.141:1997/api/movie", obj).then(page.close())
}

// http://121.36.51.141:1997/api/movie post
const obj = {
    areas: [],
    description: "",
    isClassic: true,
    isComing: true,
    name: "",
    poster: "",
    timeLong: 123,
    types: [],

}