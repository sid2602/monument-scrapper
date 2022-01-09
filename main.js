const puppeteer = require("puppeteer");

// const pageLink = "https://www.google.com/travel/";
const pageLink =
  "https://www.google.com/travel/things-to-do?dest_mid=%2Fm%2F0491y&dest_state_type=main&dest_src=yts&q=Krak%C3%B3w";
const configurePage = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url);
  return page;
};

const agreeForCredential = async (page) => {
  const [button] = await page.$x("//*[text()[contains(.,'I agree')]]");

  if (button) {
    button.click();
  }
};

const fillSearchMonumentInput = async (page) => {
  const inputs = await page.$$eval(
    'input[placeholder="Search for flights, hotels, and more"]',
    (elements) => elements.map((elem) => elem)
  );
  console.log(inputs);
};

const getTopSights = async (page) => {
  const childrens = await page.$$(
    'div[aria-label="Top sights"] > div:nth-child(2) > div:nth-child(2) > *',
    (e) => e
  );

  const children = childrens[0];

  await children.click();
  await page.waitForTimeout(1000);
  const newChildrens = await page.$$(
    'div[aria-label="Top sights"] > div:nth-child(2) > div:nth-child(2) > *',
    (e) => e
  );

  const newChildren = newChildrens[2];

  const singleChildren = await page.evaluate((el) => el.innerText, newChildren);
  console.log(singleChildren);
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await configurePage(browser, pageLink);
  await agreeForCredential(page),
    await page.waitForNavigation(),
    await getTopSights(page),
    setTimeout(() => {
      browser.close();
    }, 1000000);
};
main();
