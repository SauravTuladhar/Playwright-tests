import { test, expect } from '@playwright/test';
import * as login_testdata from '../../fixtures/loginFixture.json'
import * as roleManagement_testdata from '../../fixtures/rolemangementFixture.json'
import { LoginPage } from '../../pageOjects/login.po';
import { RoleManagement } from '../../pageOjects/RoleManagement.pom';



test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(login_testdata.validUser.userName, login_testdata.validUser.password);
    await login.verifyValidLogin();
})
test("verifying opening role management page", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await page.waitForTimeout(5000);
    await expect(page.url()).toEqual(roleManagement_testdata['role management page url'])

})

test("Add role page field validations", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await roleManagement.clickAddRoleButton();
    await roleManagement.clickSaveButton();
    await expect(roleManagement.roleNameFieldValidation()).toBeTruthy();
    await expect(roleManagement.roleTaskFieldValidation()).toBeTruthy();
})

test("Verify Sucessfull Role add", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await roleManagement.clickAddRoleButton();
    await roleManagement.inputRoleName(roleManagement_testdata['Role name'])
    await roleManagement.inputRoledescription(roleManagement_testdata['Role Description'])
    await roleManagement.checkRoleStatus();
    await roleManagement.checkAllCheckBox();
    await roleManagement.verifyCheckAllCheckbox();
    await roleManagement.clickSaveButton();
    await roleManagement.verifyToastMessage()
    await expect(await roleManagement.verifyToastMessageContent()).toEqual(roleManagement_testdata['Toast message']['Add sucessfull'])
    await roleManagement.verifyRoleManagementDataTable(roleManagement_testdata['Role name'],roleManagement_testdata['Role Description'],roleManagement_testdata['Role status']);
})

test("Verifying Adding Duplicate Role", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await roleManagement.clickAddRoleButton();
    await roleManagement.inputRoleName(roleManagement_testdata['Role name'])
    await roleManagement.inputRoledescription(roleManagement_testdata['Role Description'])
    await roleManagement.checkRoleStatus();
    await roleManagement.checkAllCheckBox()
    await roleManagement.verifyCheckAllCheckbox();
    await roleManagement.clickSaveButton();
    await roleManagement.verifyToastMessage()
    await expect(await roleManagement.verifyToastMessageContent()).toEqual(roleManagement_testdata['Toast message']['Duplicate data']);

})


test("Verify Role Search functionality", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await roleManagement.searchRole(roleManagement_testdata['Role name']);
    await page.waitForTimeout(5000)
    await roleManagement.verifyRoleManagementDataTable(roleManagement_testdata['Role name'],roleManagement_testdata['Role Description'], roleManagement_testdata['Role status'])

})

// test("Verify Role in table", async ({ page }) => {
//     const roleManagement = new RoleManagement(page);
//     await roleManagement.openRoleManagementPage();
//     await page.waitForTimeout(500);
//     await roleManagement.verifyDataInTable(roleManagement_testdata['Role name'])

// })

test("Verify reset button", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await roleManagement.searchRole(roleManagement_testdata['Edited Role Name']);
    await roleManagement.verifyResetButton();

})

// test("verify table data", async ({ page }) => {

//     const roleManagement = new RoleManagement(page);
//     await roleManagement.openRoleManagementPage();
//     await roleManagement.verifyDataInTable(roleManagement_testdata['Role name'])
//     await page.waitForTimeout(5000)
//     await roleManagement.verifyothervaluesintable(roleManagement_testdata['Role name'], roleManagement_testdata['Role Description'])
// })

test("Veify Edit role", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await roleManagement.verifyEditRole(roleManagement_testdata['Role name'],roleManagement_testdata['Role Description'],roleManagement_testdata['Role status'])
    await roleManagement.inputRoleName(roleManagement_testdata['Edited Role Name']);
    await roleManagement.clickSaveButton();
    await roleManagement.verifyToastMessage()
    await expect(await roleManagement.verifyToastMessageContent()).toEqual(roleManagement_testdata['Toast message']["Edited sucessfull"])
    await roleManagement.verifyRoleManagementDataTable(roleManagement_testdata['Edited Role Name'],roleManagement_testdata['Role Description'],roleManagement_testdata['Role status'])
    
    

})

test("Verify Delete role", async ({ page }) => {
    const roleManagement = new RoleManagement(page);
    await roleManagement.openRoleManagementPage();
    await roleManagement.verifyDeleteRole(roleManagement_testdata['Edited Role Name'],roleManagement_testdata['Role Description'],roleManagement_testdata['Role status'])
    await roleManagement.verifyToastMessage()
    await expect(await roleManagement.verifyToastMessageContent()).toEqual(roleManagement_testdata['Toast message']['Delete Sucessfull'])
    // await roleManagement.verifyRoleManagementDataTable(roleManagement_testdata['Edited Role Name'],roleManagement_testdata['Role Description'],roleManagement_testdata['Role status'])
    
})