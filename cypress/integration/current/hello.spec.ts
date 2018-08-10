const greeter = (person: string) => {
    return 'Hello, ' + person;
};

let user1 = 'Jane User';

document.body.innerHTML = greeter(user1);