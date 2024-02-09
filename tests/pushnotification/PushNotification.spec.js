
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';
import { PushNotification } from '../../pageOjects/PushNotification.po';

import PushNotificationjson from '../../fixtures/PushNotificationjson.json'
const testData = require('../../fixtures/loginFixture.json');


test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
});

test('created Push Notification', async ({ page }) => {
  const pushnoti = new PushNotification(page);
  await pushnoti.PushNotificationPage();
  await pushnoti.CreatedPushNotificationPage(PushNotificationjson.AllCase[0].AddPushNotification.Title, PushNotificationjson.AllCase[0].AddPushNotification.Description, PushNotificationjson.AllCase[0].AddPushNotification.Body, PushNotificationjson.AllCase[0].AddPushNotification.callforaction);
  await pushnoti.successMessage(PushNotificationjson.AllCase[4].PopUpMessage.Added);
  await pushnoti.doublecheckAddEdit(PushNotificationjson.AllCase[0].AddPushNotification.Title)


});

test('Validating the error message', async ({ page }) => {
  const valid = new PushNotification(page)
  await valid.PushNotificationPage()

  await valid.validationError(PushNotificationjson.AllCase[3].ValidationMessage.UserTypeValidation, PushNotificationjson.AllCase[3].ValidationMessage.NotificationTypeValidation, PushNotificationjson.AllCase[3].ValidationMessage.TitleValidation, PushNotificationjson.AllCase[3].ValidationMessage.BodyValidation, PushNotificationjson.AllCase[3].ValidationMessage.ActionTypeValidation)
})


test('Editing the table data', async ({ page }) => {
  const edit = new PushNotification(page)
  await edit.VerifyingPushnotificationtab()
  await edit.validatingtableforedit()
  await edit.EditPushNotification(PushNotificationjson.AllCase[1].EditPushNotification.Title, PushNotificationjson.AllCase[1].EditPushNotification.Description, PushNotificationjson.AllCase[1].EditPushNotification.Body, PushNotificationjson.AllCase[1].EditPushNotification.callforaction);
  await edit.successMessageEdited(PushNotificationjson.AllCase[4].PopUpMessage.Edited)
  await edit.doublecheckAddEdit(PushNotificationjson.AllCase[1].EditPushNotification.Title)
})

test('Delete the table data', async ({ page }) => {
  const deletetable = new PushNotification(page)
  await deletetable.VerifyingPushnotificationtab()
  await deletetable.validatingTableForDelete()
  await deletetable.deletedSuccessfullyMessage(PushNotificationjson.AllCase[4].PopUpMessage.Deleted)
  await deletetable.doublecheckDelete(PushNotificationjson.AllCase[1].EditPushNotification.Title)

})








