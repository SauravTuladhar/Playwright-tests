import { LoginPage } from '../../pageOjects/login.po';
const { test, expect } = require("@playwright/test");
import { PushNotification } from '../../pageOjects/PushNotification.po';
const testData = require('../../fixtures/loginFixture.json');

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
  
});

test('created Push Notification', async ({ page }) => {
  const pushnoti = new PushNotification(page)
;
  await pushnoti.PushNotificationPage();
  await pushnoti.CreatedPushNotificationPage("Hello title", "Hello description", "Hello Body", "Hello call for action");
  await pushnoti.successMessage();
});


test.only('Validating the error message', async({page}) =>{
  const valid =new PushNotification(page)

  await valid.PushNotificationPage()

  await valid.validationError()
  
})




