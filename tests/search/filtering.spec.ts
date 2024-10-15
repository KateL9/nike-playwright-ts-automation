import { test, Page, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage';
import FilterMenuPage from '../../pages/FilterMenuPage';

test.describe('Filtering tests', () => {
    test('TestId: 004. User can filter products by category and view the correct results', async ({ page }) => {
        let homePage = new HomePage(page);
        await homePage.goTo('/');
        let category: string = "Men";
        let itemType: string = "All Shoes";
        await homePage.selectCategory(category, itemType);

        let filterMenu = new FilterMenuPage(page);
        let { expectedUrl, expectedTitle } = await filterMenu.verifyCorrectCategoryPage(category, itemType);

        expect(page.url()).toContain(expectedUrl);
        await expect(filterMenu.selectedCategoryTitle).toHaveText(expectedTitle);

        expect(await filterMenu.getGenderCounter()).toEqual('1');
    })
    
})
