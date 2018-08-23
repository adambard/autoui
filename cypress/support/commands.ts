/// <reference types="Cypress" />

// tslint:disable-next-line no-namespace
declare namespace Cypress {
    interface Chainable {  // tslint:disable-line interface-name
        logInViaReddit(username: string, password: string): Cypress.Chainable<string>;
    }
}

const getAuthRedirect = (): Cypress.Chainable<string> => {
    return cy.request({
        url: "https://dashboard.laterforreddit.com/auth/",
        method: "GET",
        followRedirect: false,
    }).then(({ headers }) => {
        return headers.location;
    });
};

const getRedditCsrfToken = (redditAuthLocation: string): Cypress.Chainable<string> => (
    cy.request({
        url: redditAuthLocation,
        method: "GET",
    }).then<string>((resp) => Cypress.$(resp.body).find("input[name=csrf_token]").val() as string)
)

interface ILoginOpts {
    redditAuthLocation: string;
    csrfToken: string;
    username: string;
    password: string;
}
const performLogin = ({ redditAuthLocation, csrfToken, username, password }: ILoginOpts) => (
    cy.request({
        url: "https://www.reddit.com/login",
        method: "POST",
        failOnStatusCode: false,
        form: true,
        followRedirect: false,
        body: {
            username,
            password,
            dest: redditAuthLocation,
            csrf_token: csrfToken,
            otp: "",
        },
    })
)

const getRedditModhash = (redditAuthLocation: string): Cypress.Chainable<string> => (
    cy.request({
        url: redditAuthLocation,
        method: "GET",
    }).then<string>(({ body }) => Cypress.$(body).find("input[name=uh]").val() as string)
);

const performRedditAuthorization = (redditAuthLocation: string, modHash: string): Cypress.Chainable<any> => {
    const statePar = redditAuthLocation.match(/state=([^&]*)&/);
    let state = "";
    if (statePar != null) {
        state = statePar[1];
    }

    return cy.request({
        url: "https://www.reddit.com/api/v1/authorize.json",
        method: "POST",
        form: true,
        headers: {
            te: "Trailers",
        },
        body: {
            authorize: "Allow",
            client_id: "0cd0Jnk4Kmi0FQ", // TODO dynamicize
            duration: "permanent",
            redirect_uri: "https://laterforreddit.com/auth/callback",
            response_type: "code",
            // scope: "flair+identity+modflair+modposts+submit",
            scope: "identity",
            uh: modHash,
            state,
        },
    });
};

Cypress.Commands.add("logInViaReddit", (username: string, password: string): Cypress.Chainable<any> => {
    return getAuthRedirect().then(
        (redditAuthLocation) => {
            console.log(redditAuthLocation)
            if (redditAuthLocation.search(/www.reddit.com/)) {
                getRedditCsrfToken(redditAuthLocation).then((csrfToken) => (
                    performLogin({ redditAuthLocation, csrfToken, username, password })
                )).then(() => (
                    getRedditModhash(redditAuthLocation)
                )).then((modHash) => (
                    performRedditAuthorization(redditAuthLocation, modHash)
                ))
            }
        }
    );
});