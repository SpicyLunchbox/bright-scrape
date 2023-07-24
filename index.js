// puppeteer-core is the automation library without the browser
// only need core since you will be connecting to a remote browser
import puppeteer from "puppeteer-core";
import "dotenv/config";

async function run() {
  let browser;

  try {
    // using bright data scraping browser here
    // need to create an instance within your bright data management console
    const auth = `${process.env.USERNAME}:${process.env.PASSWORD}`;
    const host = process.env.HOST_URL;

    // connect to scraping browser here
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${auth}${host}`,
    });

    const page = await browser.newPage();

    // 2 minutes
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto("https://amazon.com/Best-Sellers/zgbs");

    // you will need to get a manageable chunk of html
    // open up the page & inspect the html elements directly to find the list of products that you wish to scrape
    // find a good selector as a starting point
    // ? how can we automate this step?

    // below line is an alternative to manually searching for a selector.  This signifigant portion of html could
    // be used to grab the entire page and programmatically search for optimal element(s).
    //* const html = await page.evaluate(() => document.documentElement.outerHTML);

    const selector = ".a-carousel";

    const desiredElement = await page.waitForSelector(selector);

    const text = await desiredElement.evaluate((e) => e.innerHTML);

    console.log(text);

    // from here, we will take our inner html text and drop it into a chat-gpt prompt
    // an example start to the prompt could be "Given the following HTML, how would I extract the product name and price using puppeteer?"
    // grab the page.evaluation code provided by chat-gpt and copy paste it into your codebase
    // examples are found in other .js files
    // ? how can we automate this step?
    // ? maybe a chat-gpt plugin to auto prompt and reduce the response code,
    // ? then script a function run with a callback containing the response code

    return;
  } catch (e) {
    console.error("scrape failed", e);
  } finally {
    await browser?.close();
  }
}

run();
