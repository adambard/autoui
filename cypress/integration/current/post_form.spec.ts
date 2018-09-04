/// <reference types="Cypress" />

import '../../support/commands';

describe('Content Creation Form', () => {

    describe('Pre-login stash feature', () => {
        it('Works', () => {
            cy.clearCookies();

            cy.fixture('post.json').then((posts: Array<{ title: string, link: string }>) => {
                posts.forEach(({ title, link }) => {
                    cy.visit('https://dashboard.laterforreddit.com/content/create/');
                    cy.get('.title-field > input').type(title);
                    cy.get('.link-field > input').type(link + '{enter}');

                    cy.get('.login > a').should('contain', 'Sign In with Reddit');

                    cy.get('.subreddit-field > input').type('redditlater');

                    cy.get('.loading-button').click();
                });
            });

            cy.logInViaReddit();
            cy.visit('https://dashboard.laterforreddit.com/');

            // TODO: Login with a fresh user to see this work, or just fix it
        });
    });

});
