import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';
const testData = require('../../fixtures/loginFixture.json');
const { updateRun, requestResponseListeners, getEmails, extractLinkFromHtml, authenticateUser, deleteUser, createUser, getAllUsers, getUserIdByEmail, forceChangePassword, updatePassword, passwordHistory, uploadReportToTestSet, uploadReport } = require('../../utils/helper.spec.js');

let accessToken, apiResponse

test.beforeEach(async ({ page }) => {
    apiResponse = await requestResponseListeners(page);
    await page.goto('/');
})

test.describe('Valid login tests', () => {
    test('Login using valid username and password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.validUser.userName, testData.validUser.password);
        const testResult = await login.verifyValidLogin();
        const instanceIdToUpdate = '94343316';
        await updateRun(instanceIdToUpdate, testResult, JSON.stringify(apiResponse));
        expect(testResult).toBe(0);
    });
})

test.describe('Invalid login tests', () => {
    test('Login using invalid username and valid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.invalidUser.userName, testData.validUser.password);
        await login.verifyInvalidUsername();
        const testResult = await login.verifyInvalidUsername();
        const instanceIdToUpdate = '94343317';
        await updateRun(instanceIdToUpdate, testResult, apiResponse);
        //await updateRun(instanceIdToUpdate, testResult);
        expect(testResult).toBe(0);
    });

    test('Login using valid username and invalid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.validUser.userName, testData.invalidUser.password);
        await login.verifyInvalidLogin();
        const testResult = await login.verifyInvalidLogin();
        const instanceIdToUpdate = '94343659';
        await updateRun(instanceIdToUpdate, testResult, apiResponse);
        expect(testResult).toBe(0);
    });

    test('Login using invalid username and invalid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.invalidUser.userName, testData.invalidUser.password);
        await login.verifyInvalidUsername();
        const testResult = await login.verifyInvalidUsername();
        const instanceIdToUpdate = '94139526';
        await updateRun(instanceIdToUpdate, testResult);
        expect(testResult).toBe(0);
        //await login.verifyInvalidUsername();
    })

    test('Login using no username and no password and click login', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login("", "");
        await login.verifyUsernameEmptyFields();
        await login.verifyPasswordEmptyFields();
    })

    test('Login using no username and click on login', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login("", testData.validUser.password);
        await login.verifyUsernameEmptyFields();
    })

    test('Login using no password and click on login', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.validUser.userName, "");
        await login.verifyPasswordEmptyFields();
    })
})

test.describe('Blocked user test', () => {
    test('User blocked login test', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.blockedUser.userName, testData.blockedUser.password);
        await login.verifyUserBlocked();
    })
})

test.describe('Forgot password test', () => {
    test('Forgot password invalid email test', async ({ page }) => {
        const login = new LoginPage(page);
        await login.inputForgotPasswordEmail(testData.invalidUser.invalidEmail);
        await login.verifyInvalidForgotPasswordError();
    })

    test('Forgot password empty email test', async ({ page }) => {
        const login = new LoginPage(page);
        await login.inputForgotPasswordEmail("");
        await login.verifyEmptyForgotPasswordError();
    })

    test('Forgot password user not exists test', async ({ page }) => {
        const login = new LoginPage(page);
        await login.inputForgotPasswordEmail(testData.invalidUser.userName);
        await login.verifyUserNotExistsForgotPassword();
    })

    test('Verify back button in forgot password page navigates back to login page', async ({ page }) => {
        const login = new LoginPage(page);
        await login.verifyBackButtonNavigatesToLoginPage();
    })

    test.skip('Verify password reset email is sent to user and verify passowrd change is successfull', async ({ page }) => {
        const login = new LoginPage(page);
        await login.inputForgotPasswordEmail(testData.forgorPasswordUser.userName);
        await login.verifyResetEmailSent();
        const receivedLink = await getEmails();
        await page.goto(receivedLink);
        await login.resetPassword(testData.ExpiredPasswordUser.newPassword, testData.ExpiredPasswordUser.newPassword);
        await login.verifyPasswordResetSuccessful();
        await login.login(testData.forgorPasswordUser.userName, testData.ExpiredPasswordUser.newPassword);
        await login.verifyValidLogin();
    })

    test.skip('Login using valid credentials for the first time and changing password using valid format', async ({ request, page, context }) => {
        const login = new LoginPage(page);
        const newUserData = {
            role: 'Backoffice',
            name: 'Automation 8squarei',
            username: 'automation8squarei@gmail.com',
            phone_number: '609988778899',
            status: 'Active',
            status_remarks: 'User test',
        };
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const deleteUserById = await getUserIdByEmail(testData.forgorPasswordUser.userName, context);
        await deleteUser(deleteUserById, accessToken, { request });
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        await createUser(newUserData, accessToken, { request });
        await page.waitForTimeout(10000);
        const receivedPassword = await getEmails();
        await login.login(testData.forgorPasswordUser.userName, receivedPassword);
        await login.changePassword(receivedPassword, testData.forgorPasswordUser.password, testData.forgorPasswordUser.password);
        await login.login(testData.forgorPasswordUser.userName, testData.forgorPasswordUser.password);
        await login.verifyValidLogin();
    });
})

