/// <reference types="Cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Yields "foo"
         *
         * @returns {typeof foo}
         * @memberof Chainable
         * @example
         *    cy.foo().then(f => ...) // f is "foo"
         */
        loginBySingleSignOn(): Promise<any>;
    }
}

describe("Login", () => {

    Cypress.Commands.add('loginBySingleSignOn', () => {
        cy.request({
            url: "https://dashboard.laterforreddit.com/auth/",
            method: "GET",
            followRedirect: false
        }).its("headers").then(({ location }) => {
            //const ringSessionId = resp.headers["set-cookie"][0].split(';')[0].slice(13);
            const redditAuthLocation = location;

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
                        username: "BackgroundUnion",
                        password: "bo0bo0bo0",
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
                        url: "https://www.reddit.com/api/v1/authorize",
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
                            scope: "flair+identity+modflair+modposts+submit",
                            state,
                            uh
                        }
                    });
                }).then(authResp => {
                    console.log(authResp);
                });
            });
        });
    });

    it("Can log in", () => {
        cy.loginBySingleSignOn().then(r => {
            console.log(r);
            //cy.visit("https://dashboard.laterforreddit.com/auth/");
        });
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