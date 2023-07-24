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

    // The below code is provided by chat-gpt using the method described in index.js
    const productsData = await page.evaluate(() => {
      const products = Array.from(
        document.querySelectorAll(".a-carousel-card")
      );
      return products.map((product) => {
        const titleElement = product.querySelector(
          ".p13n-sc-truncate-desktop-type2"
        );
        const priceElement = product.querySelector(
          "._cDEzb_p13n-sc-price_3mJ9Z"
        );

        return {
          title: titleElement ? titleElement.innerText.trim() : null,
          price: priceElement ? priceElement.innerText.trim() : null,
        };
      });
    });

    //* scraping is complete!
    // from here, we could send our extracted data to a vector database, which could be used to build and train an ai agent
    console.log(productsData);

    return;
  } catch (e) {
    console.error("scrape failed", e);
  } finally {
    await browser?.close();
  }
}

run();
