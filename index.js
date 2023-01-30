const Parser = require('rss-parser');
const axios = require('axios');
const config = require('config');

let rssFeeds = [
    'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/PersonalTech.xml',
    'https://www.cnet.com/rss/all/',
    'https://techcrunch.com/feed/',
    'https://www.engadget.com/rss.xml',
    'https://www.theverge.com/rss/index.xml'
]

let parser = new Parser();

async function fetchRSSFeed(url) {
    console.log('running through', url);
    let feed = await parser.parseURL(url)
    let feedTitle = feed.title;
    let filteredFeed = feed.items.map(item => {
        let keyWordsArr = config.keyWords
        let filteredRssFeed = keyWordsArr.map(keyWord => {
            let itemTitle = item.title
            let itemLink = item.link
            return (item.title.includes(keyWord)) ? Object.assign({feedTitle, itemTitle, itemLink}) : false
        })
        .filter(f => !!f)
        return filteredRssFeed;
    })
    .filter(f => !!f.length);
    return filteredFeed;
};

async function run(payload) {
  let url = config.slackApiUrl;
  let slackToken = config.apiToken;
  let res = await axios.post(url, {
    channel: config.slackChannel,
    text : payload
  }, { headers: { authorization: `Bearer ${slackToken}` } });

  console.log('Done', res.data);
}
 
(async function fetchFeed() {
    try {
        return rssFeeds.map(url => {
            return fetchRSSFeed(url)
            .then(function(filteredFeed) {
                if (!!filteredFeed && !!filteredFeed.length) {
                    let finalFeed = filteredFeed.filter(f => !!f.length);
                    let prettyFeed = JSON.stringify(finalFeed, undefined, 1);
                    console.log('prettyFeed:', prettyFeed);
                    return prettyFeed;
                }
                return;
            })
            .then(function(prettyFeed) {
                run(prettyFeed);
            })
        })
    } catch (err) {
        console.log(err);
    }
})();
