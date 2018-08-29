/// <reference types="Cypress" />

import '../../support/commands';

describe('Content Creation Form', () => {

    describe('Pre-login stash feature', () => {
        it('Works', () => {
            cy.clearCookies();
            cy.visit('https://dashboard.laterforreddit.com/content/create/');

            cy.get('.title-field > input').type('Post Title');
            cy.get('.link-field > input').type('http://laterforreddit.com/{enter}');

            cy.get('.login > a').should('contain', 'Sign In with Reddit');

            cy.get('.subreddit-field > input').type('redditlater');

            cy.get('.loading-button').click();

            cy.logInViaReddit();
            cy.visit('https://dashboard.laterforreddit.com/');

            // TODO: Login with a fresh user to see this work, or just fix it
        });
    });

});
