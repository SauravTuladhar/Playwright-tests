import { TIMEOUT } from "dns";


const { expect, page } = require("@playwright/test");

export class PushNotification {
    constructor(page) {
        this.page = page;
        this.PushNotificationTab = "//a[@href='/marketing/push-notification']"
        this.PushNotificationAddButton = "#table-add"
        this.UserType = "//input[@aria-labelledby='vs1__combobox']"
        this.UserTypeRegisterUser = "#vs1__option-0"
        this.NotificationType = '//input[@aria-labelledby="vs2__combobox"]';
        this.NotificationTypePushNotification = "#vs2__option-0"
        this.NotificationTitle = "#notification-title"
        this.NotificationDescription = "#notification-short-description"
        this.NotificationBody = "//div[@aria-label='Editor editing area: main']"
        this.NotificationCallForAction = "#notification-call-for-action"
        this.NotificationActionType = "//input[@aria-labelledby='vs3__combobox']"
        this.NotificationActionTypeNone = "#vs3__option-0"
        this.NotificationImageUploader = "//span[@class='h-full flex justify-center items-center w-full p-4 font-thin text-4xl']"
        this.NotificationSubmit = "#notification-save"
        this.waitForTimeout = 5000;
        this.AddedSuccessfully = "//div[@role='alert' and @class='Vue-Toastification__toast-body' and text()='Added successfully!']"
        this.UserTypeValidation = " (//*[@class='text-red-600'])[1]"
        this.NotificationTypeValidation = "(//*[@class='text-red-600'])[2]"
        this.TitleValidation = "(//*[@class='text-red-600'])[3]"
        this.bodyValidation = "(//*[@class='text-red-600'])[5]"
        this.actionTypeValidation = "(//*[@class='text-red-600'])[7]"
        this.EditedSuccessfully = "//div[@role='alert' and @class='Vue-Toastification__toast-body' and text()='Updated successfully!']"
        this.tableediticon = "//*[@class='cursor-pointer']"
        this.tablledeleteicon = "//button[@id='table-delete']"
        this.tablelocation = "//*[@class='overflow-x-auto scrollbar-secondary shadow-sm']"
        this.deleteconfirmation = "#popup-save"
        this.deletedSuccessfully = "//div[@role='alert' and @class='Vue-Toastification__toast-body' and text()='Deleted successfully.']"
    }

    async waitAndClick(selector) {
        await this.page.waitForSelector(selector, { timeout: this.waitForTimeout });
        await this.page.click(selector);
    }

    async PushNotificationPage() {
        await this.page.waitForTimeout(5000)
        await this.page.locator(this.PushNotificationTab).click();
        await this.page.hover(this.PushNotificationAddButton);
        await this.page.locator(this.PushNotificationAddButton).click();
    }
    async VerifyingPushnotificationtab(){
        await this.page.locator(this.PushNotificationTab).click();
    }

    async CreatedPushNotificationPage(Title, Description, Body, callforaction) {
        await this.page.locator(this.UserType).click()
        await this.page.locator(this.UserTypeRegisterUser).click()
        await this.page.locator(this.NotificationType).click()
        await this.page.locator(this.NotificationTypePushNotification).click()
        await this.page.locator(this.NotificationTitle).fill(Title)
        await this.page.locator(this.NotificationDescription).fill(Description)
        await this.page.locator(this.NotificationBody).fill(Body);
        await this.page.locator(this.NotificationCallForAction).fill(callforaction)
        await this.page.locator(this.NotificationActionType).click()
        await this.page.locator(this.NotificationActionTypeNone).click()
        const fileInput = await this.page.locator(this.NotificationImageUploader);
        const filePath = 'D:/playwright automation/images/2024-01-18_13-04-24.png';
        await fileInput.setInputFiles(filePath);
        await this.page.locator(this.NotificationSubmit).click()
    }
    async successMessage(Added) {
        const check = await this.page.locator(this.AddedSuccessfully);
        await expect(check.innerText()).resolves.toContain(Added);
        await this.page.waitForTimeout(3000)
    }
    async validationError(UserTypeValidation, NotificationTypeValidation, TitleValidation, BodyValidation,ActionTypeValidation ) {
        await this.page.click(this.NotificationSubmit);
        const check0 = await this.page.locator(this.UserTypeValidation);
        expect(check0).toContainText(UserTypeValidation);

        const check1 = await this.page.locator(this.NotificationTypeValidation);
        expect(check1).toContainText(NotificationTypeValidation);

        const check2 = await this.page.locator(this.TitleValidation);
        expect(check2).toContainText(TitleValidation);

        const check3 = await this.page.locator(this.bodyValidation);
        expect(check3).toContainText(BodyValidation);

        const check4 = await this.page.locator(this.actionTypeValidation);
        expect(check4).toContainText(ActionTypeValidation);
    }

    async EditPushNotification(Title, Description, Body, callforaction) {
        await this.page.locator(this.NotificationTitle).fill(Title)
        await this.page.locator(this.NotificationDescription).fill(Description)
        await this.page.locator(this.NotificationBody).fill(Body);
        await this.page.locator(this.NotificationCallForAction).fill(callforaction)
        await this.page.locator(this.NotificationSubmit).click()
    }
    async successMessageEdited(Edited) {

        const check = await this.page.locator(this.EditedSuccessfully);
        await expect(check.innerText()).resolves.toContain(Edited);
    }

    async validatingtableforedit() {
        const table = await this.page.locator(this.tablelocation)
        const columns = await table.locator('thead tr th')
        const rows = await table.locator('tbody tr')
        const matchedRow = rows.filter({
            has: this.page.locator('td'),
            hasText: 'Hello title'
        })
        await matchedRow.locator('a').click()
    }
    async validatingTableForDelete() {
        const table = await this.page.locator(this.tablelocation)
        const columns = await table.locator('thead tr th')
        const rows = await table.locator('tbody tr')
        const matchedRow = rows.filter({
            has: this.page.locator('td'),
            hasText: 'Hello titles'
        })
        
        await matchedRow.locator(this.tablledeleteicon).click()
        await this.page.locator(this.deleteconfirmation).click()
    }
    async deletedSuccessfullyMessage(Deleted) {
        const check = await this.page.locator(this.deletedSuccessfully);
        await expect(check.innerText()).resolves.toContain(Deleted);
    }

    async doublecheckAddEdit(PushNotification) {
        let matchFound = false;
        const table = await this.page.locator(this.tablelocation)
        const rows = await table.locator('tbody tr')
        const columns = await table.locator('thead tr th')
        for (let i = 0; i < await rows.count(); i++) {
            const row = await rows.nth(i);
            const tds = row.locator('td');
            for (let j = 0; j < await columns.count() - 1; j++) {
                const nameMatch = await tds.nth(j).textContent()
                if (nameMatch == PushNotification) {
                    matchFound = true;
                    break
                }
            }
            if (matchFound == true) {
                break;
            }
        }

    }
    async doublecheckDelete(PushNotification) {
        let matchFound = false;
        console.log("inside double check function")
        const table = await this.page.locator(this.tablelocation)
        const rows = await table.locator('tbody tr')
        const columns = await table.locator('thead tr th')
        for (let i = 0; i < await rows.count(); i--) {
            const row = await rows.nth(i);
            const tds = row.locator('td');

            for (let j = 0; j < await columns.count() - 1; j++) {
            const nameMatch = await tds.nth(j).textContent()
                if (nameMatch != PushNotification) {
                   
                    matchFound = true;
                    break
                }
            }
            if (matchFound == true) {
                break;
            }

        }

    }
}





