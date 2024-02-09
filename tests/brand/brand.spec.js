import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';
import { BrandPage } from '../../pageOjects/brand.po';
const testData = require('../../fixtures/loginFixture.json');
const brandTestData = require('../../fixtures/brandFixture.json');


test.beforeEach(async ({ page }) => {
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

    test('Brand search test', async ({ page }) => {
        const brand = new BrandPage(page);
        await brand.brandSearch(brandTestData.brand.brandName, brandTestData.brand.brandName);
    })

    test('Brand Add test', async ({ page }) => {
        const brand = new BrandPage(page);
        await brand.brandAdd(brandTestData.brand.newBrandName, brandTestData.brand.brandContactPerson, brandTestData.brand.brandContactNumber, brandTestData.brand.brandPartnershipCode);
    })
})

test.afterEach(async ({ page }) => {
    await page.close();
})