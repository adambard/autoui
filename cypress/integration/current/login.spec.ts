/// <reference types="Cypress" />

/// import "cypress-failed-log";

import "../../support/commands";

describe("Login", () => {
    // let ringSessionId: string | null = null;

    before(() => {
        cy.logInViaReddit("BackgroundUnion", "bo0bo0bo0");
        Cypress.Cookies.preserveOnce("ring-session");
    });

    it.only("Can log in", () => {
        cy.visit("https://dashboard.laterforreddit.com/content/");
        cy.get(".identity").should("contain", "adambard");
    });

    it("Can create a post", () => {
        cy.visit("https://dashboard.laterforreddit.com/content/create/");

        cy.get(".identity").should("contain", "adambard");
        cy.get(".title-field > input").type("Test Post Please Ignore");
        cy.get(".link-field > input").type("https://laterforreddit.com");
        cy.get(".submit-field > input").click();

        cy.get(".subreddit-input > input").type("redditlater");
        cy.get(".react-datepicker__input-container > input").type("{backspace}{backspace}{backspace}118");

        cy.get(".loading-button").click();

        cy.get(".subreddit").should("contain", "redditlater");
        cy.get(".user").should("contain", "adambard");
        cy.get(".date").should("contain", "2118");

        cy.get(".delete-control > .control > .icon").click();
        cy.get(".yes").click();

        cy.get(".content-list > a").click();
        cy.get(":nth-child(1) > .post-controls > .delete-control > .control > .icon").click();
        cy.get(".yes").click();
    });

    /*,
        it("Should work", () => {
            cy.visit("https://laterforreddit.com/");
            cy.get('.try-button').click();
            cy.get('.title-field > input').type("Test Post Please Ignore");
            cy.get('.link-field > input').type("https://laterforreddit.com/");
            cy.get('.submit-field > input').click();

            cy.get('.subreddit-field > input').type("redditlater");
            cy.get('.react-datepicker__input-container > input').type("08/19/2100");
            cy.get('.loading-button').click();
        });
        */
});