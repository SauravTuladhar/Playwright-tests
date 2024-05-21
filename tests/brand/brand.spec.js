import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';
import { BrandPage } from '../../pageOjects/brand.po';
const testData = require('../../fixtures/loginFixture.json');
const brandTestData = require('../../fixtures/brandFixture.json');
const { requestResponseListeners, createEntity, authenticateUser, deleteEntity, validateEntity } = require('../../utils/helper.spec.js');

let accessToken, interceptId;

test.beforeEach(async ({ page }) => {
    await requestResponseListeners(page);
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
})

test.describe('Brand testcases', () => {
    test('View brand list test', async ({ page }) => {
        const brand = new BrandPage(page);
        await brand.brandView();
    })

    test.skip('Brand search test', async ({ page }) => {
        const brand = new BrandPage(page);
        await brand.brandSearch(brandTestData.brand.brandName, brandTestData.brand.brandName);
    })

    test('Brand Add test', async ({ page, context, request }) => {
        await intercept('**/platform/brand', { context, page });
        const brand = new BrandPage(page);
        await brand.brandAdd(brandTestData.brand.newBrandName, brandTestData.brand.brandContactPerson, brandTestData.brand.brandContactNumber, brandTestData.brand.brandPartnershipCode);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        await deleteEntity(accessToken, `/onboarding/manage/platform/brand/${interceptId}`, { request });
        await validateEntity(accessToken, `/onboarding/manage/platform/brand/${interceptId}`, '404', { request });
    })

    test('Brand Edit test', async ({ page, request }) => {
        const brand = new BrandPage(page);
        const Data = {
            "name": "Test brand",
            "agreements": [],
            "contact_person": "Saurav Tuladhar",
            "contact_number": "609849777665",
            "partnership_code": "PC-0101",
            "allow_card_selection": false,
            "is_active": true
        };
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const entityId = await createEntity(Data, accessToken, '/onboarding/manage/platform/brand', { request });
        await brand.brandEdit();
        await brand.brandView({ timeout: 5000 });
        await deleteEntity(accessToken, `/onboarding/manage/platform/brand/${entityId}`, { request });
        await validateEntity(accessToken, `/onboarding/manage/platform/brand/${entityId}`, '404', { request });
    })

    test('Brand Delete test', async ({ context, page, request }) => {
        await intercept('**/platform/brand', { context, page });
        const brand = new BrandPage(page);
        const Data = {
            "name": "Test brand delete",
            "agreements": [],
            "contact_person": "Saurav Tuladhar",
            "contact_number": "609849777665",
            "partnership_code": "PC-0101",
            "allow_card_selection": false,
            "is_active": true
        };
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const entityId = await createEntity(Data, accessToken, '/onboarding/manage/platform/brand', { request });
        await brand.brandDelete();
        await brand.brandView();
        await validateEntity(accessToken, `/onboarding/manage/platform/brand/${entityId}`, '404', { request });
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