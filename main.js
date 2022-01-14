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
  const topSights = `div[aria-label="Top sights"] > div:nth-child(2) > div:nth-child(2) > *`;

  const childrens = await page.$$(topSights, (e) => e);

  for (
    let actualChildrenIndex = 0;
    // actualChildrenIndex < 1;
    actualChildrenIndex < childrens.length;
    actualChildrenIndex++
  ) {
    const children = childrens[actualChildrenIndex];
    const basicSightLinkPrefix = ` div[aria-label="Top sights"] > div:nth-child(2) > div:nth-child(2) > div:nth-child(${
      actualChildrenIndex + 1
    }) > div > div >div >div:nth-child(2) > div`;

    const basicSights = await page.$$(`${basicSightLinkPrefix}`, (e) => e);

    const name = await page.evaluate((el) => {
      return el.innerText;
    }, basicSights[0]);

    console.log(name);

    const shortDesription = await page.evaluate((el) => {
      return el.innerText;
    }, basicSights[2]);

    console.log(shortDesription);

    const openedIndex = actualChildrenIndex + 3 - actualChildrenIndex;
    const extendedSightLinkPrefix = `div[aria-label="Top sights"] > div:nth-child(2) > div:nth-child(2) > div:nth-child(${openedIndex}) > div > `;
    const extendedSightLinkButtonSufix = `*:nth-child(2) > div > button`;
    const desriptionExtendedSightLinkSufix = `*:nth-child(1) > div > div:nth-child(3) >div > div:nth-child(2)`;

    await children.click();
    await page.waitForTimeout(1000);

    const descriptionDiv = await page.$(
      `${extendedSightLinkPrefix} ${desriptionExtendedSightLinkSufix}`,
      (e) => e
    );

    const description = await page.evaluate((el) => {
      const text = el.innerText;
      return text.substr(0, text.length - 20);
    }, descriptionDiv);

    console.log(description, "\n");

    const closeBtn = await page.$(
      `${extendedSightLinkPrefix} ${extendedSightLinkButtonSufix}`,
      (e) => e
    );

    await page.evaluate(() => {
      window.scrollBy(0, -100);
    });
    await page.waitForTimeout(200);
    closeBtn.click();
    await page.waitForTimeout(1000);
  }
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
