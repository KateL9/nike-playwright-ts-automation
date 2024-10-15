import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class FilterMenuPage extends BasePage {
    private gender: Locator;
    private price: Locator;
    private sale: Locator;
    private size: Locator;
    private genderCounter: Locator;
    public selectedCategoryTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.gender = this.page.locator('span.Collapsible__trigger div[aria-label="Gender"]');
        this.price = this.page.locator('span.Collapsible__trigger div[aria-label="Shop By Price"]');
        this.sale = this.page.locator('span.Collapsible__trigger div[aria-label="Sale & Offers"]');
        this.size = this.page.locator('span.Collapsible__trigger div[aria-label="Size"]');
        this.genderCounter = this.page.locator('div[aria-label*="Gender"] div.filter-group__count');
        this.selectedCategoryTitle = this.page.locator('h1.wall-header__title');
    }

    async getGenderCounter():Promise<string> {
        return (await this.genderCounter.innerHTML()).slice(1,-1);
    }

    async verifyCorrectCategoryPage(genderCategory: "Men" | "Women", itemType: "All Shoes" | "All Clothing"): Promise<{ expectedUrl: string, expectedTitle: RegExp }> {
        let genderUrl = genderCategory.toLocaleLowerCase() + 's';
        let itemUrl = itemType.replace("All ", "-").toLowerCase();
        let expectedUrl = genderUrl+itemUrl;
        
        let expectedTitle = new RegExp(`${genderCategory}'s.*${itemType.replace("All ", "")}`, 'i'); // Case-insensitive
        return {expectedUrl, expectedTitle}
    }

}