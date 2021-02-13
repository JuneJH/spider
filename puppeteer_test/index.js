const puppeteer = require('puppeteer-core');
const path = require("path");
// const executablePath = path.join(__dirname,"../../AppData/Local/Google/Chrome/Application/chrome.exe")

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: path.join(__dirname, "../../AppData/Local/Google/Chrome/Application/chrome.exe"),
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 })
    await page.goto('https://maoyan.com/films?showType=1');
    const urls = [];
    page.$$(".movie-list>dd>.movie-item>a").then(dds=>{
        console.table(dds.href)
        // dds.forEach(dd=>{
        //     console.log(dd)
        //     urls.push(dd.href)
        // })
        console.log(urls)
    })

})();