import { test } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';
import { JompayPage } from '../../pageOjects/jompay.po';
const testData = require('../../fixtures/loginFixture.json');
const jompayTestData = require('../../fixtures/jompayFixture.json');
const { requestResponseListeners, createEntity, authenticateUser, deleteEntity, validateEntity, updateEntity } = require('../../utils/helper.spec.js');

let accessToken, interceptId;

test.beforeEach(async ({ page }) => {
    //await requestResponseListeners(page);
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
})

test.describe('Jompay testcases', () => {
    test('Update risk rule configuration', async ({ page }) => {
        const jompay = new JompayPage(page);
        await jompay.updateRiskRuleConfig(jompayTestData.jompay.dailyThresholdAmount, jompayTestData.jompay.perTxnAmount, jompayTestData.jompay.dailyTxnCount, jompayTestData.jompay.dailyThresholdAmountOverall);
        await page.reload();
        await jompay.verifyRiskRuleConfig(jompayTestData.jompay.dailyThresholdAmount, jompayTestData.jompay.perTxnAmount, jompayTestData.jompay.dailyTxnCount, jompayTestData.jompay.dailyThresholdAmountOverall);
    })

    test('Approve jompay pending transaction', async ({ page, context, request }) => {
        const jompay = new JompayPage(page);
        const Data = {
            "phone_number": "609849777665",
            "amount": "100",
            "jompay_bank_code": "123",
            "jompay_transaction_id": "qwertyu12323456",
            "status": "Pending"
        };
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        await createEntity(Data, accessToken, '/transaction/manage/create-jompay-instance/', { request });
        await jompay.viewPendingTransaction({ timeout: 2000 });
        await jompay.approvePendingTransaction(jompayTestData.jompay.remarks, { timeout: 2000 });
        await jompay.verifyApprovedTransaction();
    })

    test('Reject jompay pending transaction', async ({ page, request }) => {
        const jompay = new JompayPage(page);
        const Data = {
            "phone_number": "609849777665",
            "amount": "100",
            "jompay_bank_code": "123",
            "jompay_transaction_id": "qwertyu123234a",
            "status": "Pending"
        };
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        await createEntity(Data, accessToken, '/transaction/manage/create-jompay-instance/', { request });
        await jompay.viewPendingTransaction({ timeout: 2000 });
        await jompay.rejectPendingTransaction(jompayTestData.jompay.remarks, { timeout: 2000 });
        await jompay.verifyRejectedTransaction();
    })

    test('Add jompay customer whitelist', async ({ context, page, request }) => {
        await intercept('**/jompay/whitelist', { context, page });
        const jompay = new JompayPage(page);
        await jompay.addJompayWhitelistCustomer(jompayTestData.jompay.remarks);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        await deleteEntity(accessToken, `/transaction/manage/jompay/whitelist/${interceptId}`, { request });
        await validateEntity(accessToken, `/transaction/manage/jompay/whitelist/${interceptId}`, '404', { request });
    })

    test('Edit jompay customer whitelist', async ({ page, request }) => {
        const Data = { "bank_number": ["123"], "phone_number": 609849777665, "name": "SAURAV TULADHAR", "nationality": "MALAYSIA", "id_number": "950630777665", "company_name": "TEST COMP", "customer_id": "96f83f88-4ce3-473c-b6d2-041de932f42a", "remarks": "Automation Jompay remarks" };
        const jompay = new JompayPage(page);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const entityId = await createEntity(Data, accessToken, '/transaction/manage/jompay/whitelist', { request });
        await jompay.editJompayWhitelistCustomer(jompayTestData.jompay.remarks);
        await deleteEntity(accessToken, `/transaction/manage/jompay/whitelist/${entityId}`, { request });
        await validateEntity(accessToken, `/transaction/manage/jompay/whitelist/${entityId}`, '404', { request });
    })

    test('Delete jompay customer whitelist', async ({ page, request }) => {
        const Data = { "bank_number": ["123"], "phone_number": 609849777665, "name": "SAURAV TULADHAR", "nationality": "MALAYSIA", "id_number": "950630777665", "company_name": "TEST COMP", "customer_id": "96f83f88-4ce3-473c-b6d2-041de932f42a", "remarks": "Automation Jompay remarks" };
        const jompay = new JompayPage(page);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const entityId = await createEntity(Data, accessToken, '/transaction/manage/jompay/whitelist', { request });
        await jompay.deleteJompayWhitelistCustomer();
        await validateEntity(accessToken, `/transaction/manage/jompay/whitelist/${entityId}`, '404', { request });
    })

    test('Refund jompay rejected transaction', async ({ page, request }) => {
        //const Data = { "bank_number": ["123"], "phone_number": 609849777665, "name": "SAURAV TULADHAR", "nationality": "MALAYSIA", "id_number": "950630777665", "company_name": "TEST COMP", "customer_id": "96f83f88-4ce3-473c-b6d2-041de932f42a", "remarks": "Automation Jompay remarks" };
        const jompay = new JompayPage(page);
        //accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        //const entityId = await createEntity(Data, accessToken, '/transaction/manage/jompay/whitelist', { request });
        await jompay.refundJompayWhitelistCustomer();
        //await validateEntity(accessToken, `/transaction/manage/jompay/whitelist/${entityId}`, '404', { request });
    })

    test('Manually credit jompay rejected transaction', async ({ page, request }) => {
        //const Data = { "bank_number": ["123"], "phone_number": 609849777665, "name": "SAURAV TULADHAR", "nationality": "MALAYSIA", "id_number": "950630777665", "company_name": "TEST COMP", "customer_id": "96f83f88-4ce3-473c-b6d2-041de932f42a", "remarks": "Automation Jompay remarks" };
        const jompay = new JompayPage(page);
        //accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        //const entityId = await createEntity(Data, accessToken, '/transaction/manage/jompay/whitelist', { request });
        await jompay.refundJompayWhitelistCustomer();
        //await validateEntity(accessToken, `/transaction/manage/jompay/whitelist/${entityId}`, '404', { request });
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