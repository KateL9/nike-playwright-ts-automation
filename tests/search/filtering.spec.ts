import { test, Page, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage';
import FilterMenuPage from '../../pages/FilterMenuPage';
import { Gender } from '../../enums/Gender';
import { IFilterOption } from '../../interfaces/IFilterOption';
import { Price } from '../../enums/Price';

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
    });
    test('TestId: 005. User can filter shoes products by gender, price range, and sale', async ({ page }) => {
        let homePage = new HomePage(page);
        await homePage.goTo('w/shoes-y7ok');
        
        let filterMenu = new FilterMenuPage(page);
        let filterCriteria:IFilterOption = {
            gender: [Gender.Women, Gender.Men],
            price: [Price.Range150_220],
            sale: true,
        };
        await filterMenu.applyFilter(filterCriteria);
        await filterMenu.checkFilteredResult(filterCriteria);
    })
    test('TestId: 006. User can filter clothing products by gender, price range, and sale', async ({ page }) => {
        let homePage = new HomePage(page);
        await homePage.goTo('w/clothing-6ymx6');
        
        let filterMenu = new FilterMenuPage(page);
        let filterCriteria:IFilterOption = {
            gender: [Gender.Women, Gender.Men],
            price: [Price.Range150_220, Price.Range220],
            sale: true,
        };
        await filterMenu.applyFilter(filterCriteria);
        await filterMenu.checkFilteredResult(filterCriteria);
    })
})
