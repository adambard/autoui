/// <reference types="Cypress" />

export class Home {
    navigate() {
        cy.visit('https://laterforreddit.com/');
        return this;
    }

    getSchedulePostButton() {
        return cy.get('.try-button');
    }

    getCreatePostLinks() {
        return cy.get('body').find('a[href*="/create"]');
    }
}