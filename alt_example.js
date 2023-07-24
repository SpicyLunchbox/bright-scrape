import puppeteer from "puppeteer-core";
import "dotenv/config";

async function run() {
  let browser;

  try {
    const auth = `${process.env.USERNAME}:${process.env.PASSWORD}`;
    const host = process.env.HOST_URL;

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${auth}${host}`,
    });

    const page = await browser.newPage();

    // 2 minutes
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto("https://amazon.com/Best-Sellers/zgbs");

    // ? automate selector search?
    const selector = ".a-carousel";

    // below line could be used to grab the entire page and programmatically search for optimal element(s) selector(s).
    //* const html = await page.evaluate(() => document.documentElement.outerHTML);

    const desiredElement = await page.waitForSelector(selector);

    const html = await desiredElement.evaluate((e) => e.innerHTML);

    // html with prompt is sent to LLM plugin
    // response returns desired page selectors
    const productListSelector = "li.a-carousel-card";
    const productNameSelector = ".p13n-sc-truncate-desktop-type2";
    const productPriceSelector = "._cDEzb_p13n-sc-price_3mJ9Z";

    const productItems = await page.$$(productListSelector);

    for (const item of productItems) {
      // Extract product name
      const productNameElement = await item.$(productNameSelector);

      const productName = await productNameElement.evaluate((el) =>
        el.textContent.trim()
      );

      // Extract product price
      const productPriceElement = await item.$(productPriceSelector);
      const productPrice = await productPriceElement.evaluate((el) =>
        el.textContent.trim()
      );

      console.log("Product Name:", productName);
      console.log("Product Price:", productPrice);
      console.log("------------------------");
    }

    return;
  } catch (e) {
    console.error("scrape failed", e);
  } finally {
    await browser?.close();
  }
}

run();
