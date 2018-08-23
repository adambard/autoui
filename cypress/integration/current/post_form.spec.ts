/// <reference types="Cypress" />

import "../../support/commands";

describe("Content Creation Form", () => {

    describe("Pre-login stash feature", () => {
        it("Works", () => {
            cy.visit("https://dashboard.laterforreddit.com/content/create/")

            cy.get('.login > a').should("contain", "Sign In with Reddit")

            cy.get('.title-field > input').type("Post Title")
            cy.get('.link-field > input').type("http://laterforreddit.com/{enter}")

            cy.get('.subreddit-field > input').type("redditlater")

            cy.get('.loading-button').click()

            cy.logInViaReddit("BackgroundUnion", "bo0bo0bo0");
            cy.visit("https://dashboard.laterforreddit.com/")

            // TODO: Login with a fresh user to see this work, or just fix it
        })
    })

})