import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class HomePage extends BasePage {
    private searchButton: Locator;
    private loginButton: Locator;
    private cartButton: Locator;
    private favouritesButton: Locator;
    public searchResultContainer: Locator;

    private category: Locator;

    constructor(page: Page) {
        super(page);
        this.searchButton = this.page.locator('div.search-input-container');
        this.loginButton = this.page.locator('li button.profile-link');
        this.cartButton = this.page.locator('a.nav-bag-icon');
        this.favouritesButton = this.page.locator('a[aria-label="Favourites"]');
        this.searchResultContainer = this.page.locator('[data-testid="visual-search-results-container"]>div.is-opened');

        // Main Navigation menu
        this.category = this.page.locator('ul[role="menu"]');
    }

    async clickSearch(): Promise<void> {
        await this.searchButton.click()
    }

    async selectCategory(genderCategory: "Men" | "Women", itemType: "All Shoes" | "All Clothing" ): Promise<void> {

        let categoryLocator = this.category.locator(`a[href="https://www.nike.com/ca/${genderCategory.toLocaleLowerCase()}"]`);
        await categoryLocator.hover();

        let attribute = await (this.page.locator(`summary[aria-label="${genderCategory} menu"]`)).getAttribute('aria-expanded');
        if (attribute == 'true') {
            let itemTypeLocator = this.page.locator(`//a[contains(text(), "${genderCategory}")]/following-sibling::details//a[.//p[contains(text(), "${itemType}")]]`);
            await itemTypeLocator.click();
        }
    }
}