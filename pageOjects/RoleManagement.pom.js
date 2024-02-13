import { expect } from "@playwright/test";




export class RoleManagement {

    constructor(page) {

        this.page = page;
        this.roleMenu = page.locator("//a[@href='/role-management']");

        //add role
        this.add_button = page.locator("//a[@id='table-add']");
        this.name_field = page.locator("//input[@id='role-name']");
        this.name_validation = page.locator("//label[@for='role-name']//following::div[1]")
        this.deccription = page.locator("//textarea[@id='role-description']");
        this.active_status = page.locator("//label[normalize-space()='Active']//following::div[1]");
        this.task_action_validation = page.locator("//button[@id='role-save']//preceding::div[1]")
        this.save_button = page.locator("//button[@id='role-save']")
        this.cancel_button = page.locator("//a[@id='role-cancel']")
        this.toast_message = page.locator("//div[@role='alert']")

        //task action
        this.check_all_task_action = page.locator("//input[@id='role-all-update']")
        this.all_checkbox = page.$$("//input[@id='role-all-update']//following::input[@type='checkbox']")

        //search

        this.search_input = page.locator("//input[@placeholder='Search ...']")
        this.search_button = page.locator("//button[@id='table-search']")
        this.reset_button = page.locator("//button[@id='table-reset']")


        //table:

        this.table = page.locator("//table")
        this.edit_role = page.locator('a')
        this.delete_role = page.locator('button')
        this.table_text_fields = page.$$('tbody tr td span')


        //Duplicate value for permissionpolicy

        this.delete_confirm = page.locator("//button[@id='popup-save']");
        this.delete_cancel = page.locator("//button[@id='popup-cancel']")


    }

    async openRoleManagementPage() {
        await this.roleMenu.click();
    }

    async clickAddRoleButton() {
        await this.add_button.waitFor({State:"Visible"})
        await this.add_button.click();

    }

    async inputRoleName(name) {
        await this.name_field.waitFor({State:"Visible"})
        await this.name_field.fill(name);

    }

    async inputRoledescription(description) {
        await this.deccription.fill(description);

    }

    async checkRoleStatus() {
        await this.active_status.click();
    }

    async checkAllCheckBox() {
        await this.check_all_task_action.waitFor({State:"Visible"})
        await this.check_all_task_action.check();

    }

    async verifyCheckAllCheckbox() {
        await expect(await this.check_all_task_action).toBeChecked();
        const checkboxes = await this.page.$$("//input[@id='role-all-update']//following::input[@type='checkbox']")
        for (let i = 0; i < checkboxes.length; i++) {
            await expect(checkboxes[i]).toBeChecked;          
        }

    }

    async clickSaveButton() {
        await this.save_button.click()
    }

    async roleNameFieldValidation() {
        await expect(this.name_validation).toBeVisible()
    }

    async roleTaskFieldValidation() {
        await expect(this.task_action_validation).toBeVisible()
    }

    async searchRole(searchelement) {
        await this.search_input.fill(searchelement);
        await this.search_button.click();
    }

    async verifyToastMessage() {
        await this.page.waitForTimeout(1000)
        // await this.toast_message.waitFor({State:"Visible"})
        await expect(this.toast_message).toBeVisible();
    }

    async verifyToastMessageContent() {
        const toastmessagecontent = await this.toast_message.textContent();
        return toastmessagecontent;
    }

    // async verifyDataInTable(rolename) {
    //     await this.page.waitForTimeout(3000)
    //     const matchedrowdata = await this.roleManagementDataTable(rolename)
    //     if (matchedrowdata == false) {
    //         console.log("Data doesnot exist in table")
    //     }
    //     else {
    //         console.log("Data exists in the table")
    //         console.log(matchedrowdata)
    //     }
    // }


    async verifyResetButton() {
        await this.reset_button.click()
        await expect(this.search_input).toBeEmpty();

    }


