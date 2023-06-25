const util = require("./util");
const constants = require("./../data/constants")

const load_auth = async () => {
    auth_data = await util.read_json_file("./../data/auth.json");
    constants.auth_tokens = auth_data;
}

module.exports = {load_auth}