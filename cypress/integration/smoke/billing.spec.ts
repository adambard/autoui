/// <reference types="Cypress" />

import '../../support/commands';

describe('Billing Pages', () => {

    describe('Subscription Picker', () => {
        before(() => {
            cy.logInViaReddit();
            Cypress.Cookies.preserveOnce('ring-session');
        });

        it('Shows options', () => {
            cy.visit('https://dashboard.laterforreddit.com/settings/subscription/');

            cy.get('.button').click();

            cy.get('.plan-chooser > :nth-child(1) > .plan > .plan-name').should('contain', 'Reddit Enthusiast');
            cy.get('.plan-chooser > :nth-child(2) > .plan > .plan-name').should('contain', 'Content Creator');
            cy.get('.plan-chooser > :nth-child(3) > .plan > .plan-name').should('contain', 'Unlimited');
            cy.get('.plan-chooser > :nth-child(4) > .plan > .plan-name').should('contain', 'Content Creator Annual');

            // Make sure card isn't present!!!
            cy.get('.payment-table > p').should('contain', 'No saved payment information');

            cy.get(':nth-child(4) > .plan-choose > .button').click();

            cy.get('.card-entry-modal').should('exist');
            cy.get('.card-entry-plan > .plan > .plan-name').should('contain', 'Content Creator Annual');
            cy.get('.email-field > input').should('exist');
        });
    });
});
