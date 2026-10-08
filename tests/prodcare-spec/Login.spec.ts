import { test } from '@playwright/test';
import { appUrls } from 'playwright.config';
import loginData from  '../fixture/testdata/Login-Credentials.json'
import { PageManager } from 'page-manager/Page-Manager';



test.beforeEach(async ({ page }) => {

    await page.goto(appUrls.loginURL);

});


test.describe('login page with valid crenditals ',()=>{
    test('Login ', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.loginPage.loginPageCredentials(
            loginData.adminCredentials.organisation,
            loginData.adminCredentials.username,
            loginData.adminCredentials.password,
            false,
            false
        );

        await pm.loginPage.SignOutPage();
        
    })
})