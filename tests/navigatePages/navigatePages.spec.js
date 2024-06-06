import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';
import { NavigateModules } from '../../pageOjects/navigateModules.po.js';
const testData = require('../../fixtures/loginFixture.json');
const navigateData = require('../../fixtures/navigateModules.json');
const { requestResponseListeners } = require('../../utils/helper.spec.js');

test.beforeEach(async ({ page }) => {
    await requestResponseListeners(page);
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
})

test.describe('Navigate all pages', () => {
    test('Verify all the pages are opening as expected', async ({ page }) => {
        test.setTimeout(90000);
        // Iterate through the JSON data
        for (const key in navigateData) {
            if (Object.hasOwnProperty.call(navigateData, key)) {
                const modules = navigateData[key];
                // Click on the menu corresponding to the current key
                await page.click(`//div[contains(text(), '${key}')]`);
                // Wait for the module list to be visible after clicking the menu
                await page.waitForSelector(`//div[contains(text(), '${key}')]`, { timeout: 60000 });
                // Iterate over each module under the current key
                for (const module of modules) {
                    // Check if the module is present in the sidebar
                    const isModulePresent = await page.$(`//div[@class="main-menu"]//following-sibling::div[contains(text(), '${module.module}')]`);
                    if (!isModulePresent) {
                        console.warn(`Module '${module.module}' not found under key '${key}'`);
                        continue;
                    }
                    // Click on the module
                    await page.click(`//div[text() = '${key}']/following::div[text() = '${module.module}']`);
                    // Wait for navigation to complete
                    await page.waitForTimeout(1000);
                    // Validate the URL of the current page
                    const currentURL = page.url();
                    expect(currentURL).toContain(module.url, {
                        message: `URL mismatch for module '${module.module}' under key '${key}'. Expected URL to contain: ${module.url}, Actual: ${currentURL}`
                    });
                }
            }
        }
    })
})

test.afterEach(async ({ page }) => {
    await page.close();
})