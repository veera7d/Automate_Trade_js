const util = require('./util')
const constants = require("../data/constants")
const requests = require("./requests")
const req_body_util = require("./req_body_util")
const token_data = require("./token_data")

const get_ltp = async (body) =>{
    //console.log(body,"ltpppppppp");
    let ltp_res_body = await requests.get_ltp_data(body);
    //console.log(ltp_res_body,"ltpppppppp");
    return ltp_res_body.data.ltp;
}

//sell at options and return order ids object
const place_option_order = async (legid,script,ce_pe,order_action,quantity,strike,order_type,price,triggerprice)=>{
    // if(script!==constants.scripts.BANKNIFTY && script!==constants.scripts.NIFTY){
    //     throw Error("Not nifty or bank nifty");
    // }
    let ltp_token_obj = await token_data.get_token_with_symbol_exchange(script,constants.exchanges.NSE);
    //console.log(ltp_token_obj);
    let ltp= await get_ltp(req_body_util.ltp_body(ltp_token_obj));
    if(strike===constants.option_types.ATM){
        strike = util.get_ATM_strike(script,ltp);
    }else{
        strike = util.get_ioTM_strike(script,ltp,strike,ce_pe);
    }
    console.log("ltp in sell atm",ltp);
    let nxt_exp = await util.get_nxt_thu_expiry();
    let token_obj = await token_data.get_token_with_symbol_exchange(
        token_data.build_opt_token(
            //script,23,"MAR",23,strike,ce_pe
            script,nxt_exp.getDate().toString()
            ,constants.months[nxt_exp.getMonth()]
            ,nxt_exp.getFullYear().toString().substring(2)
            ,strike,ce_pe
            ),
            constants.exchanges.NFO
        )
        console.log(token_obj);
    try{
    let order_res = await requests.place_order(req_body_util.get_order_body(legid,token_obj,order_action,quantity,order_type,price,triggerprice));
    //console.log(order_res);
    return order_res;
    }catch(ex){
        console.log("order_util place order",ex);
        throw ex;
    }
}

const sell_ATM_stradel= async(script,lots)=>{
    try{
    let ce_order = place_option_order(script,
        constants.option_types.CE,
        constants.order_action.SELL,
        constants.lot_size[script]*lots,
        constants.option_types.ATM);
    let pe_order = place_option_order(script,
        constants.option_types.PE,
        constants.order_action.SELL,
        constants.lot_size[script]*lots,
        constants.option_types.ATM
        //"OTM2"
        );
    let results = await Promise.all([ce_order,pe_order])
    console.log(results);
    return results;
    }catch(ex){
        throw ex;
    }
        

}


module.exports = { place_option_order,get_ltp,sell_ATM_stradel }

