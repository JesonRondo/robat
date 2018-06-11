const cheerio = require('cheerio')
const request = require('superagent');

function postMessage() {
  request
  .get('https://www.tuicool.com/ah/')
  .end((err, res) => {
    if (err) return;

    if (res && res.text) {
      const $ = cheerio.load(res.text);
      const links = [];
      $('#list_article').children().slice(0, 8).each(function(i, elem) {
        const title = $(this).find('a').attr('title');
        const link = $(this).find('a').attr('href');
        const img = $(this).find('img').attr('src');

        const data = {
          title: title,
          messageURL: 'https://www.tuicool.com' + link,
          picURL: img
        };
        links.push(data);
      });
      const body = {
        feedCard: {
          links: links,
        },
        msgtype: "feedCard",
      };
      console.log(body);

      // 推送
      request
        .post('https://oapi.dingtalk.com/robot/send?access_token=cde52496babb8093302f508729ac50a9f4d1d63c151785134e13e3d592bb988d')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(body))
        .end((err, res) => {
          if (err)
            console.log(err);
          
          console.log(res.body);
        });
    }
  });
}

setInterval(() => {
  const date = new Date();
  if (date.getHours() === 15 || date.getHours() === 9) {
    postMessage();
  }
}, 1000 * 60 * 60)

