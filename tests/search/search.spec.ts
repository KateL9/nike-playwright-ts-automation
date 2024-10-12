import { test, Locator, Page, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage';
import SearchResultPage from '../../pages/SearchResultPage';

test.describe('Search functionality', () => {
    test('TestId: 001. User can search for a product and view results', async ({ page }) => {
        let homePage = new HomePage(page);
        await homePage.goTo('/');
        await homePage.clickSearch();
        await expect(homePage.searchResultContainer).toBeVisible();

        let search = new SearchResultPage(page);
        let validSearchQuery = 'air max plus';
        await search.search(validSearchQuery);

        await expect(search.searchResults).toBeVisible();
        // Check if the first product matches the search query
        let firstProductTitle = (await search.getProductCardTitle()).toLowerCase();
        expect(firstProductTitle).toContain(validSearchQuery);
    });

    // TO DO: to add test: to check all found product cards matches the search query: locator 'product-card' count + scroll + loop 
    test('TestId: 002. Product counter matches number of product cards displayed in the search result', async ({ page }) => {
        let homePage = new HomePage(page);
        await homePage.goTo('/');
        await homePage.clickSearch();
        await expect(homePage.searchResultContainer).toBeVisible();

        let search = new SearchResultPage(page);
        let validSearchQuery = 'Nike Air Force 1 Sage Low';
        await search.search(validSearchQuery);
        let count = await search.getVisibleProductCount();
        let productCardCount = await search.getProductCardCounter();
        expect(productCardCount).toBe(count);
    })

    test('TestId: 003. No results are displayed for invalid search input', async({ page }) => {
        let homePage = new HomePage(page);
        await homePage.goTo('/');
        await homePage.clickSearch();
        await expect(homePage.searchResultContainer).toBeVisible();

        let search = new SearchResultPage(page);
        let invalidSearchQuery = '-----';
        await search.search(invalidSearchQuery);

        let noResults = await search.isNoResults();
        expect(noResults).toBeTruthy();
    })
})

/*
Parameterization:

let searchQueries: string[] = ['air max plus', 'air force 1', '----'];
for (let query of searchQueries) {
    await test.step(`Search for ${query}`, async () => {
        await search.search(query);
        assert search results
    });
}
*/