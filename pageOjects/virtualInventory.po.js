const { expect } = require("@playwright/test");


exports.VirtualInventoryPage = class VirtualInventoryPage {
    constructor(page) {
        this.page = page;
        this.virtualBufferSubMenu = '(//div[contains(text(),"Virtual Buffer Setup")])[1]';
        this.viCountrySearchField = '//input[@placeholder="Select option"]';
        this.viSelectCountry = '//input[@placeholder="Select option"]//following::li';
        this.currencyBUfferAdd = '//a[@id="currency-buffer-add"]';
        this.currencyBufferLimit = '//input[@id="currency-buffer-limit"]';
        this.virtualStockInventorySubMenu = '(//div[contains(text(),"Virtual Stock Inventory")])[1]';
        this.virtualStockInventoryEdit = '//td[contains(text(),"South Korean Won")]//following::button[2]';


        this.brandSearchButton = '//button[contains(text(),"Search")]';
        this.brandSearchBlistValidation = '(//div[contains(text(),"Brand")])[2]//following::span[2]';
        this.virtualBufferListView = '//div[contains(text(),"Currency Buffer")]//following::table';
        this.virtualInventoryAddButton = '//span[contains(text(),"Add")]';
        this.brandNameField = '//input[@id="brand-name"]';
        this.brandContactPersonField = '//input[@id="brand-contact-person"]';
        this.brandContactNumberField = '//input[@id="brand-contact-number"]';
        this.brandPartnershipCodeField = '//input[@id="brand-partnership-code"]';
        this.brandIsActive = '//button[@id="switch-is-active"]';
        this.editBrand = '//span[contains(text(),"Test brand")]//following::a[1]';
        this.currencyBufferSave = '//button[@id="currency-buffer-save"]';
        this.deleteBrand = '//span[contains(text(),"Test brand delete")]//following::button[1]'; 
        this.confirmDelete = '//button[contains(text(),"Confirm")]';

    }

    async virtualBufferView() {
        const virtualBufferList = await this.page.locator(this.virtualBufferListView);
        await this.page.locator(this.virtualBufferSubMenu).click();
        await expect(virtualBufferList).toBeVisible;
    }

    async virtualInventoryAdd(countryName, limit) {
        await this.page.locator(this.virtualBufferSubMenu).click();
        await this.page.locator(this.virtualInventoryAddButton).click();
        await this.page.locator(this.viCountrySearchField).fill(countryName);
        await this.page.locator(this.viSelectCountry).click();
        await this.page.locator(this.currencyBUfferAdd).click();
        await this.page.locator(this.currencyBufferLimit).fill(limit);
        await this.page.locator(this.currencyBufferSave).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.virtualStockInventorySubMenu).click();
        await this.page.locator(this.virtualStockInventoryEdit).click();
        await this.page.locator(this.viCountrySearchField).click();
        await this.page.waitForTimeout(2000);
        const bufferData = await this.page.locator(this.viSelectCountry).textContent();
        await expect(limit).toEqual(bufferData);
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





