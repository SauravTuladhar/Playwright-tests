const { expect, page} = require("@playwright/test");

export class PushNotification {
    constructor(page)
 {
        this.page = page;
        this.PushNotificationTab = "//a[@href='/marketing/push-notification']"
        this.PushNotificationAddButton = "(//*[name()='svg'][@role='img'])[72]"
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
        this.AddedSuccessfully = "//div[contains(@class, 'Vue-Toastification__toast') and contains(@class, 'Vue-Toastification__toast--success') and contains(@class, 'top-right')]"

        this.UserTypeValidation = " (//*[@class='text-red-600'])[1]"
        this.NotificationTypeValidation = "(//*[@class='text-red-600'])[2]"
        this.TitleValidation = "(//*[@class='text-red-600'])[3]"
        this.bodyValidation = "(//*[@class='text-red-600'])[5]"
        this.actionTypeValidation="(//*[@class='text-red-600'])[7]"
    }

    async waitAndClick(selector) {
        await this.page.waitForSelector(selector, { timeout: this.waitForTimeout });
        await this.page.click(selector);
    }

    async PushNotificationPage() {
        await this.page.locator(this.PushNotificationTab).click();
        await this.page.hover(this.PushNotificationAddButton);
        await this.waitAndClick(this.PushNotificationAddButton);
        

    }




    async CreatedPushNotificationPage(Title, Description, Body, callforaction) {
        await this.page.locator(this.UserType).click()
        await this.page.locator(this.UserTypeRegisterUser).click()
        await this.page.locator(this.NotificationType).click()
        await this.page.locator(this.NotificationTypePushNotification).click()
        await this.page.locator(this.NotificationTitle).fill(Title)
        await this.page.locator(this.NotificationDescription).fill(Description)
        const iframe = await this.page.locator('iframe#yourEditorIframeId').first();
        await this.page.waitForLoadState('load');
        await this.page.locator(this.NotificationBody).fill(Body);
        await this.page.locator(this.NotificationCallForAction).fill(callforaction)
        await this.page.locator(this.NotificationActionType).click()
        await this.page.locator(this.NotificationActionTypeNone).click()
        const fileInput = await this.page.locator(this.NotificationImageUploader);
        const filePath = 'D:/playwright automation/images/2024-01-18_13-04-24.png';
        await fileInput.setInputFiles(filePath);
        await this.page.locator(this.NotificationSubmit).click()
        //await this.page.waitForTimeout(1000)

    }

    

    async successMessage() {
        const check = await this.page.locator(this.AddedSuccessfully)
        expect(check).toContainText('Added successfully');

    }
    async validationError() {
        await this.page.click(this.NotificationSubmit);
        const check0 = await this.page.locator(this.UserTypeValidation);
        expect(check0).toContainText('User Type is required');

        const check1 = await this.page.locator(this.NotificationTypeValidation);
        expect(check1).toContainText('Notification Type is required');

        const check2= await this.page.locator(this.TitleValidation);
        expect(check2).toContainText('Title is required');
        
        const check3 = await this.page.locator(this.bodyValidation);
        expect(check3).toContainText('Body is required');

        const check4 = await this.page.locator(this.actionTypeValidation);
        expect(check4).toContainText('Action Type is required');

        
    }


 

}



