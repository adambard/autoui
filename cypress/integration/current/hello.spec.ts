/// <reference types="Cypress" />

describe('Home Page Behaviour', () => {
    beforeEach(function () {
        cy.visit('https://laterforreddit.com/');
    })

    it('should have a schedule post button', () => {
        cy.get('.try-button')
            .should('exist')
            .and('have.attr', 'href')
            .and('include', 'create')
            ;
    });

    it('should have at least 1 create post link', () => {
        cy.get('body')
            .find('a[href*="/create"]')
            .then(
                x => expect(x.length).above(1)
            );
    });
});