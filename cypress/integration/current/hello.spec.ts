/// <reference types="Cypress" />

import { Home } from '../../pages/home';

describe('Home Page Behaviour', () => {
    it('should have a schedule post button', () => {
        const home = new Home();
        home.navigate();
        
    });
});