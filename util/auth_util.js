const util = require("./util");
const constants = require("./../data/constants")

const load_auth = async () => {
    return new Promise(async (resolve, reject) => {
        let auth_data = await util.read_json_file("./data/auth.json");
        constants.set_auth_tokens(auth_data);
        resolve();
    })
}

module.exports = { load_auth };