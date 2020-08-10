const puppeteer = require("puppeteer");

exports.getCalendar = function (req, res) {
  (async () => {
    const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(
      `http://lnv-web.dataproject.com/CompetitionMatches.aspx?ID=72&PID=95`
    );

    const html = await page.evaluate(() => {
      let calendar = [];
      var l = 0;
      const days = document.querySelectorAll(
        "#printableArea > div > div.TabContent_Border.Box_Shadow.DIV_GenericContentBackground"
      );
      for (let i = 0; i < days.length; i++) {
        l = 0;
        let matchs = []
        calendar.push({
            day: i + 1,
            matchs : matchs
        });
        const numberOfMatch = days[i].querySelectorAll(
          "#printableArea > div > div.TabContent_Border.Box_Shadow.DIV_GenericContentBackground > div"
        );

        for (let j = 0; j < numberOfMatch.length ; j++) {
          l = j * 2;
          const homeTeam = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_Label6`
          ).textContent;
          const homeScoreSelector = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_Label1`
          );
          const homeScore = homeScoreSelector !== null ? homeScoreSelector.textContent : "";
          const guestScoreSelector = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_Label5`
          );
          const guestScore = guestScoreSelector !== null ? guestScoreSelector.textContent : "";
          const guestTeam = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_Label7`
          ).textContent;
          const homeTeamID = numberOfMatch[j].querySelector(
              `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_Logo_Home_sm`
            )
            .getAttribute("style")
          const guestTeamID = numberOfMatch[j].querySelector(
              `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_Logo_Guest_sm`
            )
            .getAttribute("style")
          const schedule = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_LB_DataOra`
          ).textContent;
          const place = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_LB_Palasport`
          ).textContent;
          const judge1 = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_LB_Arbitro1`
          ).textContent;
          const judge2 = numberOfMatch[j].querySelector(
            `#ctl00_Content_Main_197_userControl_RADLIST_Legs_ctrl${i*2}_RADLIST_Matches_ctrl${l}_LB_Arbitro2`
          ).textContent;
          matchs[j] = { 
              homeTeamID: homeTeamID.substring((homeTeamID.indexOf('TeamLogo_')+'TeamLogo_'.length),homeTeamID.lastIndexOf('.jpg')),
              homeTeam: homeTeam,
              homeScore: homeScore,
              guestTeamID: guestTeamID.substring((guestTeamID.indexOf('TeamLogo_')+'TeamLogo_'.length),guestTeamID.lastIndexOf('.jpg')),
              guestTeam: guestTeam,
              guestScore: guestScore,
              schedule: schedule,
              place: place,
              judge1: judge1,
              judge2: judge2,
          };
        }
      }
      return calendar;
    });
    console.log(html)
    res.send(html);
    await browser.close();
  })().catch((error) => {
    console.error(error);
  });
};
