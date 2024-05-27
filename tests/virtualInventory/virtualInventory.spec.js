import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po.js';
import { VirtualInventoryPage } from '../../pageOjects/virtualInventory.po.js';
const testData = require('../../fixtures/loginFixture.json');
const VirtualInventoryTestData = require('../../fixtures/virtualInventoryFixtures.json');
const { requestResponseListeners, createEntity, authenticateUser, deleteEntity, validateEntity, getEntityId } = require('../../utils/helper.spec.js');

let accessToken, interceptId;

test.beforeEach(async ({ page }) => {
    await requestResponseListeners(page);
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
})

test.describe('Virtual inventory testcases', () => {
    test('View Virtual Buffer Setup list test', async ({ page }) => {
        const virtualInventory = new VirtualInventoryPage(page);
        await virtualInventory.virtualBufferView();
    })

    test('Virtual inventory Add test', async ({ page, context, request }) => {
        const virtualInventory = new VirtualInventoryPage(page);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const currencyBufferId = await getEntityId(accessToken, `/transaction/manage/currency-buffer`, "200", "South Korean Won", { request });
        if (currencyBufferId) {
            await deleteEntity(accessToken, `/transaction/manage/currency-buffer/${currencyBufferId}`, { request });
        }
        await virtualInventory.virtualInventoryAdd(VirtualInventoryTestData.VirtualInventory.countryName, VirtualInventoryTestData.VirtualInventory.limit);
    })
})

async function intercept(module, { context, page }) {
    await context.route(module, async route => {
        await route.continue();
        const response = await page.waitForResponse(module);
        const responseBody = await response.json();
        interceptId = responseBody.id;
    });
}

test.afterEach(async ({ page }) => {
    await page.close();
})