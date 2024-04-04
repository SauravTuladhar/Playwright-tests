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
        const navigateModules = new NavigateModules(page);
        const sideMenuItems = await navigateModules.sideMenu();
        for (const menuItem of sideMenuItems) {
            const menuItemText = await menuItem.innerText();
            const trimmedMenuItemText = menuItemText.trim().replaceAll(/[\n]/g, "").toLowerCase();/*  */
            for (const item of navigateData) {
                if (trimmedMenuItemText === item.module.toLowerCase()) {
                    await menuItem.click();
                    await expect(page).toHaveURL(item.url);
                    break;
                }
            }
        }
    })

})

test.afterEach(async ({ page }) => {
    await page.close();
})