//* LIB
const puppeteer = require("puppeteer");

class PuppeteerService {
  async start({ url }) {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/:/g, "-");
    const fileName = `screenshot-${formattedDate}.jpeg`;

    // Run into mode headless default
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Adjust setting before page when load
    await page.setViewport({ width: 1280, height: 800 });

    // Processing load page and screenshot
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }); // Chờ cho đến khi trang đã tải xong hoặc không có hoạt động mạng trong 30 giây
      const screenshot = await page.screenshot({
        path: fileName,
        type: "jpeg",
        quality: 100,
        fullPage: true, // Screen  all page
        // clip: { x: 0, y: 0, width: 800, height: 600 }, // Nếu muốn chụp phần cụ thể của trang, hãy bỏ comment và chỉnh sửa clip
      });
      console.log(`Screenshot saved as ${fileName}`);
      return screenshot;
    } catch (error) {
      console.error(`Error occurred while taking screenshot: ${error}`);
    } finally {
      // Close the browser after when finish
      await browser.close();
    }
  }
}

module.exports = new PuppeteerService();