    async verifyRoleManagementDataTable(roleName, roleDescription, roleStatus) {

        await this.page.waitForTimeout(5000)
        const tableRoleName = await this.page.$$('//tbody/tr/td[1]/child::span')
        const tableRoleDescription = await this.page.$$('//tbody/tr/td[2]/child::span')
        const tableRoleStatus = await this.page.$$('//tbody/tr/td[3]')
        const tableNameData = [];
        const tableDescriptionData =[];
        const tableStatusData =[];


        for (let i = 0; i < tableRoleName.length; i++) {
            const data = await tableRoleName[i].textContent();
            tableNameData.push(data)
        }

        await expect(tableNameData).toContainEqual(roleName)
        
        if(tableNameData.includes(roleName)){
            var indexIntable = await tableNameData.indexOf(roleName);

            for (let i = 0; i < tableRoleDescription.length; i++) {
                const data = await tableRoleDescription[i].textContent();
                tableDescriptionData.push(data) 
            }
            await expect(tableDescriptionData[indexIntable]).toEqual(roleDescription)
    
            for (let i = 0; i < tableRoleStatus.length; i++) {
                const data = await tableRoleStatus[i].textContent();
                tableStatusData.push(data)
            }
    
            await expect(tableStatusData[indexIntable]).toEqual(roleStatus)


            return indexIntable
            
        }
    }

    async verifyEditRole(rolename, roleDescription, roleStatus){
        const rolemanagementdata = await this.verifyRoleManagementDataTable(rolename,roleDescription,roleStatus);
        const editbutton = await this.page.$$("//tbody/tr/td[5]//a")
        await editbutton[rolemanagementdata].click();

    }

    async verifyDeleteRole(rolename, roleDescription, roleStatus){
        const rolemanagementdata = await this.verifyRoleManagementDataTable(rolename,roleDescription,roleStatus);
        const deletebutton = await this.page.$$("//tbody/tr/td[5]//button")
        await deletebutton[rolemanagementdata].click();
        await this.delete_confirm.click()


    }



    // async roleManagementDataTableignore(rolename, roleDescription) {
    //     await this.table.waitFor({State:"Visible"})
    //     const table = await this.table
    //     const row1 = await this.page.locator("//tbody/tr/td[1]")
    //     const row2 =await this.page.locator("//tbody/tr/td[2]")

    //         const matchedRow = (row1 && row2).filter({
    //             has: this.page.locator('td'),
    //             hasText: rolename && roleDescription
    //         });
    //         return matchedRow
          
    //     // }
    //     // else {
    //     //     var matchedRow = ""
    //     //     return matchedRow = false;
    //     // }
    // }


    // async verifyEditRole(rolename,roleDescription,) {
    //     const editmatchedrow = await this.roleManagementDataTableignore(rolename, roleDescription)
    //         await editmatchedrow.locator('a').click();
    //         await this.page.waitForTimeout(4000)
    //         await this.inputRoleName(test_data['Edited Role Name'])
    //         // await this.verifyCheckAllCheckbox();
    //         await this.clickSaveButton();
    //         await this.page.waitForTimeout(2000)
    //         await expect(this.verifyToastMessage()).toBeTruthy()
    //         await expect(await this.verifyToastMessageContent()).toEqual(test_data['Toast message']["Edited sucessfull"])          
        
    // }

    // async verifyDeleteRole(rolename) {
    //     const deletematchedrow = await this.roleManagementDataTable(rolename)

    //     if (deletematchedrow == false) {
    //         console.log("Data doesnot exist in table")
    //     }

    //     else {
    //         await deletematchedrow.locator('button').click()
    //         await this.page.waitForTimeout(4000)
    //         await this.delete_confirm.click()
    //         await this.page.waitForTimeout(1000);
    //         await expect(this.verifyToastMessage()).toBeTruthy()
    //         await expect(await this.verifyToastMessageContent()).toEqual(test_data["Toast message"]["Delete Sucessfull"])            
    //     }
    // }
}