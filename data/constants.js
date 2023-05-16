const steps = {
    NIFTY:50,
    BANKNIFTY:100
}

const lot_size = {
    NIFTY:50,
    BANKNIFTY:25
}

const scripts = {
    NIFTY:"NIFTY",
    BANKNIFTY:"BANKNIFTY"
}

const option_types = {
    PE:"PE",
    CE:"CE",
    ITM:"ITM",
    OTM:"OTM",
    ATM:"ATM"
}

const order_types={
    MARKET:"MARKET",
    LIMIT:"LIMIT",
    STOPLOSS_LIMIT:"STOPLOSS_LIMIT"
}

const order_action = {
    BUY:"BUY",
    SELL:"SELL"
}

const command_const = {
    START:"START",
    BLOCK:"BLOCK",
    CONDITION:"CONDITION",
    RULE:"RULE",
    END:"END",
    TIME:"TIME",
    ENTER:"ENTER",
    EXIT:"EXIT",
    MODIFY:"MODIFY"
}

const auth_tokens = {
    client_code: "D538599",
    api_key: "TIlue2pQ",
    

    auth_token:"eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjgyODM3OTYxLCJleHAiOjE2ODI5MjQzNjF9.RAtjWRZVGh79a0e1QxmYRTx2YVQQjJRykHJ-L-ZeMUIfNcD9RwK_5T2DdkwUKI7O7syVvCE6yqQXCCLTVhQmbA",
    feed_token:"eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJpYXQiOjE2ODI4Mzc5NjEsImV4cCI6MTY4MjkyNDM2MX0.TVu5JfkTkTgmqZXpHZFmqRgJTP7AKnqjzYzsrbW2h-dKitmT3q7cYF8Vh2bhWBHxbXEP6y60ELvT92OUe3-lEA",
    refresh_token:"eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbiI6IlJFRlJFU0gtVE9LRU4iLCJpYXQiOjE2ODI4Mzc5NjF9.AKkknxn2Zw5M1LMIPGj2GEI4UeZPXnyI3g3MwX_osn972tF9AcMxB5jNtpYL2w6AawJ6gOxx6DqbkJRsIM8q0A"
    
}

const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

/*
https://smartapi.angelbroking.com/publisher-login?api_key=TIlue2pQ


auth_token=eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjgyODM3OTYxLCJleHAiOjE2ODI5MjQzNjF9.RAtjWRZVGh79a0e1QxmYRTx2YVQQjJRykHJ-L-ZeMUIfNcD9RwK_5T2DdkwUKI7O7syVvCE6yqQXCCLTVhQmbA
feed_token=eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJpYXQiOjE2ODI4Mzc5NjEsImV4cCI6MTY4MjkyNDM2MX0.TVu5JfkTkTgmqZXpHZFmqRgJTP7AKnqjzYzsrbW2h-dKitmT3q7cYF8Vh2bhWBHxbXEP6y60ELvT92OUe3-lEA
refresh_token=eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbiI6IlJFRlJFU0gtVE9LRU4iLCJpYXQiOjE2ODI4Mzc5NjF9.AKkknxn2Zw5M1LMIPGj2GEI4UeZPXnyI3g3MwX_osn972tF9AcMxB5jNtpYL2w6AawJ6gOxx6DqbkJRsIM8q0A

*/

let headers= {
    'Content-Type': 'application/json',
    'X-ClientLocalIP': '192.168.168.168',
    'X-ClientPublicIP': '106.193.147.98',
    'X-MACAddress': 'fe80::216e:6507:4b90:3719',
    'Accept': 'application/json',
    'X-PrivateKey': auth_tokens.api_key,
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'Authorization': 'Bearer ' + auth_tokens.auth_token
}

const exchanges = {
    NSE:"NSE",
    BSE:"BSE",
    NFO:"NFO",
    MCX:"MCX"
}

const leg_status = {
    init:"init",
    open:"open",
    running:"running",
    closed:"closed"
}

const order_status_list = {
    executed:"executed",
    pending:"pending",
    rejected:"rejected",
    canceled:"canceled"
}

module.exports = {order_status_list,leg_status,steps,scripts,option_types,auth_tokens,order_action,order_types,headers,exchanges,months,lot_size,command_const}



/*
{
        "token": "26009",
        "symbol": "BANKNIFTY",
        "name": "BANKNIFTY",
        "expiry": "",
        "strike": "-1.000000",
        "lotsize": "-1",
        "instrumenttype": "",
        "exch_seg": "NSE",
        "tick_size": "-1.000000"
    },
    {
        "token": "26000",
        "symbol": "NIFTY",
        "name": "NIFTY",
        "expiry": "",
        "strike": "-1.000000",
        "lotsize": "-1",
        "instrumenttype": "",
        "exch_seg": "NSE",
        "tick_size": "-1.000000"
    }



    {
            "symboltoken": "52630",
            "symbolname": "BANKNIFTY",
            "instrumenttype": "OPTIDX",
            "priceden": "1.00",
            "pricenum": "1.00",
            "genden": "1.00",
            "gennum": "1.00",
            "precision": "2",
            "multiplier": "-1",
            "boardlotsize": "1",
            "exchange": "NFO",
            "producttype": "INTRADAY",
            "tradingsymbol": "BANKNIFTY29MAR2340200CE",
            "symbolgroup": "XX",
            "strikeprice": "40200.0",
            "optiontype": "CE",
            "expirydate": "29MAR2023",
            "lotsize": "25",
            "cfbuyqty": "0",
            "cfsellqty": "0",
            "cfbuyamount": "0.00",
            "cfsellamount": "0.00",
            "buyavgprice": "7.15",
            "sellavgprice": "6.60",
            "avgnetprice": "0.00",
            "netvalue": "-13.75",
            "netqty": "0",
            "totalbuyvalue": "178.75",
            "totalsellvalue": "165.00",
            "cfbuyavgprice": "0.00",
            "cfsellavgprice": "0.00",
            "totalbuyavgprice": "7.15",
            "totalsellavgprice": "6.60",
            "netprice": "0.00",
            "buyqty": "25",
            "sellqty": "25",
            "buyamount": "178.75",
            "sellamount": "165.00",
            "pnl": "-13.75",
            "realised": "-13.75",
            "unrealised": "-0.00",
            "ltp": "6.9",
            "close": "9.0"
        }
*/