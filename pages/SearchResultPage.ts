import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class SearchResultPage extends BasePage {
    private searchInput: Locator;
    private firstProductCardTitle: Locator;
    private visibleProductCount: Locator;
    public searchResults: Locator;
    private productCardCounter: Locator;
    private noResults: Locator;
    private firstProductItem: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = this.page.locator('input[type="search"]');
        this.visibleProductCount = this.page.locator('h1 span.wall-header__item_count');
        this.productCardCounter = this.page.locator('[data-testid="product-card"]');
        this.noResults = this.page.locator('span[data-test="no-results-title"]');

        this.firstProductItem = this.page.getByTestId('wall-image-loader').nth(0);
        this.firstProductCardTitle = this.page.locator('div.product-card__title').nth(0);
        this.searchResults = this.page.locator('div.results__body');
    }

    async search(query: string): Promise<void> {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    };

    async getProductCardTitle(): Promise<string> {
        let title =  await this.firstProductCardTitle.innerText();
        return title;
    }

    async getVisibleProductCount(): Promise<number> {
        if (await this.visibleProductCount.isVisible()) {
            let counter = (await this.visibleProductCount.innerText()).slice(1,-1);
            return Number(counter);
        }
        return 0
    }

    async getProductCardCounter(): Promise<number> {
        if (await this.productCardCounter.count() > 0) {
            let productCardCount = await this.productCardCounter.count();
            return productCardCount;
        }
        // Return 0 if no product cards are found
        return 0
    }

    async isNoResults(): Promise<boolean> { 
        try {
            await this.noResults.waitFor({ state: "visible", timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }

    async clickFirstProductItem() {
        await this.firstProductItem.click()
    }
}