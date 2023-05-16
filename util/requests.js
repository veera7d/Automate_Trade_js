const constants = require("../data/constants")

//gets the ltp of the product
const get_ltp_data = async (body)=>{
    try{
        let ltp_res = await fetch("https://apiconnect.angelbroking.com/order-service/rest/secure/angelbroking/order/v1/getLtpData", {
        method: "POST",
        headers: constants.headers,
        body: JSON.stringify(body)
    });
    ltp_res = await ltp_res.json();
    //console.log("ltp response:",ltp_res)
    return ltp_res;
    }catch(ex){
        return ex;
    }
}

//retrive the order book
const get_orderbook = async ()=>{
    let orderbook_res = null;
    let orderbook_res_json = null;
    try{
        orderbook_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook", {
        method: "GET",
        headers: constants.headers
    });
    //console.log("get_orderbook : ",orderbook_res);
    orderbook_res_json = await orderbook_res.json();
    //console.log("order book response:",orderbook_res)
    return orderbook_res_json;
    }catch(ex){
        console.log("get_orderbook : ",orderbook_res);
        console.log("get_orderbook : ",orderbook_res_json);
        return ex;
    }
}

//retrive the trade book
const get_tradebook = async ()=>{
    try{
        let tradebook_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getTradeBook", {
        method: "GET",
        headers: constants.headers
    });
    tradebook_res = await tradebook_res.json();
    //console.log("trade book response:",tradebook_res)
    return tradebook_res;
    }catch(ex){
        return ex;
    }
}

//will place the order
const place_order = async (body)=>{
    console.log("place order body",body);
    try{
        let placeOrder_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder", {
        method: "POST",
        headers: constants.headers,
        body: JSON.stringify(body)
    });
    placeOrder_res = await placeOrder_res.json();
    //console.log("ORDER response:",placeOrder_res);
    return placeOrder_res;
    }catch(ex){
        return ex;
    }
}

//
const modify_order = async (body)=>{
    try{
        let modifyOrder_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/modifyOrder", {
        method: "POST",
        headers: constants.headers,
        body: JSON.stringify(body)
    });
    modifyOrder_res = await modifyOrder_res.json();
    //console.log("modify ORDER response:",modifyOrder_res)
    return modifyOrder_res;
    }catch(ex){
        return ex;
    }
}

//
const cancel_order = async (body)=>{
    try{
        let cancleOrder_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/cancelOrder", {
        method: "POST",
        headers: constants.headers,
        body: JSON.stringify(body)
    });
    cancleOrder_res = await cancleOrder_res.json();
    //console.log("cancel ORDER response:",cancleOrder_res)
    return cancleOrder_res;
    }catch(ex){
        return ex;
    }
}

//
const get_holdings = async ()=>{
    try{
        let holdings_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/portfolio/v1/getHolding", {
        method: "GET",
        headers: constants.headers
    });
    holdings_res = await holdings_res.json();
    //console.log("holdings response:",holdings_res)
    return holdings_res;
    }catch(ex){
        return ex;
    }
}

const get_positions = async ()=>{
    try{
        let positions_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition", {
        method: "GET",
        headers: constants.headers
    });
    positions_res = await positions_res.json();
    //console.log("positions response:",positions_res)
    return positions_res;
    }catch(ex){
        return ex;
    }
}


//https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/convertPosition
const convert_position = async (body)=>{
    try{
        let cconvert_pos_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/cancelOrder", {
        method: "POST",
        headers: constants.headers,
        body: JSON.stringify(body)
    });
    cconvert_pos_res = await cconvert_pos_res.json();
    //console.log("cconvert_pos_res response:",cconvert_pos_res)
    return cconvert_pos_res;
    }catch(ex){
        return ex;
    }
}

const get_profile= async ()=>{
    try{
        let profile_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/user/v1/getProfile", {
        method: "GET",
        headers: constants.headers
    });
    profile_res = await profile_res.json();
    //console.log("profiles response:",profile_res)
    return profile_res;
    }catch(ex){
        throw ex;
    }
}


const get_RMS= async ()=>{
    try{
        let rms_res = await fetch("https://apiconnect.angelbroking.com/rest/secure/angelbroking/user/v1/getRMS", {
        method: "GET",
        headers: constants.headers
    });
    rms_res = await rms_res.json();
    //console.log("rms_res response:",rms_res)
    return rms_res;
    }catch(ex){
        throw ex;
    }
}

module.exports = {get_profile,get_ltp_data,get_orderbook,get_tradebook,place_order,modify_order,get_holdings,cancel_order,get_positions}