const puppeteer = require('puppeteer');

exports.getPlayerDetails = function(req, res) {

  (async () => {
    const teamID = req.params.teamID
    const playerID = req.params.playerID
    const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`http://lnv-web.dataproject.com/PlayerDetails.aspx?TeamID=${teamID}&PlayerID=${playerID}&ID=72`);
    const html = await page.evaluate(() => {
      const photo = document.querySelector('#Content_Main_RadBinaryImage1').getAttribute('src')
      const position = document.querySelector('#Content_Main_PlayerView_LBL_Position').textContent
      const size = document.querySelector('#Content_Main_PlayerView_Label7').textContent
      const birthday = document.querySelector('#Content_Main_PlayerView_LBL_BirthDate').textContent
      return {
        photo : photo,
        position : position,
        size : size,
        birthday : birthday
      }
    })
    res.send(html);
    await browser.close()
  })().catch((error) => {
    console.error(error);
  });
};


