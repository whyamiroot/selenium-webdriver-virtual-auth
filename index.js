/**
* MIT License
*
* Copyright (c) 2020 whyamiroot
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

const { Builder,
        Capabilities,
        until,
        By,
        VirtualAuthenticatorOptions,
        logging
    } = require('selenium-webdriver-js-virtual-auth');
const { Options } = require('selenium-webdriver-js-virtual-auth/chrome');

const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);

const screenshot = async (element, file) => {
    const screen = await element.takeScreenshot();
    return writeFile(file, screen, 'base64');
};

const printConsoleLogs = (driver) => {
    driver.manage().logs().get(logging.Type.BROWSER)
        .then((entries) => {
            entries.forEach(
                (entry) => console.log('[%s] %s', entry.level.name, entry.message)
            );
        });
}

const setup = async () => {
    const options = new Options();
    options.setAlertBehavior(Capabilities.ACCEPT)
        .setAcceptInsecureCerts(true)
        .addArguments(['--headless',
                       '--no-sandbox',
                       '--window-size=1920,1080',
                       '--verbose'
                    ]);
    
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer('http://localhost:4444/wd/hub')
        .build();
}

(async function main() {
    const driver = await setup();
    try {
        await driver.get('https://webauthn.io');

        const authOptions = new VirtualAuthenticatorOptions();
        const authenticator = await driver.manage().addVirtualAuthenticator(authOptions);
        console.log('Authenticator:', authenticator);

        const userNameField = await driver.wait(until.elementLocated(By.id('input-email')));
        // Just put a random string as a user name
        await userNameField.sendKeys(Math.random().toString(36).substring(2, 15));

        // Register the authenticator
        const registerButton = await driver.findElement(By.id('register-button'));
        await registerButton.click();

        // Check if registration was successful
        await driver.wait(until.elementLocated(By.className('popover-body')));
        
        // Click sign in
        const loginButton = await driver.findElement(By.id('login-button'));
        await loginButton.click();

        // There should be a picture of a party cat
        await driver.wait(until.elementLocated(By.className('party-cat')));
        await screenshot(driver, 'result.png');

        await driver.manage().removeVirtualAuthenticator(authenticator);
    } catch(e) {
        console.error(e);
        printConsoleLogs(driver);
    } finally {
        driver.quit();
    }
})();