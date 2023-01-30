const Parser = require('rss-parser');
const axios = require('axios');
const config = require('config');

let rssFeeds = [
    'https://www.pcworld.com/index.rss',
    'https://www.techinasia.com/feed',
    'https://www.eweek.com/feed/',
    'https://www.rayarena.com/feed',
    'https://www.theencrypt.com/feed/',
    'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/PersonalTech.xml',
    'https://www.cnet.com/rss/all/',
    'https://techcrunch.com/feed/',
    'https://www.engadget.com/rss.xml',
    'https://www.theverge.com/rss/index.xml',
    'https://technode.com/feed/',
    'https://techcavit.com/feed/',
]

let parser = new Parser();

async function fetchRSSFeed(url) {
    let feed = await parser.parseURL(url)
    let feedTitle = feed.title;
    let filteredFeed = feed.items.reduce((allFeeds, item) => {
        let keyWordsArr = config.keyWords
        let filteredRssFeed = keyWordsArr.map(keyWord => {
            let itemTitle = item.title
            let itemLink = item.link
            return (item.title.includes(keyWord)) ? Object.assign({feedTitle, itemTitle, itemLink}) : false
        })
        .filter(f => !!f)
        return allFeeds.concat(filteredRssFeed);
    }, [])
    console.log('filteredFeed', filteredFeed);
    return filteredFeed;
};

async function postToSlack(payload) {
    console.log('payload:', payload);
    let slackURL = config.slackApiUrl;
    let slackToken = config.apiToken;
    let res = await axios.post(slackURL, {
        channel: config.slackChannel,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: payload
                }
            }
        ]
    }, { 
        headers: { 
            authorization: `Bearer ${slackToken}` 
        } 
    });
    console.log('Done', res.data);
    return;
}
 
async function processFeed(url) {
    console.log('running through', url);
    await fetchRSSFeed(url)
    .then(function(filteredFeed) {
        return (!!filteredFeed && !!filteredFeed.length) ? prettifyPayload(filteredFeed) : false
    })
}

async function prettifyPayload(filteredFeed) {
    return filteredFeed.map(line => {    
        let resLine = `---------------------\n\n*${line.feedTitle}*\n\n${line.itemTitle}\n\n${line.itemLink}`
        return postToSlack(resLine);
    })
}

rssFeeds.forEach(async feed => await processFeed(feed))
