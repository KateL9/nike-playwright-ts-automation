import { Locator, Page, expect } from '@playwright/test';
import BasePage from './BasePage';
import { IFilterOption } from '../interfaces/IFilterOption';

export default class FilterMenuPage extends BasePage {
    private genderDropdown: Locator;
    private priceDropdown: Locator;
    private saleDropdown: Locator;
    private productSubtitle: Locator;
    private productPrice: Locator;
    private salePrice: Locator;

    private genderCounter: Locator;
    public selectedCategoryTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.genderDropdown = this.page.locator('span.Collapsible__trigger:has(div[aria-label="Gender"])');
        this.priceDropdown = this.page.locator('span.Collapsible__trigger:has(div[aria-label="Shop By Price"])');
        this.saleDropdown = this.page.locator('span.Collapsible__trigger:has(div[aria-label="Sale & Offers"])');
        this.productSubtitle = this.page.locator('div.product-card__subtitle[role="link"]');
        this.productPrice = this.page.locator('div.is--current-price');
        this.salePrice = this.page.locator('div.product-price__perc');


        //this.size = this.page.locator('span.Collapsible__trigger div[aria-label="Size"]');
        
        this.genderCounter = this.page.locator('div[aria-label*="Gender"] div.filter-group__count');
        this.selectedCategoryTitle = this.page.locator('h1.wall-header__title');
    }

    // rewrite for generic method
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
    // TO DO: implement deselectFilters()
    async deselectFilters(): Promise<void> {

    }

    // + ? all
    async applyFilter(criterias: IFilterOption): Promise<void> {
        if (criterias.gender) {
            await this.genderDropdown.click();
            await expect(this.genderDropdown).toHaveClass(/is-open/);
            for(let criteria of criterias.gender) {
                let genderCategoryCheckbox = this.page.locator(`[aria-label="Filter for ${criteria}"]`)
                await genderCategoryCheckbox.click();
                await expect(genderCategoryCheckbox).toHaveAttribute("aria-checked", "true");
            }
        }
        if (criterias.price) {
            await this.priceDropdown.click();
            await expect(this.priceDropdown).toHaveClass(/is-open/);
            for(let criteria of criterias.price) {
                let priceRangeCheckbox = this.page.locator(`[aria-label="Filter for ${criteria}"]`)
                await priceRangeCheckbox.click();
                await expect(priceRangeCheckbox).toHaveAttribute("aria-checked", "true");
            }
        }
        if (criterias.sale) {
            await this.saleDropdown.click();
            await expect(this.saleDropdown).toHaveClass(/is-open/);
            let saleCheckbox = this.page.locator(`[aria-label="Filter for Sale"]`)
            await saleCheckbox.click();
            await expect(saleCheckbox).toHaveAttribute("aria-checked", "true");
        }

    }

    // TO DO: separate according to category logic
    async checkFilteredResult(criterias: IFilterOption): Promise<void>{
        let subtitles = await this.productSubtitle.all();
        let gender = criterias.gender;
        let priceRange = criterias.price;
        let sale = criterias.sale;
        
        if (criterias.gender) {
            for(let subtitle of subtitles) {
                // gender men + women
                await expect(subtitle.textContent()).toMatch(`${gender}'s`);
            }
        }

        if (criterias.price) {
            let parsedPrices = criterias.price.map(range => {
                let numbers = range.match(/\d+/g)?.map(Number);
                let filteredPrices = {
                    min: numbers && numbers.length-1 ? numbers[0] : null,
                    max: numbers ? numbers[numbers.length-1] : null
                }
                return filteredPrices
            });
            console.log(parsedPrices);
            for(let priceLocator of await this.productPrice.all()) {
                let priceText = await priceLocator.textContent()
                console.log(priceText);
                let price = Number(priceText.replace('$', ''))

                expect(price).toBeGreaterThanOrEqual(parsedPrices.min);
                expect(price).toBeLessThanOrEqual(parsedPrices.max);
            }
        }
        if (criterias.sale){
            for(let sale of await this.salePrice.all()) {
                let saleText = await sale.textContent();
                expect(saleText).toContain('% off');
            }
        }
    }
}