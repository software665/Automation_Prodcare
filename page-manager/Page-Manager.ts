import { Page } from "@playwright/test";

import { LoginPage } from "page-object/menu-screen/login/Login-Page";



export class PageManager {

    readonly loginPage :LoginPage;


    constructor(page:Page) {
        this.loginPage = new LoginPage(page);

    }

}