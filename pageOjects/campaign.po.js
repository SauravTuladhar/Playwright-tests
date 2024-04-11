const { expect } = require("@playwright/test");
const { match } = require("assert");
const { name } = require("../playwright.config");
const campaigntestData = JSON.parse(JSON.stringify(require('../fixtures/campaignFixture.json')));
import dayjs from 'dayjs';

let csdate = campaigntestData.campaignadd.startDate, cedate = campaigntestData.campaignadd.endDate, updatecsdate = campaigntestData.campaignedit.updateStartDate, updatecedate = campaigntestData.campaignedit.updateEndDate

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
        this.campaignSDateValidation = '(//*[@class="text-red-600"])[2]'
        this.campaignEDateValidation = '(//*[@class="text-red-600"])[3]'
        this.referralValidation = '(//*[@class="text-red-600"])[4]'
        this.refereeValidation = '(//*[@class="text-red-600"])[5]'
        this.cardType = '(//*[@class="text-red-600"])[6]'
        this.smsValidation = '(//*[@class="text-red-600"])[8]'
        this.socialChannelValidation = '(//*[@class="text-red-600"])[9]'
        this.awardDescValidation = '(//*[@class="text-red-600"])[10]'
        this.awardTitleValidation = '(//*[@class="text-red-600"])[11]'
        this.refereewithrewardValidation = '(//*[@class="text-red-600"])[12]'
        this.referralewithrewardValidation = '(//*[@class="text-red-600"])[13]'
        this.referralwithoutrewardValidation = '(//*[@class="text-red-600"])[14]'
        this.imageValidation = '(//*[@class="text-red-600 mt-20"])'
        this.campaignEditMatch = '//tbody//tr//td//span'

        this.campaignListView = '(//div[contains(text(),"Campaign")])[2]';
        this.campaignCreateView = '(//div[contains(text(),"Campaign: Create")])'
        this.campaignEditView = '(//div[contains(text(),"Campaign: Edit")])'
        this.campaignDeleteView = '//h2[contains(text(),"Are you sure you want to delete?")]'
        this.campaignSearchField = '//input[@placeholder="Search ..."]';
        this.campaignNameField = "//input[@id='campaign-name']"
        this.campaignStartDateField = '//div[@id="campaign-start-date"]//input'
        this.previousMonth = '//button[@aria-label="Previous month"]'
        this.selectStartDate = `//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()=${csdate}]`
        this.campaignEndDateField = '//div[@id="campaign-end-date"]//input'
        this.nextMonth = '//button[@aria-label="Next month"]'
        this.selectEndDate = `//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()=${cedate}]`
        this.updateStartDate = `//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()=${updatecsdate}]`
        this.updateEndDate = `//div[@class="dp__cell_inner dp__pointer dp__date_hover"][text()=${updatecedate}]`;
        this.newStartDate = '//div[@class="dp__cell_inner dp__pointer dp__today dp__date_hover"]'
        this.referralField = '//input[@id="campaign-reward-value-referral"]'
        this.refereeField = '//input[@id="campaign-reward-value-referee"]'
        this.cardTypeField = '(//div[@id="vs1__combobox"]//following::input)[1]'
        this.cardTypeList = "//ul[@id='vs1__listbox']"
        this.sourceCodeField = '(//div[@id="vs2__combobox"]//following::input)[1]'
        this.sourceCodeList = '//ul[@id="vs2__listbox"]'
        this.smsField = '//textarea[@id="campaign-sms-script"]'
        this.socialChannelField = '//textarea[@id="campaign-social-channel-script"]'
        this.awardDescriptionField = '//input[@id="campaign-award-description"]'
        this.awardTitleField = "//input[@id='campaign-award-title']"
        this.refereeWithRewardField = '//input[@id="campaign-referee-notification-description-with-reward"]'
        this.refereeWithoutRewardField = '//input[@id="campaign-referee-notification-description-without-reward"]'
        this.referralWithRewardField = '//input[@id="campaign-referral-notification-description-with-reward"]'
        this.maxReferralAllowed = '//input[@class="input-primary mt-1"]'

        this.campaignImageUpload = '//label[@for="campaign-image"]//following::label[1]'
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

    async verifyInvalidSearchResult(campaignSearch) {
        const campaignSearchList = await this.page.locator(this.campaignSearchListValidation);
        await expect(this.page.locator(this.campaignSearchField)).toHaveValue(campaignSearch)
        await expect(campaignSearchList).not.toHaveText(campaignSearch);
    }

    async verifyValidSearchResult(campaignSearch) {
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

    async campaignAddStartDateField() {
        await this.page.locator(this.campaignStartDateField).click();
        await this.page.locator(this.newStartDate).click();
        const inputValue = await this.page.$eval(this.campaignStartDateField, input => input.value);
        return inputValue
    }
    async campaignAddEndDateField() {
        await this.page.locator(this.campaignEndDateField).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.nextMonth).click();
        await this.page.locator(this.selectEndDate).click();
        const inputValue = await this.page.$eval(this.campaignEndDateField, input => input.value);
        return inputValue
    }

    async campaignUpdateStartDateField() {
        await this.page.locator(this.campaignStartDateField).click();
        await this.page.locator(this.updateStartDate).click();
        const inputValue = await this.page.$eval(this.campaignStartDateField, input => input.value);
        return inputValue
    }

    async campaignUpdateEndDateField() {
        await this.page.locator(this.campaignEndDateField).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.nextMonth).click();
        await this.page.locator(this.updateEndDate).click();
        const inputValue = await this.page.$eval(this.campaignEndDateField, input => input.value);
        return inputValue
    }

    async campaignAddFields(name, referral, referee, cardtype, scode, sms, schannel, awarddesc, awardtitle, refereereward, refereeworeward, referralreward, maxallowed, image) {
        await this.page.locator(this.campaignNameField).fill(name);
        await this.page.locator(this.referralField).fill(referral);
        await this.page.locator(this.refereeField).fill(referee);
        await this.page.locator(this.cardTypeField).click();
        await this.page.locator(this.cardTypeField).fill(cardtype);
        await this.page.waitForSelector(this.cardTypeList)
        await this.page.locator(this.cardTypeList).click()
        await this.page.locator(this.sourceCodeField).click();
        await this.page.locator(this.sourceCodeField).fill(scode);
        await this.page.waitForSelector(this.sourceCodeList)
        await this.page.locator(this.sourceCodeList).click()
        await this.page.locator(this.smsField).fill(sms);
        await this.page.locator(this.socialChannelField).fill(schannel);
        await this.page.locator(this.awardDescriptionField).fill(awarddesc);
        await this.page.locator(this.awardTitleField).fill(awardtitle);
        await this.page.locator(this.refereeWithRewardField).fill(refereereward);
        await this.page.locator(this.refereeWithoutRewardField).fill(refereeworeward);
        await this.page.locator(this.referralWithRewardField).fill(referralreward);
        await this.page.locator(this.maxReferralAllowed).fill(maxallowed);
        await this.page.locator(this.campaignImageUpload).click();
        await this.page.locator(this.campaignImageUpload).setInputFiles(image);
        await this.page.waitForTimeout(2000);
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

    async campaignSave() {
        await this.page.locator(this.saveButton).click();
        await this.page.waitForTimeout(2000);
    }

    async verifyAddSuccessMessage() {
        const successMessage = await this.page.locator(this.alert);
        await expect(successMessage).toContainText(campaigntestData.campaignadd.campaignSavedMessage)
    }

    async verifyCampaignDataTable(campaignName, campaignSDate, campaignEDate) {
        await this.page.waitForTimeout(5000)
        const tableCampaignName = await this.page.$$('//tbody/tr/td[1]/child::span')
        const tableStartDate = await this.page.$$('//tbody/tr/td[2]')
        const tableEndDate = await this.page.$$('//tbody/tr/td[3]')
        const tableNameData = [];
        const tableStartDateData = [];
        const tableEndDateData = [];

        for (let i = 0; i < tableCampaignName.length; i++) {
            const data = await tableCampaignName[i].textContent();
            tableNameData.push(data)
        }

        if (tableNameData.includes(campaignName)) {
            var indexIntable = await tableNameData.indexOf(campaignName);

            for (let i = 0; i < tableStartDate.length; i++) {
                const data = await tableStartDate[i].textContent();
                tableStartDateData.push(data)
            }
            const date1String = dayjs(campaignSDate);

            const date2 = tableStartDateData[indexIntable];
            const date1 = date1String.format('DD-MM-YYYY');
            await expect(date1).toEqual(date2)

            for (let i = 0; i < tableEndDate.length; i++) {
                const data = await tableEndDate[i].textContent();
                tableEndDateData.push(data)
            }

            const date3String = dayjs(campaignEDate);
            const date4 = tableEndDateData[indexIntable];
            const date3 = date3String.format('DD-MM-YYYY');
            await expect(date3).toEqual(date4)
            return indexIntable
        }
    }

    async verifyAddValidationMessage() {
        const name = await this.page.locator(this.campaignValidation)
        await expect(name).toContainText('Campaign Name is required')
        const referral = await this.page.locator(this.referralValidation)
        await expect(referral).toContainText('Reward Value Refferal (RM) is required')
        const referee = await this.page.locator(this.refereeValidation)
        await expect(referee).toContainText('Reward Value Referee (RM) is required')
        const sourcecode = await this.page.locator(this.cardType)
        await expect(sourcecode).toContainText('Card Type is required')
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
        const referralewithoutreward = await this.page.locator(this.referralewithrewardValidation)
        await expect(referralewithoutreward).toContainText('Referral Notification Description (With Reward) is required')
        const referraleewithoutreward = await this.page.locator(this.referralwithoutrewardValidation)
        await expect(referraleewithoutreward).toContainText('Referral Notification Description (Without Reward) is required')
        const image = await this.page.locator(this.imageValidation)
        await expect(image).toContainText('Campaign Image is required')
    }

    async verifyEditSuccessMessage(savedMsg) {
        const successMessage = await this.page.locator(this.alert);

        await expect(successMessage).toContainText(campaigntestData.campaignedit.campaignUpdatedMessage)
    }

    async campaignDeletePage(campaignData) {

        const deletebutton = await this.page.$$("//tbody/tr/td[4]//button")
        await deletebutton[campaignData].click();
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

    async verifyCampaignListforDelete(campaignName, campaignSDate, campaignEDate) {
        await this.page.waitForTimeout(5000)
        const tableCampaignName = await this.page.$$('//tbody/tr/td[1]/child::span')
        const tableStartDate = await this.page.$$('//tbody/tr/td[2]')
        const tableEndDate = await this.page.$$('//tbody/tr/td[3]')
        const tableNameData = [];
        const tableStartDateData = [];
        const tableEndDateData = [];

        for (let i = 0; i < tableCampaignName.length; i++) {
            const data = await tableCampaignName[i].textContent();
            tableNameData.push(data)
        }

        if (tableNameData.includes(campaignName)) {
            var indexIntable = await tableNameData.indexOf(campaignName);

            for (let i = 0; i < tableStartDate.length; i++) {
                const data = await tableStartDate[i].textContent();
                tableStartDateData.push(data)
            }
            const date1String = dayjs(campaignSDate);
            const date2 = tableStartDateData[indexIntable];
            const date1 = date1String.format('DD-MM-YYYY');
            await expect(date1).not.toEqual(date2)
            for (let i = 0; i < tableEndDate.length; i++) {
                const data = await tableEndDate[i].textContent();
                tableEndDateData.push(data)
            }
            const date3String = dayjs(campaignEDate);
            const date4 = tableEndDateData[indexIntable];
            const date3 = date3String.format('DD-MM-YYYY');
            await expect(date3).not.toEqual(date4)
        }

        else {
            await expect(tableNameData).not.toEqual(campaignName)
        }

    }

}






