export const baseUrl = Cypress.config('baseUrl');

export const username = getEnv('username');
export const password = getEnv('password');

function getEnv(key: string) {
    const val: string | null = Cypress.env(key);
    if (!val) {
        throw new Error(`${key}: value not found`);
    }
    return val;
}
