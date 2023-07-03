const exchange_type = (exchange) => {
    switch (exchange) {
        case "NSE":
            return 1;
        case "NFO":
            return 2;
        case "BSE":
            return 3;
        case "MCX":
            return 5;
    }
}

const build_websoc_ltpreq = (token_obj, subscribe = true) => {
    return {
        "correlationID": token_obj.token,
        "action": subscribe ? 1 : 0,
        "params": {
            mode: 1,
            tokenList: [
                {
                    exchangeType: exchange_type(token_obj.exch_seg),
                    tokens: [
                        token_obj.token
                    ]
                }
            ]
        }
    }
}

module.exports = { build_websoc_ltpreq };