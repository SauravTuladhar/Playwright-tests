const { expect } = require("@playwright/test");


exports.BrandPage = class BrandPage {
    constructor(page) {
        this.page = page;
        this.brandSubMenu = '(//div[contains(text(),"Brand")])[1]';
        this.brandSearchField = '//input[@placeholder="Search ..."]';
        this.brandSearchButton = '//button[contains(text(),"Search")]';
        this.brandSearchBlistValidation = '(//div[contains(text(),"Brand")])[2]//following::span[2]';
        this.brandListView = '(//div[contains(text(),"Brand")])[2]//following::table';
        this.brandAddButton = '//span[contains(text(),"Add")]';
        this.brandNameField = '//label[contains(text(),"Brand Name")]//following::Input[1]';
        this.brandContactPersonField = '//label[contains(text(),"Contact Person")]//following::Input[1]';
        this.brandContactNumberField = '//label[contains(text(),"Contact Number")]//following::Input[1]';
        this.brandPartnershipCodeField = '//label[contains(text(),"Partnership Code")]//following::Input[1]';
        this.brandIsActive = '//label[contains(text(),"Is Active ?")]//following::div[1]';
    }

    async brandSearch(brandSearch, brandSearchValidation) {
        await this.page.waitForTimeout(3000);
        await this.page.locator(this.brandSubMenu).click();
        await this.page.locator(this.brandSearchField).fill(brandSearch);
        await this.page.locator(this.brandSearchButton).click();
        const brandSearchList = await this.page.locator(this.brandSearchBlistValidation);
        await expect(brandSearchList).toHaveText(brandSearchValidation);
    }

    async brandView() {
        const brandList = await this.page.locator(this.brandListView);
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.brandSubMenu).click();
        await expect(brandList).toBeVisible;
    }

    async brandAdd(brandName, brandContactPerson, brandContactNumber, brandPartnershipCode) {
        await this.page.waitForTimeout(5000);
        await this.page.locator(this.brandSubMenu).click();
        await this.page.locator(this.brandAddButton).click();
        await this.page.locator(this.brandNameField).fill(brandName);
        await this.page.locator(this.brandContactPersonField).fill(brandContactPerson);
        await this.page.locator(this.brandContactNumberField).fill(brandContactNumber);
        await this.page.locator(this.brandPartnershipCodeField).fill(brandPartnershipCode);
        await this.page.locator(this.brandIsActive).click();
    }
}





