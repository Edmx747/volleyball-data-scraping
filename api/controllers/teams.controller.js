const puppeteer = require('puppeteer');


exports.getTeams = function(req, res) {
  (async () => {
    console.log('getTeams')
    const browser = await puppeteer.launch({headless:true , slowMo: 100, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const teamName = req.params.teamName
    //Headless browser window size
    await page.setViewport({
      width: 1920,
      height: 1080
  })
    await page.goto(`http://lnv-web.dataproject.com/Statistics.aspx?ID=72&PID=95`);
    await page.waitForXPath(`//*[@id="RTS_Statistics_StatsType"]/div/ul/li[4]/a/span/span/span`)
    const playersButton = await page.$x(`//*[@id="RTS_Statistics_StatsType"]/div/ul/li[4]/a/span/span/span`)
    await playersButton[0].click();
    await page.waitForSelector('div.owl-item')
    const teamList = await page.evaluate(() => {
      let teams = [];
      for (let i = 0; i < document.querySelectorAll('div.owl-item').length; i++) {
          teams.push(document.querySelector(`#Content_Main_RP_TeamList_LBL_TeamSelection_${i}`).textContent)
      }
      return teams
    });
    const teamIndex = teamList.indexOf(teamName)
    //Solve pagination problem click on next page if team is not visible
    if (teamIndex > 8){
      const paginationButton = await page.$x(`//*[@id="ul_statitics_teamlist"]/div[2]/div/div[2]/span`); 
      await page.waitForSelector(`#Content_Main_RP_TeamList_LBL_TeamSelection_${teamIndex}`, { visible: true})
      await paginationButton[0].click()
    }
    await page.waitForSelector(`#Content_Main_RP_TeamList_IB_TeamLogo_${teamIndex}`);
    const teamButton = await page.$x(`//*[@id="Content_Main_RP_TeamList_IB_TeamLogo_${teamIndex}"]`);
    await teamButton[0].click();
    await page.waitForSelector('#RG_Stats_TeamPlayersDetails > table > tbody')
    let team;
    const playerList =  await page.evaluate(() => {
      let player = []
      let teamID
      const players = document.querySelectorAll('#RG_Stats_TeamPlayersDetails > table > tbody > tr')
      for (let index = 2; index < players.length; index++) {
        const number = players[index].querySelector(`#LBL_Number`).textContent
        const name = players[index].querySelector(`#LBL_PlayerName`).textContent
        const url = new URL('http://lnv-web.dataproject.com' + players[index].querySelector(`a#LinkToPlayerDetails`).getAttribute('href'))
        const urlParams = new URLSearchParams(url.search)
        teamID = urlParams.get('TeamID')
        const playerID = urlParams.get('PlayerID')
        player.push(
          {
          playerID : playerID,
          number: number,
          name: name,
          photo: `https://images.dataproject.com/lnv/TeamPlayer/100/200/TeamPlayer_${teamID}_${playerID}.jpg`,
          url: url.href
        })
      }
      return {player, teamID}
    })
    team = ({
      teamID: playerList.teamID,
      teamName: teamName,
      players: playerList.player
    })
    console.log(team)
    res.send(team);
    await browser.close()
  })().catch((error) => {
    console.error(error);
  });
};

exports.getPlayerDetails = function(req, res) {

  (async () => {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto(`http://lnv-web.dataproject.com/Statistics.aspx?ID=72&PID=95`);
    const playerButton = await page.$x(`//*[@id="RTS_Statistics_StatsType"]/div/ul/li/a/span/span/span[contains(text(), 'Joueurs')]`);
    await playerButton[0].click();
    await page.waitForSelector('div.owl-item')
    const html = await page.evaluate(() => {
      let teams = [];
      const teamList = document.querySelectorAll('div.owl-item')
      for (let index = 0; index < teamList.length; index++) {
        const teamName = document.querySelector(`#Content_Main_RP_TeamList_LBL_TeamSelection_${index}`).textContent
        teams.push(teamName)
      }
      return teams
    });
    console.log(html)
    res.send(html);
    await browser.close()
  })().catch((error) => {
    console.error(error);
  });
};


