/// <reference types="Cypress" />

export class Home {
    navigate() {
        cy.visit('https://laterforreddit.com/');
        return this;
    }
}