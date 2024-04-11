import { LoginPage } from '../../pageOjects/login.po';
const { test } = require("@playwright/test");
import { CampaignPage } from '../../pageOjects/campaign.po';
const testData = require('../../fixtures/loginFixture.json');
const campaigntestData = require('../../fixtures/campaignFixture.json');
const { authenticateUser, addCampaign, getCampaignName, getUpdatedCampaignName, createEntity, deleteEntity, validateEntity } = require('../../utils/helper.spec.js');


let accessToken, apiResponse, campaignName, title, interceptId, stDate, endDate

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();

})

test.describe('Campaign testcases', () => {
    test('View campaign list', async ({ page }) => {
        const campaign = new CampaignPage(page);
        await campaign.campaignView();
        await campaign.isCampaignPage();
    })

    test('Campaign Add (Field Validation)', async ({ page }) => {
        const campaign = new CampaignPage(page);
        await campaign.campaignView();
        await campaign.isCampaignPage();
        await campaign.campaignAddPage();
        await campaign.campaignSave();
        await campaign.verifyAddValidationMessage();
    })

    test('Campaign Add and Verify List', async ({ page, context, request }) => {
        const campaign = new CampaignPage(page);
        await intercept('**/referral-campaign', { context, page });
        await campaign.campaignView();
        await campaign.isCampaignPage();
        await campaign.campaignAddPage();
        await campaign.iscampaignAddPage();
        const sdateValue = await campaign.campaignAddStartDateField();
        const edateValue = await campaign.campaignAddEndDateField();
        await campaign.campaignAddFields(campaigntestData.campaignadd.campaignName, campaigntestData.campaignadd.referral, campaigntestData.campaignadd.referee, campaigntestData.campaignadd.cardType, campaigntestData.campaignadd.sourceCode, campaigntestData.campaignadd.sms, campaigntestData.campaignadd.socialChannel, campaigntestData.campaignadd.awardDescription, campaigntestData.campaignadd.awardTitle, campaigntestData.campaignadd.refereeWithReward, campaigntestData.campaignadd.referralWithReward, campaigntestData.campaignadd.referralWithoutReward, campaigntestData.campaignadd.campaignImage);
        await campaign.campaignSave();
        await campaign.verifyAddSuccessMessage();
        await campaign.verifyCampaignDataTable(campaigntestData.campaignadd.campaignName, sdateValue, edateValue)
        const accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        await deleteEntity(accessToken, `/onboarding/manage/referral-campaign/${interceptId}`, { request });
        await validateEntity(accessToken, `/onboarding/manage/referral-campaign/${interceptId}`, '404', { request });
    })
    test('Campaign Edit and Verify List', async ({ page, request }) => {
        const campaign = new CampaignPage(page);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        title = await getCampaignName();
        const campaignData = {
            "start_date": "2024-04-24T11:19:00",
            "end_date": "2024-04-30T11:19:00",
            "name": title,
            "reward_value_referrer": 44,
            "reward_value_referee": 44,
            "card_type": "CMSTON",
            "source_code_ids": [43336],
            "sms_script": "test sms",
            "social_channel_script": "test social",
            "award_description": "test desc",
            "award_title": "test title",
            "referee_notification_description_with_reward": "2",
            "referral_notification_description_without_reward": "3",
            "referral_notification_description_with_reward": "4",
            "campaign_image": "https://d3pr0ddcj2iamd.cloudfront.net/Screenshot_2024-01-17_at_20.39.04_1712734134973.png",
            "maximum_referral_allowed": null,
            "terms_and_condition": null
        }
        const entityId = await createEntity(campaignData, accessToken, '/onboarding/manage/referral-campaign', { request });
        await campaign.campaignView();
        await campaign.isCampaignPage();
        await campaign.campaignEditPage(title);
        await campaign.iscampaignEditPage();
        const sdatevalue = await campaign.campaignUpdateStartDateField();
        const edatevalue = await campaign.campaignUpdateEndDateField();
        const name = await getUpdatedCampaignName()
        await campaign.campaignAddFields(name, campaigntestData.campaignadd.referral, campaigntestData.campaignadd.referee, campaigntestData.campaignadd.cardType, campaigntestData.campaignadd.sourceCode, campaigntestData.campaignadd.sms, campaigntestData.campaignadd.socialChannel, campaigntestData.campaignadd.awardDescription, campaigntestData.campaignadd.awardTitle, campaigntestData.campaignadd.refereeWithReward, campaigntestData.campaignadd.referralWithReward, campaigntestData.campaignadd.referralWithoutReward, campaigntestData.campaignadd.campaignImage);
        await campaign.campaignSave();
        await campaign.verifyEditSuccessMessage();
        await campaign.verifyCampaignDataTable(name, sdatevalue, edatevalue)
        await deleteEntity(accessToken, `/onboarding/manage/referral-campaign/${entityId}`, { request });
        await validateEntity(accessToken, `/onboarding/manage/referral-campaign/${entityId}`, '404', { request });
    })
})

