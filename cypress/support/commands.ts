/// <reference types="Cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare namespace Cypress {
    interface Chainable {
        logInViaReddit(username: string, password: string): Cypress.Chainable<string>;
    }
}

Cypress.Commands.add('logInViaReddit', (username: string, password: string) => {
    cy.request({
        url: "https://dashboard.laterforreddit.com/auth/",
        method: "GET",
        followRedirect: false
    }).its("headers").then((headers) => {
        const ringSessionId = headers["set-cookie"][0].split(';')[0].slice(13);
        const redditAuthLocation = headers.location;

        cy.request({
            url: redditAuthLocation,
            method: "GET"
        }).then(resp => {
            const $html = Cypress.$(resp.body);
            const csrf = $html.find("input[name=csrf_token]").val();

            // Perform login
            return cy.request({
                url: "https://www.reddit.com/login",
                method: "POST",
                failOnStatusCode: false,
                form: true,
                followRedirect: false,
                body: {
                    username,
                    password,
                    dest: redditAuthLocation,
                    csrf_token: csrf,
                    otp: ""
                }
            });
        }).then(_ => {
            const statePar = redditAuthLocation.match(/state=([^&]*)&/);
            let state = "";
            if (statePar != null) {
                state = statePar[1];
            }

            cy.request({
                url: redditAuthLocation,
                method: "GET",
            }).then(getResp => {
                const $html = Cypress.$(getResp.body);
                console.log(getResp.body);
                const uh = $html.find("input[name=uh]").val();
                console.log("UH", uh);
                return cy.request({
                    url: "https://www.reddit.com/api/v1/authorize.json",
                    method: "POST",
                    form: true,
                    headers: {
                        te: "Trailers"
                    },
                    body: {
                        authorize: "Allow",
                        client_id: "0cd0Jnk4Kmi0FQ", // TODO dynamicize
                        duration: "permanent",
                        redirect_uri: "https://laterforreddit.com/auth/callback",
                        response_type: "code",
                        //scope: "flair+identity+modflair+modposts+submit",
                        scope: "identity",
                        state,
                        uh
                    }
                });
            }).then(authResp => {
                expect(authResp.status).to.equal(200);
                return ringSessionId;
            });
        });
    });
});