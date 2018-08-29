/// <reference types="Cypress" />

describe('FAQ', () => {
    it('should load', () => {
        cy.visit('https://laterforreddit.com/faq/');
    });
});
