const { expect } = require("@playwright/test");
const { match } = require("assert");
const { name } = require("../playwright.config");
const campaigntestData = JSON.parse(JSON.stringify(require('../fixtures/campaignFixture.json')));

exports.CampaignPage = class CampaignPage {
    constructor(page) {
        this.page = page;
        this.campaignSubMenu = '(//div[contains(text(),"Campaign")])[1]';
        this.campaignSearchButton = '//button[@id="table-search"]';
        this.campaignSearchResetButton = '//button[@id="table-reset"]';
        this.campaignAddButton = '//span[contains(text(),"Add")]';
        this.saveButton = '//button[@id="campaign-save"]'
        this.cancelButton = '//a[@id="campaign-cancel"]'
        this.campaignEditButton = 'a'
        this.campaignDeleteButton = 'button'
        this.campaignDeleteConfirm = '//button[@id="popup-save"]'

        this.campaignSearchListValidation = '(//div[contains(text(),"Campaign")])[2]//following::span[2]';
        this.alert = '//div[@role="alert"]'
        this.campaignValidation = '(//*[@class="text-red-600"])[1]'
        this.referralValidation = '(//*[@class="text-red-600"])[4]'
        this.refereeValidation = '(//*[@class="text-red-600"])[5]'
        this.sourceCodeValidation = '(//*[@class="text-red-600"])[6]'
        this.smsValidation = '(//*[@class="text-red-600"])[7]'
        this.socialChannelValidation = '(//*[@class="text-red-600"])[8]'
        this.awardDescValidation = '(//*[@class="text-red-600"])[9]'
        this.awardTitleValidation = '(//*[@class="text-red-600"])[10]'
        this.refereewithrewardValidation = '(//*[@class="text-red-600"])[11]'
        this.refereewithoutValidation = '(//*[@class="text-red-600"])[12]'
        this.referralwithValidation = '(//*[@class="text-red-600"])[13]'
        this.imageValidation = '(//*[@class="text-red-600 mt-20"])'
        this.campaignEditMatch = '//tbody//tr//td//span'

        this.campaignListView = '(//div[contains(text(),"Campaign")])[2]';
        this.campaignCreateView = '(//div[contains(text(),"Campaign: Create")])'
        this.campaignEditView = '(//div[contains(text(),"Campaign: Edit")])'
        this.campaignDeleteView = '//h2[contains(text(),"Are you sure you want to delete?")]'

        this.campaignSearchField = '//input[@placeholder="Search ..."]';
        this.campaignNameField = "//input[@id='campaign-name']"
        this.campaignStartDateField = '//div[@id="campaign-start-date"]//input'
        this.previousMonth='//button[@aria-label="Previous month"]'
        this.selectStartDate = '//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()="1"]'
        this.campaignEndDateField = '//div[@id="campaign-end-date"]//input'
        this.nextMonth='//button[@aria-label="Next month"]'
        this.selectEndDate = '//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()="20"]'
        this.updateStartDate = '//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()="11"]'
        this.updateEndDate = '//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()="15"]';

     
        this.referralField = "//input[@id='campaign-reward-value-referral']"
        this.refereeField = "//input[@id='campaign-reward-value-referee']"
        this.sourceCodeField = "//textarea[@id='campaign-source-code']"
        this.smsField = "//textarea[@id='campaign-sms-script']"
        this.socialChannelField = "//textarea[@id='campaign-social-channel-script']"
        this.awardDescriptionField = "//input[@id='campaign-award-description']"
        this.awardTitleField = "//input[@id='campaign-award-title']"
        this.refereeWithRewardField = "//input[@id='campaign-referee-notification-description-with-reward']"
        this.refereeWithoutRewardField = "//input[@id='campaign-referee-notification-description-without-reward']"
        this.referralWithRewardField = "//input[@id='campaign-referral-notification-description-with-reward']"
        this.campaignImageUpload = '//div[@id="campaign-image"]//div//label//span'
        this.campaignImageReupload = '//div[@id="campaign-image"]//div//label//img'

        this.campaignTable = '(//div[contains(text(),"Campaign")])[2]//following::table'
        this.campaignRow = 'tbody tr'
        this.campaignColumn = 'thead tr th'
        this.tableData = 'td'
    }

    async campaignSearch(campaignSearch) {
        await this.page.waitForTimeout(5000)
        const table = await this.page.locator(this.campaignTable)
        const rows = await table.locator(this.campaignRow)
        const rowcount = await rows.count()
        await this.page.locator(this.campaignSearchField).fill(campaignSearch);
        await this.page.locator(this.campaignSearchButton).click();
        return await rowcount
    }

    async verifySearch(campaignSearch) {
        const campaignSearchList = await this.page.locator(this.campaignSearchListValidation);
        await expect(this.page.locator(this.campaignSearchField)).toHaveValue(campaignSearch)
        await expect(campaignSearchList).toHaveText(campaignSearch);
    }

    async searchReset() {
        await this.page.locator(this.campaignSearchResetButton).click();
    }

    async verifyReset(beforeReset) {
        await this.page.waitForTimeout(5000)
        const table = await this.page.locator(this.campaignTable)
        const rows = await table.locator(this.campaignRow)
        await expect(this.page.locator(this.campaignSearchField)).toHaveValue('');
        await expect(await rows.count()).toBe(beforeReset);
    }

    async campaignView() {
        await this.page.locator(this.campaignSubMenu).click();
    }

    async isCampaignPage() {
        const campaignList = await this.page.locator(this.campaignListView);
        await expect(campaignList).toBeVisible();
    }

    async campaignAddPage() {
        await this.page.locator(this.campaignAddButton).click();
    }

    async iscampaignAddPage() {
        const campaignCreate = await this.page.locator(this.campaignCreateView);
        await expect(campaignCreate).toBeVisible();
    }

    async campaignAddFields() {
        await this.page.locator(this.campaignNameField).fill(campaigntestData.campaignadd.campaignName);
        await this.page.locator(this.campaignStartDateField).click();
        await this.page.locator(this.previousMonth).click();
        await this.page.locator(this.selectStartDate).click();
        await this.page.locator(this.campaignEndDateField).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.nextMonth).click();
        await this.page.locator(this.selectEndDate).click();
        await this.page.locator(this.referralField).fill(campaigntestData.campaignadd.referral);
        await this.page.locator(this.refereeField).fill(campaigntestData.campaignadd.referee);
        await this.page.locator(this.sourceCodeField).fill(campaigntestData.campaignadd.sourceCode);
        await this.page.locator(this.smsField).fill(campaigntestData.campaignadd.sms);
        await this.page.locator(this.socialChannelField).fill(campaigntestData.campaignadd.socialChannel);
        await this.page.locator(this.awardDescriptionField).fill(campaigntestData.campaignadd.awardDescription);
        await this.page.locator(this.awardTitleField).fill(campaigntestData.campaignadd.awardTitle);
        await this.page.locator(this.refereeWithRewardField).fill(campaigntestData.campaignadd.refereeWithReward);
        await this.page.locator(this.refereeWithoutRewardField).fill(campaigntestData.campaignadd.refereeWithoutReward);
        await this.page.locator(this.referralWithRewardField).fill(campaigntestData.campaignadd.referralWithReward);
        await this.page.locator(this.campaignImageUpload).click();
        await this.page.locator(this.campaignImageUpload).setInputFiles(campaigntestData.campaignadd.campaignImage);
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.saveButton).click();
        await this.page.waitForTimeout(2000);
    }

    async verifyAddSuccessMessage() {
        const successMessage = await this.page.locator(this.alert);
        await expect(successMessage).toContainText(campaigntestData.campaignadd.campaignSavedMessage)
    }

    async verifyCampaignName(campaignName) {
        const table = await this.page.locator(this.campaignTable)
        const rows = await table.locator(this.campaignRow)
        const col = await table.locator(this.campaignColumn)
        let nameMatch = ''
        
        for (let i = 0; i < await rows.count(); i++) {
            const row = await rows.nth(i);
            const tds = row.locator('td');
                nameMatch = await tds.nth(0).textContent();
            
                if (nameMatch == campaignName) {
                    break;
                }
            }
        
        await expect(nameMatch).toBe(campaignName)

    }

    async verifyCampaignStartDate() {
        const table = await this.page.locator(this.campaignTable)
        const rows = await table.locator(this.campaignRow)
        const col = await table.locator(this.campaignColumn)
        let stardDate = ''
        
        for (let i = 0; i < await rows.count(); i++) {
            const row = await rows.nth(i);
            const tds = row.locator('td');
            stardDate = await tds.nth(1).textContent();
            
                if (stardDate == '2024-01-11') {
                    break;
                }
            }
        
        await expect(stardDate).toEqual('2024-01-11')
    }

    async verifyCampaignEndDate() {
        const table = await this.page.locator(this.campaignTable)
        const rows = await table.locator(this.campaignRow)
        const col = await table.locator(this.campaignColumn)
        let endDate = ''
        
        for (let i = 0; i < await rows.count(); i++) {
            const row = await rows.nth(i);
            const tds = row.locator('td');
            endDate = await tds.nth(2).textContent();
            
                if (endDate == '2024-03-20') {
                    break;
                }
            }
        
        await expect(endDate).toEqual('2024-03-20')
    }

    async campaignAddFieldValidation() {
        await this.page.locator(this.saveButton).click();
    }

    async verifyAddValidationMessage() {
        const name = await this.page.locator(this.campaignValidation)
        await expect(name).toContainText('Campaign Name is required')
        const referral = await this.page.locator(this.referralValidation)
        await expect(referral).toContainText('Reward Value Refferal (RM) is required')
        const referee = await this.page.locator(this.refereeValidation)
        await expect(referee).toContainText('Reward Value Referee (RM) is required')
        const sourcecode = await this.page.locator(this.sourceCodeValidation)
        await expect(sourcecode).toContainText('Source Code is required')
        const smsscript = await this.page.locator(this.smsValidation)
        await expect(smsscript).toContainText('SMS Script is required')
        const socialchannel = await this.page.locator(this.socialChannelValidation)
        await expect(socialchannel).toContainText('Social Channel Script is required')
        const awarddesc = await this.page.locator(this.awardDescValidation)
        await expect(awarddesc).toContainText('Award Description is required')
        const awardtitle = await this.page.locator(this.awardTitleValidation)
        await expect(awardtitle).toContainText('Award Title is required')
        const refereewithreward = await this.page.locator(this.refereewithrewardValidation)
        await expect(refereewithreward).toContainText('Referee Notification Description (With Reward) is required')
        const refereewithoutreward = await this.page.locator(this.refereewithoutValidation)
        await expect(refereewithoutreward).toContainText('Referee Notification Description (Without Reward) is required')
        const referraleewithoutreward = await this.page.locator(this.referralwithValidation)
        await expect(referraleewithoutreward).toContainText('Referral Notification Description (With Reward) is required')
        const image = await this.page.locator(this.imageValidation)
        await expect(image).toContainText('Campaign Image is required')
    }

    async campaignEditPage(campaignName) {
        await this.page.locator(this.campaignSubMenu).click();
        await this.page.waitForTimeout(5000)
        const table = await this.page.locator(this.campaignTable)
        const col = await table.locator(this.campaignColumn)
        const rows = await table.locator(this.campaignRow)
        const matchedRow = rows.filter({
            has: this.page.locator(this.tableData),
            hasText: campaignName
        })
        await this.page.waitForTimeout(2000)
        await matchedRow.locator(this.campaignEditButton).click()
    }

    async iscampaignEditPage() {
        const campaignupdate = await this.page.locator(this.campaignEditView);
        await expect(campaignupdate).toBeVisible();
    }

    async campaignEditFields() {
        await this.page.locator(this.campaignNameField).fill(campaigntestData.campaignedit.campaignName);
        await this.page.locator(this.campaignStartDateField).click()
        await this.page.locator(this.updateStartDate).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.campaignEndDateField).click()
        await this.page.locator(this.updateEndDate).click();
        await this.page.locator(this.referralField).fill(campaigntestData.campaignedit.referral);
        await this.page.locator(this.refereeField).fill(campaigntestData.campaignedit.referee);
        await this.page.locator(this.sourceCodeField).fill(campaigntestData.campaignedit.sourceCode);
        await this.page.locator(this.smsField).fill(campaigntestData.campaignedit.sms);
        await this.page.locator(this.socialChannelField).fill(campaigntestData.campaignedit.socialChannel);
        await this.page.locator(this.awardDescriptionField).fill(campaigntestData.campaignedit.awardDescription);
        await this.page.locator(this.awardTitleField).fill(campaigntestData.campaignedit.awardTitle);
        await this.page.locator(this.refereeWithRewardField).fill(campaigntestData.campaignedit.refereeWithReward);
        await this.page.locator(this.refereeWithoutRewardField).fill(campaigntestData.campaignedit.refereeWithoutReward);
        await this.page.locator(this.referralWithRewardField).fill(campaigntestData.campaignedit.referralWithReward);
        await this.page.locator(this.campaignImageReupload).click();
        await this.page.locator(this.campaignImageReupload).setInputFiles(campaigntestData.campaignadd.campaignImage);
        await this.page.locator(this.saveButton).click();
        await this.page.waitForTimeout(2000);
    }

    async verifyEditSuccessMessage(savedMsg) {
        const successMessage = await this.page.locator(this.alert);

        await expect(successMessage).toContainText(campaigntestData.campaignedit.campaignUpdatedMessage)
    }

    async campaignDeletePage(campaignSearch) {
        await this.page.locator(this.campaignSubMenu).click();
        await this.page.waitForTimeout(5000)
        const table = await this.page.locator(this.campaignTable)
        const rows = await table.locator(this.campaignRow)
        const col = await table.locator(this.campaignColumn)
        const matchedRow = rows.filter({
            has: this.page.locator(this.tableData),
            hasText: campaignSearch
        })
        await this.page.waitForTimeout(2000);
        await matchedRow.locator(this.campaignDeleteButton).click();
    }

    async iscamapaignDeletePopup() {
        const campaigndelete = await this.page.locator(this.campaignDeleteView);
        await expect(campaigndelete).toBeVisible();
    }

    async campaignDelete() {
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.campaignDeleteConfirm).click();
    }

    async verifycampaignDeleteMessage() {
        const successMessage = await this.page.locator(this.alert);
        await expect(successMessage).toContainText(campaigntestData.campaignadd.campaignDeletedMessage)
    }

    async verifyCampaignListforDelete(campaignName) {
        const table = await this.page.locator(this.campaignTable)
        const rows = await table.locator(this.campaignRow)
        const col = await table.locator(this.campaignColumn)
        let nameMatch = ''
        for (let i = 0; i < await rows.count(); i++) {
            const row = await rows.nth(i);
            const tds = row.locator('td');
            nameMatch = await tds.nth(0).textContent();
            if (nameMatch == campaignName) {
                break;
            }
        }
        await expect(nameMatch).not.toBe(campaignName)

    }

}





