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
    // this example also grabs the product url so that further data can be accessed for extraction
    const productsData = await page.evaluate(() => {
      const productElements = document.querySelectorAll("li.a-carousel-card");

      const data = productElements.map((prod) => {
        const productName = prod
          .querySelector(".p13n-sc-truncate-desktop-type2")
          .textContent.trim();
        const productPrice = prod
          .querySelector("_cDEzv_p13n-sc-price_3mJ9Z")
          .textContent.trim();
        const productURL = prod.querySelector(
          'a.a-link-normal[href*="/dp/"]'
        ).href;

        return {
          name: productName,
          price: productPrice,
          url: productURL,
        };
      });

      return data;
    });

    const delay = (ms) => new Promise((res) => sestTimeout(res, ms));

    for (const product of productsData) {
      console.log(`Navigating to: ${product.url}`);
      await page.goto(product.url);
      await delay(2000); // 2 second delay to prevent sending an overwhelming amount of server requests
    }

    //TODO: further data extraction Logic here

    return;
  } catch (e) {
    console.error("scrape failed", e);
  } finally {
    await browser?.close();
  }
}

run();
