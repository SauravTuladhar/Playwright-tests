
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';
import { PushNotification } from '../../pageOjects/PushNotification.po';
const testData = require('../../fixtures/loginFixture.json');
const { requestResponseListeners, createEntity, authenticateUser, deleteEntity, validateEntity } = require('../../utils/helper.spec.js');
import PushNotificationjson from '../../fixtures/PushNotificationjson.json'

let accessToken;

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
});
test.describe(' CRUD operation through UI', () => {

test('created Push Notification', async ({ page }) => {
  const pushnoti = new PushNotification(page);
  await pushnoti.PushNotificationPage();
  await pushnoti.CreatedPushNotificationPage(PushNotificationjson.AddPushNotification.Title, PushNotificationjson.AddPushNotification.Description, PushNotificationjson.AddPushNotification.Body, PushNotificationjson.AddPushNotification.callforaction);
  await pushnoti.successMessage(PushNotificationjson.PopUpMessage.Added);
  await pushnoti.verifyingPushNotificationAddEdit(PushNotificationjson.AddPushNotification.Title)


});

test('Validating the error message', async ({ page }) => {
  const valid = new PushNotification(page)
  await valid.PushNotificationPage()

  await valid.validationError(PushNotificationjson.ValidationMessage.UserTypeValidation, PushNotificationjson.ValidationMessage.NotificationTypeValidation, PushNotificationjson.ValidationMessage.TitleValidation, PushNotificationjson.ValidationMessage.BodyValidation, PushNotificationjson.ValidationMessage.ActionTypeValidation)
})


test('Editing the table data', async ({ page }) => {
  const edit = new PushNotification(page)
  await edit.VerifyingPushnotificationtab()
  await edit.validatingtableforedit()
  await edit.EditPushNotification(PushNotificationjson.EditPushNotification.Title, PushNotificationjson.EditPushNotification.Description, PushNotificationjson.EditPushNotification.Body, PushNotificationjson.EditPushNotification.callforaction);
  await edit.successMessageEdited(PushNotificationjson.PopUpMessage.Edited)
  await edit.verifyingPushNotificationAddEdit(PushNotificationjson.EditPushNotification.Title)
})

test('Delete the table data', async ({ page }) => {
  const deletetable = new PushNotification(page)
  await deletetable.VerifyingPushnotificationtab()
  await deletetable.validatingTableForDelete()
  await deletetable.deletedSuccessfullyMessage(PushNotificationjson.PopUpMessage.Deleted)
  await deletetable.verifyingPushNotificationDelete(PushNotificationjson.EditPushNotification.Title)

})
})


test.describe('Edit and Delete Test cases', () => {
    

  test('Edit PushNotification', async ({ page, request }) => {
      const pushnoti = new PushNotification(page);
      const Data = {
          "type": "Registered Users",
          "title": "Bhumika 001",
          "short_description": "Test Description",
          "call_for_action": "Test Call For Action",
          "body": "<p>Test Body</p>",
          "action_type": "None",
          "image": "https://d3pr0ddcj2iamd.cloudfront.net/notification_1707932752974.png",
          "notification_type": "Push Notification"
      };
      accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });

      const entityId = await createEntity(Data, accessToken, '/notification/manage/marketing/push-notification', { request });
      await pushnoti.PushNotificationPage()
      await pushnoti.EditPushNotification(PushNotificationjson.EditPushNotification.Title, PushNotificationjson.EditPushNotification.Description, PushNotificationjson.EditPushNotification.Body, PushNotificationjson.EditPushNotification.callforaction);
      await deleteEntity(accessToken, `/notification/manage/marketing/push-notification/${entityId}`, { request });
      await validateEntity(accessToken, `/notification/manage/marketing/push-notification/${entityId}`, '404', { request });
  });

  test('PushNotification Delete test', async ({ page, request }) => {
      const deletetable = new PushNotification(page);
      const Data = {
          "type": "Registered Users",
          "title": "Hello titles",
          "short_description": "Test Description",
          "call_for_action": "Test Call For Action",
          "body": "<p>Test Body</p>",
          "action_type": "None",
          "image": "https://d3pr0ddcj2iamd.cloudfront.net/notification_1707932752974.png",
          "notification_type": "Push Notification"
      };
      accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
      const entityId = await createEntity(Data, accessToken, '/notification/manage/marketing/push-notification', { request });
      await deletetable.VerifyingPushnotificationtab()
      await deletetable.validatingTableForDelete()
      await validateEntity(accessToken, `/notification/manage/marketing/push-notification/${entityId}`, '404', { request });
  });
})


test.afterEach(async ({ page }) => {
  await page.close();
})

















