import { Page } from '@playwright/test';

export default class BasePage {
    protected page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async goTo(url: string) {
        await this.page.goto(url);
    }
}