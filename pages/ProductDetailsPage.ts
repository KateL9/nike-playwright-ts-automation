import { Locator, Page, expect } from '@playwright/test';
import BasePage from './BasePage';

export default class ProductDetailsPage extends BasePage {

    public productDetailsButton: Locator;
    private previousButton: Locator;
    private nextButton: Locator;
    private imageContainer: Locator;
    private productImages: Locator;
    private productVideo: Locator;
    private sizeLabelLocators: Locator;
    private sizeInputLocators: Locator;

    constructor(page: Page) {
        super(page);
        this.productDetailsButton = this.page.getByTestId('view-product-details-button');
        this.nextButton = this.page.getByLabel('Next product image');
        this.previousButton = this.page.getByLabel('Previous product image');
        this.imageContainer = this.page.getByTestId('HeroImgContainer');
        this.productImages = this.page.getByTestId('HeroImg');
        this.productVideo = this.page.getByTestId('CarouselVideo');
        this.sizeLabelLocators = this.page.locator('div#size-selector label');
        this.sizeInputLocators = this.page.locator('div#size-selector input');
    }

    async clickNextButton() {
        await this.nextButton.click();
    }
    async clickPreviousButton() {
        await this.previousButton.click()
    }
    async getActiveElementIndex(): Promise<number | null> {
        await this.imageContainer.waitFor({ state: 'visible', timeout: 10000 });
        let elements = this.imageContainer.locator('[data-testid="HeroImg"], [data-testid="CarouselVideo"]');
        for (let i = 0; i < await elements.count(); i++) {
            let element = elements.nth(i);
            let isImageActive = (await element.getAttribute('aria-hidden')) === 'false';
            let isVideoVisible = await element.evaluate((node) => node.style.display === 'block')
            if (isImageActive || isVideoVisible) {
                return i;
            }
        }
        return null;
    }
    async isElementActive(index: number): Promise<boolean> {
        let element = this.imageContainer.locator('[data-testid="HeroImg"], [data-testid="CarouselVideo"]').nth(index);
        let isImageActive = (await element.getAttribute('aria-hidden')) === 'false';
        let isVideoVisible = await element.evaluate((node) => node.style.display === 'block');
        return isImageActive || isVideoVisible;
    }
    async countAvailableElements(): Promise<number> {
        return this.imageContainer.locator('[data-testid="HeroImg"], [data-testid="CarouselVideo"]').count();
    }
    async selectRandomSize(): Promise<string> {
        let sizeCount = await this.sizeLabelLocators.count();
        if (sizeCount === 0) {
            throw new Error("No sizes available to select.");
        }
        let randomIndex = Math.floor(Math.random() * sizeCount);

        // get element by label to click
        let randomSizeLabel = this.sizeLabelLocators.nth(randomIndex);
        await randomSizeLabel.click();
        // get element by input to save size value
        let selectedInput = this.sizeInputLocators.nth(randomIndex);
        let selectedSizeValue = await selectedInput.getAttribute('value');
        return selectedSizeValue || "No value";
    }
    async isSizeMarkedSelected(sizeValue: string): Promise<boolean> {
        let sizeSelector = this.page.locator(`input[value="${sizeValue}"]`);
        let sizeContainer = sizeSelector.locator('..'); // Parent div
        let classAttribute = await sizeContainer.getAttribute('class');
        return classAttribute?.includes('selected') || false;
    }
}