test.describe('Expired password login tests', () => {
    test('Change password using valid credentials but password expired and changing password using invalid password format', async ({ page, request, context }) => {
        const login = new LoginPage(page);
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const userToUpdate = await getUserIdByEmail(testData.ExpiredPasswordUser.userName, accessToken, context);
        await forceChangePassword(userToUpdate, accessToken, true, { request });
        await updatePassword(userToUpdate, accessToken, { request });
        await passwordHistory(userToUpdate, accessToken, { request });
        await login.login(testData.ExpiredPasswordUser.userName, testData.ExpiredPasswordUser.currentPassword);
        await login.verifyChangePasswordPopup();
        await login.changePassword(testData.ExpiredPasswordUser.currentPassword, testData.invalidUser.password, testData.invalidUser.password);
        await login.verifyInvalidNewPasswordFormatError();
    })

    test('Change password using valid credentials but password expired and new password and confirm new password are not same', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.ExpiredPasswordUser.userName, testData.ExpiredPasswordUser.currentPassword);
        await login.verifyChangePasswordPopup();
        await login.changePassword(testData.ExpiredPasswordUser.currentPassword, testData.ExpiredPasswordUser.newPassword, testData.invalidUser.password);
        await login.verifyNewNasswordAndConfirmNewPasswordError();
    })

    test('Change password using valid credentials but password field empty and required message shown', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.ExpiredPasswordUser.userName, testData.ExpiredPasswordUser.currentPassword);
        await login.verifyChangePasswordPopup();
        await login.verifyPasswordRequired();
    })

    test('Change password using invalid credentials and valid new and confirm new password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.ExpiredPasswordUser.userName, testData.ExpiredPasswordUser.currentPassword);
        await login.verifyChangePasswordPopup();
        await login.changePassword(testData.invalidUser.password, testData.ExpiredPasswordUser.newPassword, testData.ExpiredPasswordUser.newPassword);
        await login.verifyInvalidCurrentPassword();
    })

    test('Change password using new password greater than 20 character', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.ExpiredPasswordUser.userName, testData.ExpiredPasswordUser.currentPassword);
        await login.verifyChangePasswordPopup();
        await login.changePassword(testData.ExpiredPasswordUser.currentPassword, testData.invalidUser['password>20Character'], testData.invalidUser['password>20Character']);
        await login.verifyNewPasswordCannotBeGreaterThan20Character();
    })

    test('Change password using valid credentials but password expired and changing password using valid password format', async ({ page, request, context }) => {
        const login = new LoginPage(page);
        await login.login(testData.ExpiredPasswordUser.userName, testData.ExpiredPasswordUser.currentPassword);
        await login.verifyChangePasswordPopup();
        await login.changePassword(testData.ExpiredPasswordUser.currentPassword, testData.ExpiredPasswordUser.newPassword, testData.ExpiredPasswordUser.newPassword);
        await login.verifyExpiredPasswordChangedSuccess();
        accessToken = await authenticateUser(testData.validUser.userName, testData.validUser.password, { request });
        const userToUpdate = await getUserIdByEmail(testData.ExpiredPasswordUser.userName,accessToken, context);
        await passwordHistory(userToUpdate, accessToken, { request });
        await updatePassword(userToUpdate, accessToken, { request });
    })
})

test.afterEach(async ({ page }) => {
    await page.close();
})

test.afterAll(async () => {
    await uploadReportToTestSet();
    //await uploadReport();

});