test('Campaign Delete and Verify List', async ({ page, request }) => {
    const campaign = new CampaignPage(page);
    accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
    title = await getCampaignName();
    const campaignData = {
        "start_date": "2024-04-24T11:19:00",
        "end_date": "2024-04-30T11:19:00",
        "name": title,
        "reward_value_referrer": 44,
        "reward_value_referee": 44,
        "card_type": "CMSTON",
        "source_code_ids": [43336],
        "sms_script": "test sms",
        "social_channel_script": "test social",
        "award_description": "test desc",
        "award_title": "test title",
        "referee_notification_description_with_reward": "2",
        "referral_notification_description_without_reward": "3",
        "referral_notification_description_with_reward": "4",
        "campaign_image": "https://d3pr0ddcj2iamd.cloudfront.net/Screenshot_2024-01-17_at_20.39.04_1712734134973.png",
        "maximum_referral_allowed": null,
        "terms_and_condition": null
    }
    await createEntity(campaignData, accessToken, '/onboarding/manage/referral-campaign', { request });
    await campaign.campaignView();
    await campaign.isCampaignPage();
    const stDate = campaignData.start_date.slice(0, -9);
    const enDate = campaignData.end_date.slice(0, -9);
    const campaigndata = await campaign.verifyCampaignDataTable(title, stDate, enDate);
    await campaign.campaignDeletePage(campaigndata);
    await campaign.iscamapaignDeletePopup();
    await campaign.campaignDelete();
    await campaign.verifycampaignDeleteMessage();
    await campaign.verifyCampaignListforDelete(title, stDate, endDate);
})

test('Invalid Campaign Search', async ({ page }) => {
    const campaign = new CampaignPage(page);
    title = await getCampaignName();
    await campaign.campaignView();
    await campaign.isCampaignPage();
    await campaign.campaignSearch(title)
    await campaign.verifyInvalidSearchResult(title)
})

test('Valid Campaign Search', async ({ page, request }) => {
    const campaign = new CampaignPage(page);
    accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
    title = await getCampaignName();
    const campaignData = {
        "start_date": "2024-04-24T11:19:00",
        "end_date": "2024-04-30T11:19:00",
        "name": title,
        "reward_value_referrer": 44,
        "reward_value_referee": 44,
        "card_type": "CMSTON",
        "source_code_ids": [43336],
        "sms_script": "test sms",
        "social_channel_script": "test social",
        "award_description": "test desc",
        "award_title": "test title",
        "referee_notification_description_with_reward": "2",
        "referral_notification_description_without_reward": "3",
        "referral_notification_description_with_reward": "4",
        "campaign_image": "https://d3pr0ddcj2iamd.cloudfront.net/Screenshot_2024-01-17_at_20.39.04_1712734134973.png",
        "maximum_referral_allowed": null,
        "terms_and_condition": null
    }
    await createEntity(campaignData, accessToken, '/onboarding/manage/referral-campaign', { request });
    await campaign.campaignView();
    await campaign.isCampaignPage();
    await campaign.campaignSearch(title)
    const stDate = campaignData.start_date.slice(0, -9);
    const enDate = campaignData.end_date.slice(0, -9);
    const campaigndata = await campaign.verifyCampaignDataTable(title, stDate, enDate);
    await campaign.verifyValidSearchResult(title)
    await campaign.campaignDeletePage(campaigndata);
    await campaign.iscamapaignDeletePopup();
    await campaign.campaignDelete();
    await campaign.verifycampaignDeleteMessage();
    await campaign.verifyCampaignListforDelete(title, stDate, endDate);
})

test('Campaign Reset', async ({ page, request }) => {
    const campaign = new CampaignPage(page);
    accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
    title = await getCampaignName();
    const campaignData = {
        "start_date": "2024-04-24T11:19:00",
        "end_date": "2024-04-30T11:19:00",
        "name": title,
        "reward_value_referrer": 44,
        "reward_value_referee": 44,
        "card_type": "CMSTON",
        "source_code_ids": [43336],
        "sms_script": "test sms",
        "social_channel_script": "test social",
        "award_description": "test desc",
        "award_title": "test title",
        "referee_notification_description_with_reward": "2",
        "referral_notification_description_without_reward": "3",
        "referral_notification_description_with_reward": "4",
        "campaign_image": "https://d3pr0ddcj2iamd.cloudfront.net/Screenshot_2024-01-17_at_20.39.04_1712734134973.png",
        "maximum_referral_allowed": null,
        "terms_and_condition": null
    }
    await createEntity(campaignData, accessToken, '/onboarding/manage/referral-campaign', { request });
    await campaign.campaignView();
    await campaign.isCampaignPage();
    const stDate = campaignData.start_date.slice(0, -9);
    const enDate = campaignData.end_date.slice(0, -9);
    const campaigndata=await campaign.verifyCampaignDataTable(title, stDate, enDate);
    const row_count = await campaign.campaignSearch(title);
    await campaign.searchReset();
    await campaign.verifyReset(row_count); 
    await campaign.campaignDeletePage(campaigndata);
    await campaign.iscamapaignDeletePopup();
    await campaign.campaignDelete();
    await campaign.verifycampaignDeleteMessage();
    await campaign.verifyCampaignListforDelete(title, stDate, endDate);
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