// ******** ------- Scrap Data from Art World News Sites and send to database ------- ********
let cron = require('node-cron');

//*** ---------- Connections to mongo server and schema file ----------- * 
const mongo = require('./mongo');
// const mongoose = require('mongoose');
const articleSchema = require('./schemas/article-schema');

//*** ---------- URL links to art news resources ----------- *  
const puppeteer = require('puppeteer');
const artNpapUrl = 'https://www.theartnewspaper.com/news';
const artNUrl = 'https://www.artnews.com/c/art-news/news/';
const artNetUrl = 'https://news.artnet.com/';
const hyperAUrl = 'https://hyperallergic.com/category/art/';
const artsyUrl = 'https://www.artsy.net/articles';
const artForUrl ='https://www.artforum.com/news';
//*** ----------------- Main News Scraper -------------------- *
function scrape () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // *** --------- The Art Newspaper ------- *
            await page.goto(artNpapUrl);
            let urls1 = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('.cp-comp');
                
                items.forEach((item) => {
                    articleUrl = item.querySelector('.cp-link').getAttribute('href');//<-- fix relative url --
                    results.push({
                        source: 'artNewsPaper',
                        linkUrl:  `https://www.theartnewspaper.com${articleUrl}`,
                        imgUrl:item.querySelector('.cp-thumbnail-cont .cp-thumbnail').getAttribute('data-bg'),
                        title: item.querySelector('.cp-details .cp-preview-headline').innerText,
                        descript: item.querySelector('.cp-details .cp-excerpt').innerText,
                    });
                });
               
                return results.slice(0, 6);
            });
            // *** --------- Art News ------- *
            await page.goto(artNUrl);
            let urls2 = await page.evaluate(() => {
                let results2 = [];
                let items2 = document.querySelectorAll('article.story');
                
                items2.forEach((item) => {
                    results2.push({
                        source: 'artNews',
                        linkUrl:  item.querySelector('.lrv-a-grid .a-span2 h3 a').getAttribute('href'),
                        imgUrl:item.querySelector('.lrv-a-grid img.c-lazy-image__img').getAttribute('data-lazy-src'),
                        title: item.querySelector('.lrv-a-grid .a-span2 h3 a').innerText,
                        descript: item.querySelector('.lrv-a-grid .a-span2 p').innerText,
                    });
                });
                
                return results2.slice(0, 6);
            });
            // *** --------- ArtNet ------- *
            await page.goto(artNetUrl);
            let urls3 = await page.evaluate(() => {
                let results3 = [];
                let items3 = document.querySelectorAll('.media .teaser');
                
                items3.forEach((item) => {
                    results3.push({
                        source: 'artNet',
                        linkUrl:  item.querySelector('.teaser-info a').getAttribute('href'),
                        imgUrl:item.querySelector('.teaser-image .image-wrapper img').getAttribute('src'),
                        title: item.querySelector('.teaser-info a .teaser-title').innerText,
                        descript: item.querySelector('.teaser-info a .teaser-blurb').innerText,
                    });
                });
                
                return results3.slice(0, 6);
            });
            // *** --------- Hyperallergic ------- *
            await page.goto(hyperAUrl);
            let urls4 = await page.evaluate(() => {
                let results4 = [];
                let items4 = document.querySelectorAll('article.post');
                
                items4.forEach((item) => {
                    results4.push({
                        source: 'hyperAllergic',
                        linkUrl:  item.querySelector('.entry-container .entry-header .entry-title a').getAttribute('href'),
                        imgUrl:item.querySelector('.post figure a amp-img').getAttribute('src'),
                        title: item.querySelector('.entry-container .entry-header .entry-title').innerText,
                        descript: item.querySelector('.entry-container .entry-content p').innerText,
                    });
                });
               
                return results4.slice(0, 6);
            });
            // *** ---------  Artsy  ------- *
            await page.goto(artsyUrl);
            let urls5 = await page.evaluate(() => {
                let results5 = [];
                let items5 = document.querySelectorAll('.article-figure-container');
                
                items5.forEach((item) => {
                    articleUrl = item.querySelector('a').getAttribute('href');//<-- fix relative url --
                    results5.push({
                        source: 'artsy',
                        linkUrl:  `https://www.artsy.net/${articleUrl}`,
                        imgUrl:item.querySelector('a.article-figure-img-container .article-figure-img').getAttribute('style'),
                        title: item.querySelector('.article-figure-figcaption .article-figure-title').innerText,
                        descript: "Artsy does not provide a description"
                    });
                });
                
                return results5.slice(0, 6);
            });
            // *** ---------  Art Forum  ------- *
            await page.goto(artForUrl);
            let urls6 = await page.evaluate(() => {
                let results6 = [];
                let items6 = document.querySelectorAll('.news-list__main');
                
                items6.forEach((item) => {
                    results6.push({
                        source: 'artForum',
                        linkUrl:  item.querySelector('a').getAttribute('href'),
                        imgUrl:item.querySelector('.news-list__main .image-container img').getAttribute('src'),
                        title: item.querySelector('.news-list__main .news-list__words .news__title a').innerText,
                        descript: item.querySelector('.news-list__main .news-list__words .news-list__content p').innerText
                    });
                });
                
                return results6.slice(0, 6);
            });
            //*** -------------------- A collection of Objects with Arrays of news links for each Url ---------------------- *
            // browser.close();
            return resolve({artNP:urls1, artNews:urls2, artNet:urls3, hyperA:urls4, artsy:urls5, artForum:urls6}); 

        } catch (e) {
            return reject(e);
        }
    })
}
cron.schedule('12 * * * * ', () => {     // '0 */8 * * * ' <----- cron - run 3 times a day **** ###
scrape().then(function(value) { 
    let artColArray = value; 
    let artNewsPa = artColArray.artNP;
    let artNews = artColArray.artNews;
    let artNet = artColArray.artNet;
    let hyperA = artColArray.hyperA;
    let artsy = artColArray.artsy;
    let artForum = artColArray.artForum;
    
    addToMongoDB(artNewsPa, artNews, artNet, hyperA, artsy, artForum);
  }).catch(console.error);
});    // <----- cron **** ### 

  const addToMongoDB = async (artNewsPa, artNews, artNet, hyperA, artsy, artForum) => {
    await mongo().then(async (mongoose) => {
        try {
            console.log('Connected to mongoDb!');

    // *-- Remove older links from database --------*
            await articleSchema.artNewsP.deleteMany({ "source": "artNewsPaper" });
            await articleSchema.artNews.deleteMany({ "source": "artNews" });
            await articleSchema.artNet.deleteMany({ "source": "artNet" });
            await articleSchema.hyperAll.deleteMany({ "source": "hyperAll" });
            await articleSchema.artsy.deleteMany({ "source": "artsy" });
            await articleSchema.artForums.deleteMany({ "source": "artForum" });

    // *-- Call addNewData and add to database ---------*
            await addNewData(artNewsPa, artNews, artNet, hyperA, artsy, artForum);
            console.log(artNewsPa);

        } finally {
            mongoose.connection.close()
        }
    })
};

// *-- Add new links to database ---------*
async function addNewData(src1, src2, src3, src4, src5, src6){
    await articleSchema.artNewsP.insertMany(src1);
    await articleSchema.artNews.insertMany(src2);
    await articleSchema.artNet.insertMany(src3);
    await articleSchema.hyperAll.insertMany(src4);
    await articleSchema.artsy.insertMany(src5);
    await articleSchema.artForums.insertMany(src6);
};
