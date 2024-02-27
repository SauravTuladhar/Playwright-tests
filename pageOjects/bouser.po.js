const { expect } = require('@playwright/test');


exports.boUser = class boUser {

  constructor(page) {

    this.page = page
    this.bouser_menu = page.getByRole('link', { name: 'Back-Office User' })
    this.usertype_dropdown = page.locator("//ul['#vs1__listbox']//li[text()=option]")
    this.click_Addbouser = page.locator('#table-add')
    this.usertype_dropdown = page.locator('#bouser-type')
    this.usertype_dropdownitems = page.locator("//ul['#vs1__listbox']//li[text()='Back Office User(Admin)']")
    this.fullname_textfield = page.locator('//input[@id="bouser-full-name"]')
    this.username_textfield = page.locator('#bouser-user-name')
    this.phonenumber_textfield = page.locator('#bouser-phone-number')
    this.status_dropdown = page.locator('#bouser-status')
    this.status_dropdownitems = page.locator("//ul['#vs2__listbox']//li[text()='Active']")
    this.radiobutton_Testrole = page.locator("//input[@type='radio']//following::label[text()='Test role']")
    this.save_button = page.locator('#bouser-save')
    this.cancel_button = page.locator('#bouser-cancel')
    this.toast_text = page.locator("//div[@Class='Vue-Toastification__container top-right']//div//div[@role='alert']")
    this.search_text = page.getByPlaceholder('Search ...')
    this.search_button = page.locator('#table-search')
    this.search_resultcount = page.locator("//p['.ml-auto']")
    this.searchResult_Username = page.locator("//th[@scope='col'][1]//following::span[1]")
    this.searchResult_Fullname = page.locator("//th[@scope='col'][1]//following::span[2]")
    this.click_Edit = page.locator('#table-edit')
    this.edit_titletext = page.locator("//div['.font-bold text-gray-800']//[text(),'User: Edit')]")
    this.delete_button=page.locator("#table-delete")
    this.delete_save=page.locator("#popup-save")
    this.delete_cancel=page.locator("#popup-cancel")
    this.reset_search=page.locator('#table-reset')
    this.table_rowdata=page.locator('//table//tr')

    //Validation message
    this.validationmessage_usertype=page.locator("//label[@for='bouser-type']//following::div[@class='text-red-600'][1]")
    this.validationmessage_fullname=page.locator("//label[@for='bouser-full-name']//following::div[@class='text-red-600'][1]")
    this.validationmessage_username=page.locator("//label[@for='bouser-user-name']//following::div[@class='text-red-600'][1]")
    this.validationmessage_phonenumber=page.locator("//label[@for='bouser-phone-number']//following::div[@class='text-red-600'][1]")
    this.validationmessage_status=page.locator("//label[@for='bouser-status']//following::div[@class='text-red-600'][1]")
    //End Validation message

  }

   async Count_Tabledata() {
     return await (this.table_rowdata).count()
   }


  async ValidationMsg_status() {
    await expect(this.validationmessage_status).toHaveText("Status is required")
  }

  async ValidationMsg_phonenumber() {
    await expect(this.validationmessage_phonenumber).toHaveText("Phone Number is required")
  }


  async ValidationMsg_username() {
    await expect(this.validationmessage_username).toHaveText("Username is required")
  }
  

  async ValidationMsg_fullname() {
    await expect(this.validationmessage_fullname).toHaveText("Name is required")
  }


  async ValidationMsg_Usertype() {
    await expect(this.validationmessage_usertype).toHaveText("User type is required")
  }

  async Click_Reset() {
    await (this.reset_search).click()
  }

  async Cancel_Delete() {
    await (this.delete_cancel).click()
  }

  async Confirm_Delete() {
    await (this.delete_save).click()
  }

  async click_DeleteButton() {
    await (this.delete_button).click()
  }

  async Verify_BoEditTitle() {
    await (this.edit_titletext)

  }

  async click_EditButton() {
    await (this.click_Edit).click()
  }

  async Verify_SearchResult(username,fullname) {
    await expect(this.searchResult_Username).toHaveText(username)
    await expect(this.searchResult_Fullname).toHaveText(fullname)
  }

  async Verify_PagenationCount() {
    await expect(this.search_resultcount).toHaveText('1 - 1 of 1 items')
  }

  async click_Search() {
    await (this.search_button).click()

  }

  async Enter_Searchtext(searchText) {
    await (this.search_text).fill(searchText)
  }

  async Verify_ToastPopUp(message) {
    await expect(this.toast_text).toHaveText(message)
  }

  async click_Cancel() {
    await (this.cancel_button).click()
  }

  async click_Save() {
    await (this.save_button).click()
  }

  async Select_Role() {
    await (this.radiobutton_Testrole).click()
  }

  async click_statusDropdownItems() {
    await (this.status_dropdownitems).click()
  }

  async click_status() {
    await (this.status_dropdown).click()
  }

  async enter_PhoneNumber(ph) {
    await (this.phonenumber_textfield).fill(ph)
  }

  async enter_userName(username) {
    await (this.username_textfield).fill(username)
  }


  async enter_FullName(fullname) {
    await (this.fullname_textfield).fill(fullname)
  }

  async click_userTypeDropdownitems() {
    await (this.usertype_dropdownitems).click()
  }

  async click_UserType() {
    await (this.usertype_dropdown).click({ timeout: 5000 })
  }

  async Verify_BoAddURL() {
    const vurl = this.page.url();
    //console.log("Path for Bo User Add" + vurl);
    expect(vurl).toContain('/user-management/bouser/add/', { timeout: 30000 });
  }

  async click_AddboUserMenu() {
    await (this.click_Addbouser).click({ timeout: 3000 })
  }

  async Verify_BoListUrl() {
    const vurl = this.page.url();
    //console.log("Path for BO List" + vurl);
    expect(vurl).toContain('/user-management/bouser', { timeout: 30000 });

  }

  async click_BackOfficeUserMenu(page) {
    await (this.bouser_menu).click();
  }

}