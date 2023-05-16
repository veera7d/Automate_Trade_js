const token_data = require("../util/token_data")
const constants = require("../data/constants")
const requests = require("./requests")
const fs = require("fs")
const req_body_util = require("./req_body_util");


const get_pos_obj = async (orderid)=>{
    try{
        let positions_res =  await requests.get_positions();
        let posobj = undefined;
        for(let pos of positions_res.data){
            if(pos.orderid === orderid){
                posobj = pos;
            }
        }
        return posobj;
    }catch(ex){
        console.log("util",ex);
        throw ex;
    }
}


const write_json_file = async (path,data)=>{
    try{
        let res = await fs.promises.writeFile(path,JSON.stringify(data));
        return res;
    }catch(ex){
        throw ex;
    }
}

const read_json_file = async (path)=>{
    try{
        let data = await fs.promises.readFile(path,'utf8');
        return JSON.parse(data)
    }catch(ex){
        throw ex;
    }
}


// not complete need to complete
const get_neat_strike = (script,price)=>{
    step = constants.steps[script];
    rem = ltp%step;
    base = ltp - rem;
    if(ltp>base+(step/2)){
        return base+step;
    }
    return base;
}

// not complete need to complete
//will calculate and return atm strike
const get_ATM_strike = (script,ltp)=>{
    step = constants.steps[script];
    rem = ltp%step;
    base = ltp - rem;
    if(ltp>base+(step/2)){
        return base+step;
    }
    return base;
}

//get itm and otm strike
const get_ioTM_strike = (script,ltp,io_num,ce_pe)=>{
    pos = parseInt(io_num.substring(3));
    diff = (constants.steps[script]*pos);
    atm = get_ATM_strike(script,ltp);
    if(io_num.includes("OTM")){
        if(ce_pe === constants.option_types.CE){
            return atm+diff;
        }
        return atm-diff;
    }else{
        if(ce_pe === constants.option_types.CE){
            return atm-diff;
        }
        return atm+diff;
    }
}

//get banknifty ltp
async function get_BN_ltp(){
    try{
        let token_obj = await token_data.get_token_with_symbol_exchange(constants.scripts.BANKNIFTY,"NSE");
        //console.log("token_obj",token_obj);
        let ltp_res = await requests.get_ltp(token_obj.token,token_obj.symbol,token_obj.exch_seg);
        console.log("ltp_res",ltp_res.data.ltp);
        return ltp_res.data.ltp;
    }catch(ex){
        console.log("ex in ltp stratagy",ex);
    }
}


const get_ind_time_now= () =>{
    const now = new Date();
    const currentIndiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    console.log("util",now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12:false }));
    return new Date(currentIndiaTime - (5 * 60 * 60 * 1000));

}

const get_ind_dmyhms = () =>{
    const now = new Date();
    //const currentIndiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    let strr = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12:false });
    let [datee,timee]=strr.split(',')
    timee=timee.trim();
    let [date,month,year] = datee.split('/');
    let [hours,minutes,seconds] = timee.split(':');
    return {date,month,year,hours,minutes,seconds};
}

const get_nxt_thu = () => {
    const currentIndiaTime = get_ind_time_now();
    const currentIndiaDay = currentIndiaTime.getDay();
    const daysUntilNextThursday = currentIndiaDay <= 4 ? 4 - currentIndiaDay : 11 - currentIndiaDay;
    const nextThursday = new Date(currentIndiaTime.getTime() + (daysUntilNextThursday * 24 * 60 * 60 * 1000));
    return nextThursday;
}

const get_nxt_thu_expiry = async () =>{
    let ind_today = get_ind_time_now();
    let nxt_exp = null;
    let temp = ind_today.getDate()+constants.months[ind_today.getMonth()]+ind_today.getFullYear();
    let token_file_data = await read_json_file("./data/response.json");
    while(!nxt_exp){
        for(let obj of token_file_data){
            if(obj.expiry === temp && obj.name === constants.scripts.BANKNIFTY){
                nxt_exp = ind_today;
                //console.log(nxt_exp);
                break;
            }
        }
        if(nxt_exp){
            break;
        }
        ind_today.setDate(ind_today.getDate()+1);
        //console.log(typeof ind_today,typeof temp);
        temp = ind_today.getDate()+constants.months[ind_today.getMonth()]+ind_today.getFullYear();
        //console.log(ind_today,temp);
    }
    return nxt_exp;
}



const populate_tokendata_to_leg = async (leg)=>{
    let ltp_token_obj = await token_data.get_token_with_symbol_exchange(leg.script,constants.exchanges.NSE);
        //console.log(ltp_token_obj);
        let ltp= null;
        try{
            let ltp_res = await requests.get_ltp_data(req_body_util.ltp_body(ltp_token_obj))
            ltp = ltp_res.data.ltp;
        }catch(ex){
            console.log("populate_tokendata_to_leg ltp",ex);
        }
        let strike = null;
        if(leg.strike===constants.option_types.ATM){
            strike = get_ATM_strike(leg.script,ltp);
        }else{
            strike = get_ioTM_strike(leg.script,ltp,leg.strike,leg.option_type);
        }

        let nxt_exp = await get_nxt_thu_expiry();
        let token_obj = await token_data.get_token_with_symbol_exchange(
        token_data.build_opt_token(
            //script,23,"MAR",23,strike,ce_pe
            leg.script,nxt_exp.getDate().toString()
            ,constants.months[nxt_exp.getMonth()]
            ,nxt_exp.getFullYear().toString().substring(2)
            ,strike,leg.option_type
            ),
            constants.exchanges.NFO
        )
        //console.log("token_obj: ",token_obj);
        leg.token_obj = token_obj;
}

const get_order_status = async (orderid)=>{
    try{
        let order = await get_order_obj(orderid);
        if(!order || !order.status){
            return null;
        }
        return order.status;
    }catch(ex){
        console.log("util get_order_status exception",ex);
    }
}

const get_order_obj = async (orderid)=>{
    try{
        let order_res = await requests.get_orderbook();
        if(!order_res || !order_res.data){
            throw new Error("error in prder res",order_res.errorcode);
        }
        let orders = order_res.data;
        let order = orders.filter(order=>{
            return order.orderid === orderid;
        })[0];
        return order;
    }catch(ex){
        console.log("util get_order_obj exception",ex);
    }
}

const is_connected_to_angel = async ()=>{
    try{
        let profile_res = await requests.get_profile();
        if(!profile_res || !profile_res.message){
            return false;
        }
        if(profile_res.message==="SUCCESS"){
            return true;
        }
        return false;
    }
    catch(ex){
        console.error("check abgel commection exception",ex);
        return false;
    }

}

//console.log(get_ioTM_strike(constants.scripts.BANKNIFTY,40000,"ITM10",constants.option_types.CE));

module.exports = {is_connected_to_angel,populate_tokendata_to_leg,get_nxt_thu_expiry,get_ATM_strike,get_ioTM_strike,get_BN_ltp,get_nxt_thu,read_json_file,get_ind_dmyhms,write_json_file,get_pos_obj,get_order_status,get_order_obj}

/*
{
        "token": "45716",
        "symbol": "BANKNIFTY09MAR2338100PE",
        "name": "BANKNIFTY",
        "expiry": "09MAR2023",
        "strike": "3810000.000000",
        "lotsize": "25",
        "instrumenttype": "OPTIDX",
        "exch_seg": "NFO",
        "tick_size": "5.000000"
    }
    */