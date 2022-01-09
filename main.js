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

  let actualChildren = 0;
  const children = childrens[actualChildren];

  await children.click();
  const openedIndex = actualChildren + 3 - actualChildren;
  await page.waitForTimeout(1000);
  const descriptionDiv = await page.$(
    `div[aria-label="Top sights"] > div:nth-child(2) > div:nth-child(2) > div:nth-child(${openedIndex}) > div > *:nth-child(1) > div > div:nth-child(3) >div > div:nth-child(2)`,
    (e) => e
  );

  const description = await page.evaluate((el) => {
    const text = el.innerText;
    return text.substr(0, text.length - 20);
  }, descriptionDiv);
  console.log(description);
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
