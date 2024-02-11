import { LoginPage } from '../../pageOjects/login.po';
const { test, expect } = require("@playwright/test");
import { CampaignPage } from '../../pageOjects/campaign.po';
const testData = require('../../fixtures/loginFixture.json');
const campaigntestData = require('../../fixtures/campaignFixture.json');
const { authenticateUser, addCampaign } = require('../../utils/helper.spec.js');


let accessToken, apiResponse, campaignName

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
        await campaign.campaignAddFieldValidation();
        await campaign.verifyAddValidationMessage();
    })

    test('Campaign Add and Verify List', async ({ page }) => {
        const campaign = new CampaignPage(page);
        await campaign.campaignView();
        await campaign.isCampaignPage();
        await campaign.campaignAddPage();
        await campaign.iscampaignAddPage();
        await campaign.campaignAddFields();
        await campaign.verifyAddSuccessMessage();
        await campaign.verifyCampaignName(campaigntestData.campaignadd.campaignName)
        await campaign.verifyCampaignStartDate('2024-01-01')
        await campaign.verifyCampaignEndDate('2024-03-20')
    })

    test('Campaign Edit and Verify List', async ({ page, request }) => {
        const campaign = new CampaignPage(page);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const campaignData = {
            "start_date": "2024-01-01",
            "end_date": "2024-03-30",
            "name": "Test Sunita- " + (Math.random() + 1).toString(36).substring(7),
            "reward_value_referral": 44,
            "reward_value_referee": 44,
            "source_code": "Test SC",
            "sms_script": "test sms",
            "social_channel_script": "test social",
            "award_description": "test desc",
            "award_title": "test title",
            "referee_notification_description_with_reward": "reward1",
            "referee_notification_description_without_reward": "reward2",
            "referral_notification_description_with_reward": "reward3",
            "campaign_image": "https://mmp2-sit.s3.amazonaws.com/flow_jira_1707028679774.jpg"
        }
        campaignName = await addCampaign(campaignData, accessToken, { request });
        await campaign.campaignView();
        await campaign.isCampaignPage();
        await campaign.campaignEditPage(campaignName);
        await campaign.iscampaignEditPage();
        await campaign.campaignEditFields();
        await campaign.verifyEditSuccessMessage();
        await campaign.verifyCampaignName(campaigntestData.campaignedit.campaignName)
        await campaign.verifyCampaignStartDate('2024-01-11')
        await campaign.verifyCampaignEndDate('2024-03-20')
        await campaign.campaignDeletePage(campaigntestData.campaignedit.campaignName);
        await campaign.iscamapaignDeletePopup();
        await campaign.campaignDelete();
        await campaign.verifycampaignDeleteMessage();
        await campaign.verifyCampaignListforDelete(campaigntestData.campaignedit.campaignName);
    })
})

test('Campaign Delete and Verify List', async ({ page, request }) => {
    const campaign = new CampaignPage(page);
    accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
    const campaignData = {
        "start_date": "2024-01-19",
        "end_date": "2024-02-04",
        "name": "Test Sunita-" + (Math.random() + 1).toString(36).substring(7),
        "reward_value_referral": 44,
        "reward_value_referee": 44,
        "source_code": "test source code",
        "sms_script": "test sms",
        "social_channel_script": "test social",
        "award_description": "test desc",
        "award_title": "test title",
        "referee_notification_description_with_reward": "reward1",
        "referee_notification_description_without_reward": "reward2",
        "referral_notification_description_with_reward": "reward3",
        "campaign_image": "https://mmp2-sit.s3.amazonaws.com/flow_jira_1707028679774.jpg"
    }
    campaignName = await addCampaign(campaignData, accessToken, { request });
    await campaign.campaignView();
    await campaign.isCampaignPage();
    await campaign.campaignDeletePage(campaignName);
    await campaign.iscamapaignDeletePopup();
    await campaign.campaignDelete();
    await campaign.verifycampaignDeleteMessage();
    await campaign.verifyCampaignListforDelete(campaignName);
})

test('Campaign Search', async ({ page }) => {
    const campaign = new CampaignPage(page);
    await campaign.campaignView();
    await campaign.isCampaignPage();
    await campaign.campaignSearch("Test Sunita 01")
    await campaign.verifySearch("Test Sunita 01")
})

test('Campaign Reset', async ({ page }) => {
    const campaign = new CampaignPage(page);
    await campaign.campaignView();
    await campaign.isCampaignPage();
    const row_count = await campaign.campaignSearch("Test Sunita 01");
    await campaign.verifySearch("Test Sunita 01")
    await campaign.searchReset();
    await campaign.verifyReset(row_count);
})

test.skip('Campaign Add through API', async ({ request, page, context }) => {
    const campaign = new CampaignPage(page);
    accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
    console.log("TOKEN:" + accessToken);
    const campaignData = {
        "start_date": "2024-01-19",
        "end_date": "2024-02-04",
        "name": "Test Sunita-" + (Math.random() + 1),
        "reward_value_referral": 44,
        "reward_value_referee": 44,
        "source_code": "dsf",
        "sms_script": "sdfs",
        "social_channel_script": "sdf",
        "award_description": "sdfsd",
        "award_title": "sdfs",
        "referee_notification_description_with_reward": "dsf",
        "referee_notification_description_without_reward": "sdf",
        "referral_notification_description_with_reward": "sdf",
        "campaign_image": "https://mmp2-sit.s3.amazonaws.com/flow_jira_1707028679774.jpg"
    }
    campaignName = await addCampaign(campaignData, accessToken, { request });
    console.log(campaignName)

});

test.afterEach(async ({ page }) => {
    await page.close();
})
