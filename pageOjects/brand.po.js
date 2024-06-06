const { expect } = require("@playwright/test");


exports.BrandPage = class BrandPage {
    constructor(page) {
        this.page = page;
        this.brandSubMenu = '(//div[contains(text(),"Brand")])[1]';
        this.setupModule = '//div[contains(text(),"Setup")]';
        this.brandSearchField = '//input[@placeholder="Search ..."]';
        this.brandSearchButton = '//button[contains(text(),"Search")]';
        this.brandSearchBlistValidation = '(//div[contains(text(),"Brand")])[2]//following::span[2]';
        this.brandListView = '(//div[contains(text(),"Brand")])[2]//following::table';
        this.brandAddButton = '//span[contains(text(),"Add")]';
        this.brandNameField = '//input[@id="brand-name"]';
        this.brandContactPersonField = '//input[@id="brand-contact-person"]';
        this.brandContactNumberField = '//input[@id="brand-contact-number"]';
        this.brandPartnershipCodeField = '//input[@id="brand-partnership-code"]';
        this.brandIsActive = '//button[@id="switch-is-active"]';
        this.editBrand = '//span[contains(text(),"Test brand")]//following::a[1]';
        this.brandSave = '//button[@id="brand-save"]';
        this.deleteBrand = '//span[contains(text(),"Test brand delete")]//following::button[1]'; 
        this.confirmDelete = '//button[contains(text(),"Confirm")]';

    }

    async selectModule() {
        await this.page.locator(this.setupModule).click();
    }

    async brandSearch(brandSearch, brandSearchValidation) {
        await this.page.locator(this.brandSubMenu).click();
        await this.page.locator(this.brandSearchField).fill(brandSearch);
        await this.page.locator(this.brandSearchButton).click();
        const brandSearchList = await this.page.locator(this.brandSearchBlistValidation);
        await expect(brandSearchList).toHaveText(brandSearchValidation);
    }

    async brandView() {
        const brandList = await this.page.locator(this.brandListView);
        await this.page.locator(this.brandSubMenu).click();
        await expect(brandList).toBeVisible;
    }

    async brandAdd(brandName, brandContactPerson, brandContactNumber, brandPartnershipCode) {
        await this.page.locator(this.brandSubMenu).click();
        await this.page.locator(this.brandAddButton).click();
        await this.page.locator(this.brandNameField).fill(brandName);
        await this.page.locator(this.brandContactPersonField).fill(brandContactPerson);
        await this.page.locator(this.brandContactNumberField).fill(brandContactNumber);
        await this.page.locator(this.brandPartnershipCodeField).fill(brandPartnershipCode);
        await this.page.locator(this.brandIsActive).click();
        await this.page.locator(this.brandSave).click();
    }

    async brandEdit() {
        await this.page.locator(this.brandSubMenu).click();
        await this.page.locator(this.editBrand).click();
        await this.page.locator(this.brandNameField).fill("Update");
        await this.page.locator(this.brandSave).click();
    }

    async brandDelete() {
        await this.page.locator(this.brandSubMenu).click();
        await this.page.locator(this.deleteBrand).click();
        await this.page.locator(this.confirmDelete).click();
    }

}





