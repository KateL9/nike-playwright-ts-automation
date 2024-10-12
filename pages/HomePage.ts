import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class HomePage extends BasePage {
    private searchButton: Locator;
    private loginButton: Locator;
    private cartButton: Locator;
    private favouritesButton: Locator;
    public searchResultContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.searchButton = this.page.locator('div.search-input-container');
        this.loginButton = this.page.locator('li button.profile-link');
        this.cartButton = this.page.locator('a.nav-bag-icon');
        this.favouritesButton = this.page.locator('a[aria-label="Favourites"]');
        this.searchResultContainer = this.page.locator('[data-testid="visual-search-results-container"]>div.is-opened');
    }

    async clickSearch(): Promise<void> {
        await this.searchButton.click()
    }
}