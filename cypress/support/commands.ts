/// <reference types="Cypress" />

interface ICredentials { username: string; password: string; }

const getAuthRedirect = (): Cypress.Chainable<string> => {
    return cy.request({
        url: 'https://dashboard.laterforreddit.com/auth/',
        method: 'GET',
        followRedirect: false
    }).then(({ headers }) => {
        return headers.location;
    });
};

const getRedditCsrfToken = (): Cypress.Chainable<string> => {
    return cy.request({
        url: 'https://www.reddit.com/login',
        method: 'GET',
        headers: {
            cookie: ''
        }
    }).then<string>((resp) => {
        expect(resp.status).to.eq(200);
        const $html = Cypress.$(resp.body);
        const tok = $html.find('input[name=csrf_token]').val();
        return (tok || '').toString();
    });
};

interface ILoginOpts {
    redditAuthLocation: string;
    csrfToken: string;
    username: string;
    password: string;
}
const performLogin = ({ redditAuthLocation, csrfToken, username, password }: ILoginOpts) => {
    cy.log('Logging in as user: ' + username);
    return cy.request({
        url: 'https://www.reddit.com/login',
        method: 'POST',
        failOnStatusCode: false,
        form: true,
        followRedirect: false,
        body: {
            username,
            password,
            dest: redditAuthLocation,
            csrf_token: csrfToken,
            otp: '',
        },
    });
};

const getRedditModhash = (redditAuthLocation: string): Cypress.Chainable<string> => (
    cy.request({
        url: redditAuthLocation,
        method: 'GET',
    }).then<string>(({ body }) => (
        (Cypress.$(body).find('input[name=uh]').val() || '').toString()
    ))
);

const performRedditAuthorization = (redditAuthLocation: string, modHash: string): Cypress.Chainable<any> => {
    const statePar = redditAuthLocation.match(/state=([^&]*)&/);
    let state = '';
    if (statePar != null) {
        state = statePar[1];
    }

    return cy.request({
        url: 'https://www.reddit.com/api/v1/authorize.json',
        method: 'POST',
        form: true,
        headers: {
            te: 'Trailers',
        },
        body: {
            authorize: 'Allow',
            client_id: '0cd0Jnk4Kmi0FQ', // TODO dynamicize
            duration: 'permanent',
            redirect_uri: 'https://laterforreddit.com/auth/callback',
            response_type: 'code',
            // scope: "flair+identity+modflair+modposts+submit",
            scope: 'identity',
            uh: modHash,
            state,
        },
    });
};

Cypress.Commands.add('logInViaReddit', (opts?: ICredentials): Cypress.Chainable<any> => {
    const username = opts ? opts.username : Cypress.env('username');
    const password = opts ? opts.password : Cypress.env('password');

    return getAuthRedirect().then((redditAuthLocation) => {
        if (redditAuthLocation.search(/www.reddit.com/) > 0) {
            // Clear cookies on reddit.com as well
            cy.request({ url: 'https://www.reddit.com/logoutproxy', method: 'POST' });
            cy.clearCookies();
            getRedditCsrfToken().then((csrfToken) => (
                performLogin({ redditAuthLocation, csrfToken, username, password })
            ));
            getRedditModhash(redditAuthLocation).then((modHash) => (
                performRedditAuthorization(redditAuthLocation, modHash)
            ));
        }
    });
});

Cypress.Commands.add('deletePostByTitle', (title: string) => {
    cy.visit('https://dashboard.laterforreddit.com/content/');
    cy.get('.identity').should('contain', 'adambard');

    cy.get('.content-header').contains(title).parents('.content-item').find('.post-controls > .delete-control > .control > .icon').click();
    cy.get('.yes').click();
});

// tslint:disable-next-line no-namespace
declare namespace Cypress {
    interface Chainable {  // tslint:disable-line interface-name
        logInViaReddit(opts?: ICredentials): Cypress.Chainable<string>;
        deletePostByTitle(title: string): Cypress.Chainable;
    }
}
