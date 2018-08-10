/// <reference types="Cypress" />

import { Home } from '../../support/pages/home';

describe('Home Page Behaviour', () => {
    const home = new Home();

    beforeEach(function () {
        home.navigate();
    })

    it('should have a schedule post button', () => {
        const button = home.getSchedulePostButton();
        button
            .should('exist')
            .and('have.attr', 'href')
            .and('include', 'create')
        ;
    });

    it('should have at least 1 create post link', () => {
        home.getCreatePostLinks().then(x =>
            expect(x.length).above(1)
        );
    });
});