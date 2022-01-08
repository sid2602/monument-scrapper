const puppeteer = require("puppeteer");

const pageLink = "https://www.google.com/travel/";

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

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await configurePage(browser, pageLink);
  await agreeForCredential(page);

  setTimeout(() => {
    browser.close();
  }, 1000000);
};

main();
