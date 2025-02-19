const fetch = require('node-fetch');

class LoginHelper {
    constructor() { }
    static login(user, pass, domain, maxAttempts, attemptNumber = 0) {
        return new Promise(resolve => {
            if (maxAttempts <= attemptNumber) return resolve(null);
            let login = {
                screen_name: user,
                password: pass,
                domain: domain
            };
            let postHeader = {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(login)
            };
            fetch("https://animal-jam-api-secret.onrender.com/login-private-endpoint", postHeader).then(res => res.json()).then(info => {
                console.log('got token!')
                return resolve(info["auth_token"]);
            }).catch(async err => {
                var aN = attemptNumber + 1;
                console.log(aN + " errors when logging in " + user);
                return await LoginHelper.login(user, pass, maxAttempts, aN);
            });
        })
    }
}
module.exports = LoginHelper;