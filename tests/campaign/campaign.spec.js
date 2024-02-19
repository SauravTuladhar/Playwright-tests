import { LoginPage } from '../../pageOjects/login.po';
const { test } = require("@playwright/test");
import { CampaignPage } from '../../pageOjects/campaign.po';
const testData = require('../../fixtures/loginFixture.json');
const campaigntestData = require('../../fixtures/campaignFixture.json');
const { authenticateUser, addCampaign, getCampaignName, getUpdatedCampaignName, createEntity, deleteEntity, validateEntity } = require('../../utils/helper.spec.js');


let accessToken, apiResponse, campaignName, title, interceptId

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
        await intercept('**/marketing/campaign', { context, page });
        await campaign.campaignView();
        await campaign.isCampaignPage();
        await campaign.campaignAddPage();
        await campaign.iscampaignAddPage();
        const sdateValue=await campaign.campaignAddStartDateField();
        const edateValue=await campaign.campaignAddEndDateField();
        await campaign.campaignAddFields(campaigntestData.campaignadd.campaignName,campaigntestData.campaignadd.referral,campaigntestData.campaignadd.referee,campaigntestData.campaignadd.sourceCode,campaigntestData.campaignadd.sms,campaigntestData.campaignadd.socialChannel,campaigntestData.campaignadd.awardDescription,campaigntestData.campaignadd.awardTitle,campaigntestData.campaignadd.referralWithReward,campaigntestData.campaignadd.refereeWithoutReward,campaigntestData.campaignadd.refereeWithReward,campaigntestData.campaignadd.campaignImage);
        await campaign.campaignSave();
        await campaign.verifyAddSuccessMessage();
        await campaign.verifyCampaignDataTable(campaigntestData.campaignadd.campaignName,sdateValue,edateValue)
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        await deleteEntity(accessToken, `/notification/manage/marketing/campaign/${interceptId}`, { request });
        await validateEntity(accessToken, `/notification/manage/marketing/campaign/${interceptId}`, '404', { request });
    })
    test('Campaign Edit and Verify List', async ({ page, request }) => {
        const campaign = new CampaignPage(page);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        title = await getCampaignName();
        const campaignData = {
            "start_date": "2024-01-05",
            "end_date": "2024-03-20",
            "name": title,
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
        const entityId = await createEntity(campaignData, accessToken, '/notification/manage/marketing/campaign', { request });
        await campaign.campaignView();
        await campaign.isCampaignPage();
        await campaign.campaignEditPage(title);
        await campaign.iscampaignEditPage();
        const sdatevalue=await campaign.campaignUpdateStartDateField();
        const edatevalue=await campaign.campaignUpdateEndDateField();
        const name=await getUpdatedCampaignName()
        await campaign.campaignAddFields(name,campaigntestData.campaignedit.referral,campaigntestData.campaignedit.referee,campaigntestData.campaignedit.sourceCode,campaigntestData.campaignedit.sms,campaigntestData.campaignedit.socialChannel,campaigntestData.campaignedit.awardDescription,campaigntestData.campaignedit.awardTitle,campaigntestData.campaignedit.referralWithReward,campaigntestData.campaignedit.refereeWithoutReward,campaigntestData.campaignedit.refereeWithReward,campaigntestData.campaignedit.campaignImage);
        await campaign.campaignSave();
        await campaign.verifyEditSuccessMessage();
        await campaign.verifyCampaignDataTable(name,sdatevalue,edatevalue)
        await deleteEntity(accessToken, `/notification/manage/marketing/campaign/${entityId}`, { request });
        await validateEntity(accessToken, `/notification/manage/marketing/campaign/${entityId}`, '404', { request });
    })
})

test('Campaign Delete and Verify List', async ({ page, request }) => {
    const campaign = new CampaignPage(page);
    accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
    title = await getCampaignName();
    const startDate=campaigntestData.campaignadd.startDate
    const endDate=campaigntestData.campaignadd.endDate
   
    const campaignData = {
        "start_date": "2024-01-05",
        "end_date":  "2024-03-21",
        "name": "Test Sunita-01",
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
     await createEntity(campaignData, accessToken, '/notification/manage/marketing/campaign', { request });
    await campaign.campaignView();
    await campaign.isCampaignPage();
    const campaigndata  = await campaign.verifyCampaignDataTable("Test Sunita-01","01-052024", "03-21-2024");
    await campaign.campaignDeletePage(campaigndata);
    await campaign.iscamapaignDeletePopup();
    await campaign.campaignDelete();
    await campaign.verifycampaignDeleteMessage();
    await campaign.verifyCampaignListforDelete(title,startDate,endDate);
})

test.skip('Campaign Search', async ({ page }) => {
    const campaign = new CampaignPage(page);
    await campaign.campaignView();
    await campaign.isCampaignPage();
    await campaign.campaignSearch("Test Sunita 01")
    await campaign.verifySearch("Test Sunita 01")
})

test.skip('Campaign Reset', async ({ page }) => {
    const campaign = new CampaignPage(page);
    await campaign.campaignView();
    await campaign.isCampaignPage();
    const row_count = await campaign.campaignSearch("Test Sunita 01");
    await campaign.verifySearch("Test Sunita 01")
    await campaign.searchReset();
    await campaign.verifyReset(row_count);
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