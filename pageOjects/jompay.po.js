const { expect } = require("@playwright/test");


exports.JompayPage = class JompayPage {
    constructor(page) {
        this.page = page;
        this.riskRuleConfigSubMenu = '(//div[contains(text(),"Jompay Risk Rule Configuration")])[1]';
        this.dailyThresholdAmountField = '//input[@data-test-id="daily_threshold_amount"]';
        this.perTxnAmount = '//input[@data-test-id="per_transaction_amount"]';
        this.dailyTxnCount = '//input[@data-test-id="daily_transaction_count"]';
        this.dailyThresholdAmountOverall = '//input[@data-test-id="daily_threshold_amount_overall"]';
        this.jompaySave = '//button[@id="whitelist-save"]';

        this.jompayPendingTxnSubMenu = '(//div[contains(text(),"Jompay Pending Transaction")])[1]';
        //this.viewJompayPendingTransaction = '//span[contains(text(),"TrnId")]//following::a[1]';
        this.addRemarks = '//input[@id="bank-name"]';
        this.approvedPendingTransaction = '//button[contains(text(),"Approve")]';
        this.rejectedPendingTransaction = '//span[contains(text(),"Reject")]';
        this.jompayFailedTxnSubMenu = '(//div[contains(text(),"Jompay Failed Transaction")])[1]';
        this.confirm = '//button[contains(text(),"Confirm")]';
        this.jompayCustomerWhitelistSubMenu = '(//div[contains(text(),"Jompay Customer Whitelist")])[1]';
        this.jompayWhitelistAddButton = '//span[contains(text(),"Add")]';
        this.mobileNumber = '//input[@name="mobile"]'
        this.payerBankDropdown = '//div[@class="vs__actions"]'
        this.selectPayerBank = '//li[@id="vs3__option-0"]'
        this.whiteListRemarks = '//input[@id="whitelist-remarks"]';
        this.SearchCustomer = '//button[@id="whitelist-search-mobile-number"]'
        this.editWhitelist = '//span[contains(text(),"609849777665")]//following::a[1]'
        this.deleteWhitelist = '//span[contains(text(),"609849777665")]//following::button[1]'
        //this.editRejectedWhitelist = `//span[contains(text(),"Failed${dateTime}")]//following::a[1]`
        this.refundRejectedTransaction = '//button[contains(text(),"Refund")]';
        this.manuallyCreditedRejectedTransaction = '//button[contains(text(),"Manually Credit")]';
    }

    async updateRiskRuleConfig(dailyThresholdAmount, perTxnAmount, dailyTxnCountdContactNumber, dailyThresholdAmountOverall) {
        await this.page.locator(this.riskRuleConfigSubMenu).click();
        await this.page.locator(this.dailyThresholdAmountField).fill(dailyThresholdAmount);
        await this.page.locator(this.perTxnAmount).fill(perTxnAmount);
        await this.page.locator(this.dailyTxnCount).fill(dailyTxnCountdContactNumber);
        await this.page.locator(this.dailyThresholdAmountOverall).fill(dailyThresholdAmountOverall);
        await this.page.locator(this.jompaySave).click();
    }

    async verifyRiskRuleConfig(dailyThresholdAmount, perTxnAmount, dailyTxnCount, dailyThresholdAmountOverall) {
        const verifyDailyThresholdAmount = await this.page.locator(this.dailyThresholdAmountField).inputValue();
        expect(verifyDailyThresholdAmount).toBe(dailyThresholdAmount);
        const verifyPerTxnAmount = await this.page.locator(this.perTxnAmount).inputValue();
        expect(verifyPerTxnAmount).toBe(perTxnAmount);
        const verifyDailyTxnCount = await this.page.locator(this.dailyTxnCount).inputValue();
        expect(verifyDailyTxnCount).toBe(dailyTxnCount);
        const verifyDailyThresholdAmountOverall = await this.page.locator(this.dailyThresholdAmountOverall).inputValue();
        expect(verifyDailyThresholdAmountOverall).toBe(dailyThresholdAmountOverall);
    }

    async viewPendingTransaction(dateTime) {
        const viewJompayPendingTransaction = `//span[contains(text(),"TrnId${dateTime}")]//following::a[1]`;
        await this.page.locator(this.jompayPendingTxnSubMenu).click();
        await this.page.locator(viewJompayPendingTransaction).click();
    }

    async approvePendingTransaction(remarks) {
        await this.page.locator(this.addRemarks).fill(remarks);
        await this.page.locator(this.approvedPendingTransaction).click();
        await this.page.locator(this.confirm).click();
    }

    async rejectPendingTransaction(remarks) {
        await this.page.locator(this.addRemarks).fill(remarks);
        await this.page.locator(this.rejectedPendingTransaction).click();
        await this.page.locator(this.confirm).click();
    }

    async verifyRejectedTransaction() {
        await this.page.locator(this.jompayFailedTxnSubMenu).click();
        await expect(this.rejectedPendingTransaction).toBeVisible;
    }

    async verifyApprovedTransaction() {
        await this.page.locator(this.jompayFailedTxnSubMenu).click();
        await expect(this.approvedPendingTransaction).toBeVisible;
    }

    async addJompayWhitelistCustomer(remarks) {
        await this.page.locator(this.jompayCustomerWhitelistSubMenu).click();
        await this.page.locator(this.jompayWhitelistAddButton).click();
        await this.page.locator(this.mobileNumber).fill("609849777665");
        await this.page.locator(this.SearchCustomer).click();
        await this.page.locator(this.payerBankDropdown).click({ timeout: 2000 });
        await this.page.locator(this.selectPayerBank).click();
        await this.page.locator(this.whiteListRemarks).fill(remarks);
        await this.page.locator(this.jompaySave).click();
    }

    async editJompayWhitelistCustomer(remarks) {
        await this.page.locator(this.jompayCustomerWhitelistSubMenu).click();
        await this.page.locator(this.editWhitelist).click();
        await this.page.locator(this.whiteListRemarks).fill(remarks + "Update");
        await this.page.locator(this.jompaySave).click();
    }

    async deleteJompayWhitelistCustomer() {
        await this.page.locator(this.jompayCustomerWhitelistSubMenu).click();
        await this.page.locator(this.deleteWhitelist).click();
        await this.page.locator(this.confirm).click();
    }

    async refundJompayWhitelistCustomer(dateTime) {
        const editRejectedWhitelist = `//span[contains(text(),"Failed${dateTime}")]//following::a[1]`;
        await this.page.locator(this.jompayFailedTxnSubMenu).click();
        await this.page.locator(editRejectedWhitelist).click();
        await this.page.locator(this.refundRejectedTransaction).click();
        await this.page.locator(this.confirm).click();
    }

    async manuallyCreditJompayWhitelistCustomer(dateTime) {
        const editRejectedWhitelist = `//span[contains(text(),"Failed${dateTime}")]//following::a[1]`;
        await this.page.locator(this.jompayFailedTxnSubMenu).click();
        await this.page.locator(editRejectedWhitelist).click();
        await this.page.locator(this.manuallyCreditedRejectedTransaction).click();
        await this.page.locator(this.confirm).click();
    }

}





