const LoginHelper = require('./helpers/LoginHelper');
const SocketHelper = require('./helpers/SocketHelper');
const fetch = require('node-fetch');
const fs = require('fs');
const FileHelper = require("./helpers/FileHelper");
var currentserver = "";
var dv = "";
require('dotenv').config();
function updateFlashvars(maxAttempts, attemptNumber = 0) {
    return new Promise(resolve => {
        if (maxAttempts <= attemptNumber) return resolve(null);
        let getHeader = {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        };
        fetch("https://animal-jam-api-secret.onrender.com/flashvars", getHeader).then(res => res.json()).then(info => {
            currentserver = info["smartfoxServer"];
            dv = info["deploy_version"];
            return resolve();
        }).catch(async err => {
            console.log("Error when retrieving flashvars: " + err);
            return await updateFlashvars(maxAttempts, attemptNumber + 1);
        });
    })
}
(async () => {
    if (!process.argv[2]) process.exit(0);
    if (!fs.existsSync("out")){
        fs.mkdirSync("out");
    }
    await updateFlashvars(5);
    console.log("got flashvars!");
    var token = await LoginHelper.login(process.env.BOT_USERNAME, process.env.BOT_PASSWORD, "flash", 3);
    var helper = new SocketHelper(process.env.BOT_USERNAME, token, currentserver, dv, false, process.argv[2])
    helper.start();
    //await keypress()
})();