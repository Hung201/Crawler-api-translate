// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor } from 'apify';
// Crawlee - web scraping and browser automation library (Read more at https://crawlee.dev)
import { CheerioCrawler } from 'crawlee';
// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions

import { getBaseUrl, getDomain } from './helpers/crawler-helper.js';
import { router, config } from './routes.js';
import fs from 'fs';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

// Read input from input.json file
const input = JSON.parse(fs.readFileSync('./input.json', 'utf8'));

const {
    shopUrl,
    pageStart = 1,
    pageEnd = 1,
    delayMin = 500,
    delayMax = 1000,
    maxRequestsPerCrawl = 50000,
} = input;

const startApp = () => {
    config.pageStart = pageStart;
    config.pageEnd = pageEnd;

    config.delayMin = delayMin;
    config.delayMax = delayMax;

    config.baseUrl = getBaseUrl(shopUrl);
    config.domain = getDomain(shopUrl);
};

startApp();

// Create a dataset to store the crawled data
const dataset = await Actor.openDataset();

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl,
    requestHandlerTimeoutSecs: 120,
    minConcurrency: 1,
    maxConcurrency: 1
});

// Log the dataset ID for reference
console.log(`Dataset ID: ${dataset.id}`);

await crawler.run([config.baseUrl]);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit()
await Actor.exit();