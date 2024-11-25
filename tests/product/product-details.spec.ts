import { myTest, expect } from "../../fixtures/baseFixture"
import HomePage from '../../pages/HomePage';
import SearchResultPage from '../../pages/SearchResultPage';
import ProductDetailsPage from '../../pages/ProductDetailsPage';
import { notEqual } from "assert";

myTest('TestId: 007. User can cycle through elements in the product carousel.', async ({ page, productDetailsPage, navigateToProductDetails }) => {
    await navigateToProductDetails();
    let initialIndex = await productDetailsPage.getActiveElementIndex();

    await page.waitForLoadState('networkidle');
    await productDetailsPage.clickNextButton();
    let actualIndex = await productDetailsPage.getActiveElementIndex();
    expect.soft(actualIndex).not.toEqual(initialIndex);

    await productDetailsPage.clickPreviousButton();
    actualIndex = await productDetailsPage.getActiveElementIndex();
    expect.soft(actualIndex).toEqual(initialIndex);
})
myTest('TestId: 008. Checking carousel updates the active state when navigating elements.', async ({ page, productDetailsPage, navigateToProductDetails }) => {
    await navigateToProductDetails();
    let initialIndex = await productDetailsPage.getActiveElementIndex();
    expect.soft(initialIndex).not.toBeNull();
        
        await page.waitForLoadState('networkidle');
        // Click the "Next" button and check if the next element becomes active
        await productDetailsPage.clickNextButton();
        let allElementsNumber = await productDetailsPage.countAvailableElements();
        // if next element goes beyond the last element in the carousel, it wraps back around to index 0 element
        let nextIndex = (initialIndex + 1) % allElementsNumber;
    
        // Verify the new active element and previous element status
        expect(await productDetailsPage.isElementActive(nextIndex)).toBe(true);
        expect(await productDetailsPage.isElementActive(initialIndex)).toBe(false);

    })
    
myTest('TestId: 009. Verify that a user can select a product size', async ({ page, productDetailsPage, navigateToProductDetails }) => {
    await navigateToProductDetails();
    await page.waitForLoadState('networkidle');
    
    let randomlySelectedSize = await productDetailsPage.selectRandomSize();
    let isSizeMarkedSelected = await productDetailsPage.isSizeMarkedSelected(randomlySelectedSize);
    
    expect(isSizeMarkedSelected).toBeTruthy();

})
    
myTest('TestId: 010. User can add product to favourite', async ({ page }) => {
        
})

