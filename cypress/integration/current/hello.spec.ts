/// <reference types="Cypress" />

import { Home } from '../../support/pages/home';

describe('Home Page Behaviour', () => {
    it('should have a schedule post button', () => {
        const home = new Home().navigate();

        const button = home.getSchedulePostButton();
        button.should('exist');
        button.url().contains('create');
        
    });

    it('should have at least 1 create post link', () => {
        const home = new Home();
        home.navigate();

        //const links = home.getCreatePostLinks().then(x => x.length);
        //expect(links).above(1);

        expect(home.getCreatePostLinks()).to.have.length.greaterThan(1);
        
    });
});