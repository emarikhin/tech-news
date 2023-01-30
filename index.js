const Parser = require('rss-parser');
const axios = require('axios');
const config = require('config');

var rssFeeds = [
    'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/PersonalTech.xml',
    'https://www.cnet.com/rss/all/',
    'https://techcrunch.com/feed/',
    'https://www.engadget.com/rss.xml',
    'https://www.theverge.com/rss/index.xml',
    'https://www.androidauthority.com/feed/',
    'https://www.pcworld.com/index.rss',
    'https://feeds.feedburner.com/thenextweb',
    'https://www.cnet.com/rss/all/',
    'https://www.digitaltrends.com/feed/',
    'https://feeds.washingtonpost.com/rss/business/technology',
    'https://gadgets.ndtv.com/rss/feeds',
    'http://www.techradar.com/rss',
    'https://www.recode.net/rss/index.xml',
    'http://www.zdnet.com/news/rss.xml',
    'https://www.techspot.com/backend.xml',
    'https://www.techrepublic.com/rssfeeds/articles/?feedType=rssfeeds&amp',
    'http://feeds.feedburner.com/venturebeat/SZYF',
    'https://feeds.feedburner.com/digit/latest-from-digit',
    'https://appleinsider.com/rss/news/',
    'https://www.macworld.com/index.rss',
    'https://www.techinasia.com/feed',
    'https://www.computerworld.com/au/index.rss',
    'https://www.anandtech.com/rss',
    'https://feeds.feedblitz.com/newatlas',
    'https://www.geekwire.com/feed',
    'https://www.ghacks.net/feed/',
    'http://www.theregister.co.uk/headlines.atom',
    'https://readwrite.com/feed/',
    'https://www.networkworld.com/index.rss',
    'https://www.techpout.com/feed/',
    'https://www.androidheadlines.com/feed',
    'http://feeds.feedburner.com/ubergizmo',
    'https://betanews.com/feed/',
    'https://feeds.feedburner.com/Medgadget',
    'https://mobilesyrup.com/feed',
    'http://feeds.feedburner.com/RedmondPie',
    'http://techweez.com/feed/',
    'https://www.siliconrepublic.com/feed',
    'https://www.droid-life.com/feed',
    'https://flipshope.com/blog/feed',
    'https://www.itnews.com.au/rss/rss.ashx',
    'https://www.techjuice.pk/feed/',
    'https://www.technewsworld.com/perl/syndication/rssfull.pl',
    'https://www.researchsnipers.com/feed/',
    'https://www.nextgov.com/rss/all/',
    'https://www.naval-technology.com/feed/',
    'https://enterprisetalk.com/feed/',
    'https://www.developer-tech.com/feed',
    'https://www.betechwise.com/feed/',
    'https://news969.com/feed/',
    'https://techplugged.com/feed/',
    'https://www.rayarena.com/feed',
    'https://www.theencrypt.com/feed/',
    'https://www.frontpagetech.com/feed/',
    'https://www.lighthome.in/feed/',
    'https://www.gadgetsinnepal.com.np/feed/',
    'https://www.platformexecutive.com/feed',
    'https://ohsem.me/feed/',
    'https://www.technologydrift.com/feed/',
    'https://techviral.net/feed/',
    'https://www.eyetrodigital.com/feed/',
    'https://www.theblackweb.in/feed/',
    'https://technode.com/feed/',
    'https://insiderpaper.com/feed/',
    'https://www.techfeeddata.com/feed',
    'https://www.techdirt.com/techdirt_rss.xml',
    'http://www.techcentral.ie/feed/',
    'https://digitaltimesng.com/feed',
    'https://www.technews.city/feeds/posts/default?alt=rss',
    'https://fossbytes.com/feed/?x=1',
    'https://scoopfed.com/feed/',
    'http://feeds.feedburner.com/ilounge',
    'https://in.pcmag.com/feed.xml',
    'https://www.techhive.com/index.rss',
    'https://techvaz.com/',
    'https://www.chinatechnews.com/feed',
    'https://tutoroftech.com/feed/',
    'https://www.cio.com/index.rss',
    'https://the-electronics.com/feed/',
    'https://spider760.blogspot.com/feeds/posts/default?alt=rss',
    'https://www.techdue.com/feed/?format=xml',
    'https://www.sgfizz.com/feed/',
    'http://blog.vertexplus.com/feed/',
    'https://www.ithubpk.com/feed/',
    'https://www.techworld.com/news/rss',
    'https://www.techwebi.com/feed',
    'https://techcavit.com/feed/',
    'http://feeds.feedburner.com/androwintricks1',
    'https://www.blogger.com/feeds/4457929370096894305/posts/default',
    'https://digitechbytes.com/feed/',
    'https://www.mercurynews.com/tag/siliconbeat/feed/',
    'https://feeds.feedburner.com/igyaan',
    'https://www.alltechcorner.com/feed/',
    'https://www.newskart.com/feed',
    'https://techincidents.com/feed/',
    'https://techfans.co.uk/feed',
    'http://techfans.co.uk/feed',
    'https://geek.com/feed/',
    'https://www.theinquirer.net/feeds/rss',
    'https://www.cliqfold.com/feed/',
    'https://www.sporttechie.com/feed',
    'https://www.geekboots.com/news/feed',
]

let parser = new Parser();

async function fetchRSSFeed(url) {

    let feed = await parser.parseURL(url)

    var feedTitle = feed.title;

    var filteredFeed = feed.items.map(item => {
        var keyWordsArr = config.keyWords
        var filteredRssFeed = keyWordsArr.map(keyWord => {
            var itemTitle = item.title
            var itemLink = item.link
            return (item.title.includes(keyWord)) ? Object.assign({feedTitle, itemTitle, itemLink}) : false
        })
        .filter(f => !!f)
        return filteredRssFeed;
    })
    .filter(f => !!f.length);

    return filteredFeed;
};

async function run(payload) {
  let url = slackApiUrl;
  let slackToken = config.apiToken;
  let res = await axios.post(url, {
    channel: slackChannel,
    text : payload
  }, { headers: { authorization: `Bearer ${slackToken}` } });

  console.log('Done', res.data);
}

rssFeeds.map(url => {
    return fetchRSSFeed(url)
    .then(function(filteredFeed) {
        var finalFeed = filteredFeed.filter(f => !!f.length);
        var prettyFeed = JSON.stringify(finalFeed, undefined, 1);
        console.log('prettyFeed:', prettyFeed);
        return prettyFeed;
    })
    .then(function(prettyFeed) {
        run(prettyFeed);
    })
})

