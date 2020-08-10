const puppeteer = require('puppeteer');

exports.getNewsPage = function(req, res) {
    (async () => {
        const currentPage = req.params.page
        const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox'] });
        const page = await browser.newPage()
        await page.goto(`http://www.lnv.fr/competition-10-45_${currentPage}.html`)

        const newsList = await page.$$eval('#news_liste_wrapper > a', news => news.map((n) => {
          return {
            title : n.querySelector('div.news_home_item_title').textContent,
            pubDate: n.querySelector('div.news_home_item_date').textContent,
            imageSrc: n.querySelector('div.news_home_item_picture > img').getAttribute('src'),
            description: n.querySelector('div.news_home_item_description').textContent.trim(),
            link: 'http://www.lnv.fr/' + n.getAttribute('href')
          };
        }));
        const pagination = await page.$$eval('#multiPageActus > table > tbody > tr > td', pages => pages.map((p) => {
          let html = p.querySelector('a:last-child').getAttribute('href')
          return html.substring(html.length - 7, html.length -5);
        }))
        newsList.push({
          page : currentPage,
          totalPage :pagination[0]
        })
        res.send(newsList)
        await browser.close()
      })().catch((error) => {
        console.error(error);
      });
  };