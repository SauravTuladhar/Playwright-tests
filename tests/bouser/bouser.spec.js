import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageOjects/login.po';

import { boUser } from '../../pageOjects/bouser.po.js';
const testData = require('../../fixtures/loginFixture.json');
const bodata = JSON.parse(JSON.stringify(require('../../fixtures/bouserFixture.json')));

let page;

test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.userName, testData.validUser.password);
    await login.verifyValidLogin();
})

test.afterEach(async ({ page }) => {
    await page.close();
})


test.describe(' Verify BO User _ Creation', () => {

    test('Verify valid BO User Creation_Empty Validation message', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.click_AddboUserMenu()
        await bo.Verify_BoAddURL()
        await bo.click_Save()
        await bo.ValidationMsg_Usertype()
        await bo.ValidationMsg_fullname()
        await bo.ValidationMsg_Usertype()
        await bo.ValidationMsg_phonenumber()
        await bo.ValidationMsg_status()
    })

    test('Verify valid BO User Cancellation', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.click_AddboUserMenu()
        await bo.Verify_BoAddURL()
        await bo.click_Cancel()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
    })

    test('Verify valid BO User Creation', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.click_AddboUserMenu()
        await bo.Verify_BoAddURL()
        await bo.click_UserType()
        await page.waitForTimeout(3000)
        await bo.click_userTypeDropdownitems()
        await bo.enter_FullName(bodata.Add.fullname)
        await bo.enter_userName(bodata.Add.username)
        await bo.enter_PhoneNumber(bodata.Add.ph)
        await bo.click_status()
        await bo.click_statusDropdownItems()
        await bo.Select_Role()
        await bo.click_Save()
        await page.waitForTimeout(3000)
        await bo.Verify_ToastPopUp(bodata.message.AddSuccess)
    })

    test('Verify Duplicate BO User Creation', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.click_AddboUserMenu()
        await bo.Verify_BoAddURL()
        await bo.click_UserType()
        await page.waitForTimeout(3000)
        await bo.click_userTypeDropdownitems()
        await bo.enter_FullName(bodata.Add.fullname)
        await bo.enter_userName(bodata.Add.username)
        await bo.enter_PhoneNumber(bodata.Add.ph)
        await bo.click_status()
        await bo.click_statusDropdownItems()
        await bo.Select_Role()
        await bo.click_Save()
        await page.waitForTimeout(3000)
        await bo.Verify_ToastPopUp(bodata.message.AddDuplicateUser)
    })
})

test.describe(' Verify BO User _ Search', () => {

    test('Search BO User _ with Username', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.Enter_Searchtext(bodata.Add.username)
        await bo.click_Search()
        await page.waitForTimeout(3000)
        await bo.Verify_PagenationCount()
        await page.waitForTimeout(3000)
        await bo.Verify_SearchResult(bodata.Add.username)
    })

})

test.describe(' Verify BO User _ Edit', () => {
    test('Edit searched text', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.Enter_Searchtext(bodata.Add.username)
        await bo.click_Search()
        await page.waitForTimeout(3000)
        await bo.Verify_PagenationCount()
        await bo.Verify_SearchResult(bodata.Add.username)
        await bo.click_EditButton()
        await page.waitForTimeout(3000)
        await bo.Verify_BoEditTitle()
        await bo.enter_FullName(bodata.Edit.fullname)
        await bo.enter_userName(bodata.Edit.username)
        await bo.click_Save()
        await page.waitForTimeout(3000)
        await bo.Verify_ToastPopUp(bodata.message.EditSuccess)
    })
})

test.describe(' Verify BO User _ Reset', () => {

    test('Search and Click Reset', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.Enter_Searchtext(bodata.Edit.username)
        await bo.click_Search()
        await page.waitForTimeout(3000)
        const rowcount1 =await bo.Count_Tabledata()
        await bo.Click_Reset()
        await page.waitForTimeout(3000)
        const rowcount2 =await bo.Count_Tabledata()
        expect(rowcount1).not.toBe(rowcount2); 
    })

})

test.describe(' Verify BO User _ Delete', () => {

    test('Search and Cancel Delete', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.Enter_Searchtext(bodata.Edit.username)
        await bo.click_Search()
        await page.waitForTimeout(3000)
        await bo.Verify_PagenationCount()
        await bo.Verify_SearchResult(bodata.Edit.username)
        await bo.click_DeleteButton()
        await page.waitForTimeout(3000)
        await bo.Cancel_Delete()
        await bo.Verify_SearchResult(bodata.Edit.username)
    
    })

    test('Search and Confirm Delete', async () => {
        const bo = new boUser(page)
        await bo.click_BackOfficeUserMenu()
        await page.waitForTimeout(3000)
        await bo.Verify_BoListUrl()
        await bo.Enter_Searchtext(bodata.Edit.username)
        await bo.click_Search()
        await page.waitForTimeout(3000)
        await bo.Verify_PagenationCount()
        await bo.Verify_SearchResult(bodata.Edit.username)
        await bo.click_DeleteButton()
        await page.waitForTimeout(3000)
        await bo.Confirm_Delete()
        await page.waitForTimeout(3000)
        await bo.Verify_ToastPopUp(bodata.message.DeleteSuccess)
    })

})

