const { expect } = require("@playwright/test");


exports.NavigateModules = class NavigateModules {
    constructor(page) {
        this.page = page;
        this.sideMenuList = '//aside//following::a';
        this.sideMenuModuleList = '//aside//following::div[6]/div/div';
    }

    async sideMenu() {
        const menuItems = await this.page.$$(this.sideMenuList);
        return menuItems;
    }

    async sideMenuModule() {
        const moduleMenuItems = await this.page.$$(this.sideMenuModuleList);
        return moduleMenuItems;
    }
}
