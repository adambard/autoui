/// <reference types="Cypress" />

/// import "cypress-failed-log";

import "../../support/commands";

describe("Login", () => {
    // let ringSessionId: string | null = null;

    before(() => {
        cy.logInViaReddit("BackgroundUnion", "bo0bo0bo0");
        Cypress.Cookies.preserveOnce("ring-session");
    });

    it("Can log in", () => {
        cy.visit("https://dashboard.laterforreddit.com/content/");
        cy.get(".identity").should("contain", "adambard");
    });
});