const constants = require("../data/constants")

//can be implemented as function returning functions call like eq(token).buy().limit(20).quantity(50)
const get_order_body = (legid,token_obj,oaction,quantity,ordertype=null,price=null,triggerprice=null)=>{
    if(triggerprice){
        return sl_order_body(legid,token_obj,oaction,quantity,ordertype,price,triggerprice)
    }
    return {
        "variety": "NORMAL",
        "tradingsymbol": token_obj.symbol,
        "symboltoken": token_obj.token,
        "transactiontype": oaction,
        "exchange": token_obj.exch_seg,
        //"ordertype": ordertype === constants.order_types.LIMIT ? ordertype : constants.order_types.MARKET,
        "ordertype":(triggerprice!=null)?constants.order_types.STOPLOSS_LIMIT:(ordertype === constants.order_types.LIMIT ? ordertype : constants.order_types.MARKET),
        //"triggerprice":triggerprice,
        "producttype": "INTRADAY",
        "duration": "DAY",
        "price": (price !== undefined && price!== null) ? price.toString() : "0" ,
        "squareoff": "0",
        "stoploss": "0",
        "quantity": quantity.toString(),
        "ordertag":legid
    }
}


const get_m_order_body = (token_obj,orderid,quantity,ordertype,price)=>{
    return {
        "variety":"NORMAL",
        "orderid":orderid,
        "ordertype":ordertype ?? constants.order_types.MARKET,
        "producttype":"INTRADAY",
        "duration":"DAY",
        "price":price.toString() ?? "0",
        "quantity":quantity,
        "tradingsymbol":token_obj.symbol,
        "symboltoken":token_obj.token,
        "exchange":token_obj.exch_seg
        }
}

const get_c_order_body = (orderid)=>{
    return {
        "variety":"NORMAL",
        "orderid":orderid
        }
}

const ltp_body = (token_obj)=>{
    return {
        exchange:token_obj.exch_seg,
        symboltoken:token_obj.token,
        tradingsymbol:token_obj.symbol
    }
}

const sl_order_body = (legid,token_obj,oaction,quantity,ordertype=null,price=null,triggerprice=null)=>{
    return {
        "variety": "STOPLOSS",
        "tradingsymbol": token_obj.symbol,
        "symboltoken": token_obj.token,
        "transactiontype": oaction,
        "exchange": token_obj.exch_seg,
        //"ordertype": "LIMIT",
        "ordertype": "STOPLOSS_LIMIT",
        "producttype": "INTRADAY",
        "duration": "DAY",
        //"price": "19500",
        "price": (price!== null) ? price.toString() : "0",
        "triggerprice":triggerprice,
        "squareoff": "0",
        "stoploss": "0",
        //"quantity": "1"
        "quantity": quantity.toString(),
        "ordertag":legid
    }
}

//just example posted nee to chenge later to dynamic as other once
const convert_position = ()=>{
    return {
        "exchange": "NSE",
        "symboltoken": "2885",
        "producttype": "DELIVERY",
        "newproducttype": "INTRADAY",
        "tradingsymbol": "RELIANCE-EQ",
        "symbolname": "RELIANCE",
        "instrumenttype": "",
        "priceden": "1",
        "pricenum": "1",
        "genden": "1",
        "gennum": "1",
        "precision": "2",
        "multiplier": "-1",
        "boardlotsize": "1",
        "buyqty": "1",
        "sellqty": "0",
        "buyamount": "2235.80",
        "sellamount": "0",
        "transactiontype": "BUY",
        "quantity": 1,
        "type": "DAY"
   }
}

module.exports = {get_order_body,get_m_order_body,get_c_order_body,ltp_body}

/*

{
        "token": "3045",
        "symbol": "SBIN-EQ",
        "name": "SBIN",
        "expiry": "",
        "strike": "-1.000000",
        "lotsize": "1",
        "instrumenttype": "",
        "exch_seg": "NSE",
        "tick_size": "5.000000"
    }

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
    }
*/



/*
modify order req
{
"variety":"NORMAL",
"orderid":"201020000000080",
"ordertype":"LIMIT",
"producttype":"INTRADAY",
"duration":"DAY",
"price":"194.00",
"quantity":"1",
"tradingsymbol":"SBIN-EQ",
"symboltoken":"3045",
"exchange":"NSE"
}
*/