/// <reference types="Cypress" />

interface ISubredditSuggestion {
    subreddit: string;
}

function checkSuggestion(array: ISubredditSuggestion[], item: string) {
    return array.reduce((x, y) => x || y.subreddit === item, false);
}

describe('Dashboard', () => {
    it('should suggest "funny" subreddits', () => {

        cy.request('POST', 'https://dashboard.laterforreddit.com/graphql',
            {
                query: `query SubredditSuggestions($subreddit: String!) {
                    subreddit_suggestions(subreddit: $subreddit) {
                         subreddit weight normalized_weight __typename
                        }
                    }`,
                variables: { subreddit: 'funny' },
                operationName: 'SubredditSuggestions'
            })
            .then((resp) => {
                expect(resp.status).to.eq(200);

                const suggestions: ISubredditSuggestion[] = resp.body.data.subreddit_suggestions;
                expect(suggestions).to.have.length.greaterThan(10);

                const top3 = ['funnt', 'rfunny', 'pranks'];
                top3.forEach(function(word) {
                    const suggestion = checkSuggestion(suggestions, word);
                    const message = `Look for suggestion "${word}"`;

                    expect(suggestion, message).to.be.true;
                });

            });

    });
});
