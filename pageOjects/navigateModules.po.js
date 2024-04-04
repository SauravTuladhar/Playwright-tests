const { expect } = require("@playwright/test");


exports.NavigateModules = class NavigateModules {
    constructor(page) {
        this.page = page;
        this.sideMenuList = '//aside//following::a';
    }

    async sideMenu() {
        const menuItems = await this.page.$$(this.sideMenuList);
        return menuItems;
    }

}
