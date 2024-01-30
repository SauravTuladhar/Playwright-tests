const { expect } = require("@playwright/test");

exports.LoginPage = class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = '#username';
        this.passwordInput = '//input[@placeholder="Password"]';
        this.loginButton = '//button[@type="submit"]';
        this.ValidLoginValidation = '//a[@href="/dashboard"]';
        this.alertMessage = '//div[@role="alert"]';
        this.userNameEmptyError = '//input[@placeholder="Username"]//following::div[1]';
        this.passwordEmptyError = '//input[@placeholder="Password"]//following::div[2]';
        this.changePasswordPopupValidation = '//b[contains(text(),"Change Password")]';
        this.currentPassword = '//input[@placeholder="Current Password"]';
        this.newPassword = '//input[@placeholder="New Password"]';
        this.confirmNewPassword = '//input[@placeholder="Confirm New Password"]';
        this.changePasswordButton = '//button[contains(text(),"Change Password")]';
        this.invalidPasswordErrorMessage = '//input[@placeholder="New Password"]//following::div[2]';
        this.newPasswordAndConfirmPasswordErrorMessage = '//input[@placeholder="Confirm New Password"]//following::div[2]';
        this.passwordRequiredErrorMessage = '//input[@placeholder="Current Password"]//following::div[2]';
        this.forgotPassword = '//p[contains(text(),"Forgot Password ?")]';
        this.forgotPasswordEmailField = '//input[@placeholder="Email"]';
        this.forgotPasswordEmailFieldError = '//input[@placeholder="Email"]//following::div[1]';
        this.forgotPasswordSubmit = '//button[contains(text(),"Submit")]';
        this.forgotPasswordBack = '//button[contains(text(),"Back")]';
        this.validateLoginPage = '//div[contains(text(),"Login")]';
        this.forgotPasswordEmailSent = '//div[contains(text(),"Email Sent")]';
        this.forgotPasswordEmailSentMessage = '//p[contains(text(),"Password reset email has been sent.")]';
        this.confirmPasswordInput = '//input[@placeholder="Confirm Password"]';
        this.resetForgotPassword = '//button[contains(text(),"Reset Password")]';
    }

    async login(username, password) {
        await this.page.locator(this.usernameInput).fill(username);
        await this.page.locator(this.passwordInput).fill(password);
        await this.page.locator(this.loginButton).click();
    }

    async verifyValidLogin() {
        const verifyLogin = await this.page.locator(this.ValidLoginValidation);
        const text = await verifyLogin.textContent();
        return text.includes('Dashboard') ? 0 : 1;
    }

    async verifyInvalidLogin() {
        const verifyInvalidLogin = await this.page.locator(this.alertMessage);
        const text = await verifyInvalidLogin.textContent();
        return text.includes('Invalid username or password') ? 0 : 1;
    }

    async verifyInvalidUsername() {
        const verifyInvalidLogin = await this.page.locator(this.alertMessage);
        const text = await verifyInvalidLogin.textContent();
        return text.includes('User not found') ? 0 : 1;
    }

    async verifyUsernameEmptyFields() {
        const verifyEmptyUsername = await this.page.locator(this.userNameEmptyError);
        await expect(verifyEmptyUsername).toHaveText('Username is required');
    }

    async verifyPasswordEmptyFields() {
        const verifyEmptyPassword = await this.page.locator(this.passwordEmptyError);
        await expect(verifyEmptyPassword).toHaveText('Password is required');
    }

    async verifyUserBlocked() {
        const blockedUserError = await this.page.locator(this.alertMessage);
        await expect(blockedUserError).toHaveText('Sorry, your user status is Blocked. Please contact the system administrator to reactivate your account.');
    }

    async verifyChangePasswordPopup() {
        const changePasswordPopup = await this.page.locator(this.changePasswordPopupValidation);
        await expect(changePasswordPopup).toBeVisible;
    }

    async changePassword(currentPassword, newPassword, confirmNewPassword) {
        await this.page.locator(this.currentPassword).fill(currentPassword);
        await this.page.locator(this.newPassword).fill(newPassword);
        await this.page.locator(this.confirmNewPassword).fill(confirmNewPassword);
        await this.page.locator(this.changePasswordButton).click();
    }

    async verifyInvalidNewPasswordFormatError() {
        const verifyInvalidPasswordFormatError = await this.page.locator(this.invalidPasswordErrorMessage);
        await expect(verifyInvalidPasswordFormatError).toHaveText('New Password must contain an uppercase, lowercase, number and special character');
    }

    async verifyNewNasswordAndConfirmNewPasswordError() {
        const verifyInvalidPasswordFormatError = await this.page.locator(this.newPasswordAndConfirmPasswordErrorMessage);
        await expect(verifyInvalidPasswordFormatError).toHaveText("Confirm New Password doesn't match with New Password");
    }

    async verifyExpiredPasswordChangedSuccess() {
        const verifyxpiredPasswordChangedSuccess = await this.page.locator(this.alertMessage);
        await expect(verifyxpiredPasswordChangedSuccess).toHaveText("Password Changed Successfully");
    }

    async verifyPasswordRequired() {
        await this.page.locator(this.changePasswordButton).click();
        const currentPasswordRequired = await this.page.locator(this.passwordRequiredErrorMessage);
        const newPasswordRequired = await this.page.locator(this.invalidPasswordErrorMessage);
        const confirtmNewPasswordRequired = await this.page.locator(this.newPasswordAndConfirmPasswordErrorMessage);
        await expect(currentPasswordRequired).toHaveText("Current Password is required");
        await expect(newPasswordRequired).toHaveText("New Password is required");
        await expect(confirtmNewPasswordRequired).toHaveText("Confirm New password is required");
    }

    async verifyInvalidCurrentPassword() {
        const currentPasswordInvalidErrorMessage = await this.page.locator(this.alertMessage);
        await expect(currentPasswordInvalidErrorMessage).toHaveText("Password did not match");
    }

    async verifyNewPasswordCannotBeGreaterThan20Character() {
        const newPasswordGreaterThan20Error = await this.page.locator(this.invalidPasswordErrorMessage);
        await expect(newPasswordGreaterThan20Error).toHaveText("New Password length must be less than or equal to 20 characters.");
    }

    async inputForgotPasswordEmail(forgotEmail) {
        await this.page.locator(this.forgotPassword).click();
        await this.page.locator(this.forgotPasswordEmailField).fill(forgotEmail);
        await this.page.locator(this.forgotPasswordSubmit).click();
    }

    async verifyEmptyForgotPasswordError() {
        const forgotPasswordError = await this.page.locator(this.forgotPasswordEmailFieldError);
        await expect(forgotPasswordError).toHaveText("Email is required");
    }

    async verifyInvalidForgotPasswordError() {
        const forgotPasswordError = await this.page.locator(this.forgotPasswordEmailFieldError);
        await expect(forgotPasswordError).toHaveText("Email Must be valid email address");
    }

    async verifyUserNotExistsForgotPassword() {
        const userNotFound = await this.page.locator(this.alertMessage);
        await expect(userNotFound).toHaveText("User not found");
    }

    async verifyBackButtonNavigatesToLoginPage() {
        await this.page.locator(this.forgotPassword).click();
        await this.page.locator(this.forgotPasswordBack).click();
        const forgotPasswordError = await this.page.locator(this.forgotPasswordEmailFieldError);
        await expect(this.validateLoginPage).toBeVisible;
    }

    async verifyResetEmailSent() {
        const forgotPasswordEmailSent = await this.page.locator(this.forgotPasswordEmailSent);
        await expect(forgotPasswordEmailSent).toHaveText("Email Sent");
        const forgotPasswordEmailSentMessage = await this.page.locator(this.forgotPasswordEmailSentMessage);
        await expect(forgotPasswordEmailSentMessage).toHaveText(" Password reset email has been sent. Please check your email. ");
        await this.page.waitForTimeout(10000);
    }

    async resetPassword(password, confirmPassword) {
        await this.page.locator(this.passwordInput).fill(password);
        await this.page.locator(this.confirmPasswordInput).fill(confirmPassword);
        await this.page.locator(this.resetForgotPassword).click();
    }

    async verifyPasswordResetSuccessful() {
        const passwordReset = await this.page.locator(this.alertMessage);
        await expect(passwordReset).toHaveText("Added successfully!");
    }
}