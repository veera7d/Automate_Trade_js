const util = require("./util/util");
const constants = require("./data/constants");
const requests = require("./util/requests");
const order_util = require("./util/order_util");
const req_body_util = require("./util/req_body_util")
const token_data = require("./util/token_data");


// order_util.place_option_order(constants.scripts.BANKNIFTY,
//     constants.option_types.PE,
//     constants.order_action.SELL,
//     50,
//     //constants.option_types.ATM,
//     "OTM2");


order_util.sell_ATM_stradel(constants.scripts.BANKNIFTY,2)
.then(results=>console.log(results))
.catch(err=> console.log(err))

/*
steps

master will be running the blocks with id starting with 1

block id
    list of conditions(leads to next block) - only one can be true (output)
        if became true then run that outout id block until one became true in that
*/