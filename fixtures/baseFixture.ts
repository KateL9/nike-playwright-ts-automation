import {test as baseTest, expect} from '@playwright/test';
import HomePage from '../pages/HomePage';
import SearchResultPage from '../pages/SearchResultPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';

type MyFixture = {
    homePage: HomePage;
    searchResultPage: SearchResultPage;
    productDetailsPage: ProductDetailsPage;
    navigateToProductDetails: () => Promise<void>;
}

export const myTest = baseTest.extend<MyFixture>({
    homePage: async({page}, use) => {
        let homePage = new HomePage(page);
        await use(homePage);
    },
    searchResultPage: async({page}, use) => {
        let searchResultPage = new SearchResultPage(page);
        await use(searchResultPage);
    },
    productDetailsPage: async({page}, use) => {
        let productDetailsPage = new ProductDetailsPage(page);
        await use(productDetailsPage);
    },
    navigateToProductDetails: async({homePage, searchResultPage, productDetailsPage}, use) => {
        let navigateToProductDetails = async () => {
            await homePage.goTo('');
            await homePage.clickSearch();
            await expect(homePage.searchResultContainer).toBeVisible();

            const validSearchQuery = 'air max plus';
            await searchResultPage.search(validSearchQuery);
            await searchResultPage.clickFirstProductItem();

            await expect(productDetailsPage.productDetailsButton).toBeVisible();
        };

        await use(navigateToProductDetails);
    },
});

export { expect } from '@playwright/test';
