const fs = require("fs");


//get by symbol
const get_token_with_symbol = async (symbol)=>{
    try{
    let data = await fs.promises.readFile("response.json",'utf8');
    let j_ob =  JSON.parse(data)
    return j_ob.find(obj => obj.symbol === symbol)
    }
    catch(err){
        return err
    }
}

//get by symbol,exchange
const get_token_with_symbol_exchange = async (symbol,exchange)=>{
    try{
    let data = await fs.promises.readFile("./data/response.json",'utf8');
    let j_ob = JSON.parse(data)
    return j_ob.find(obj => obj.symbol === symbol && obj.exch_seg === exchange)
    }
    catch(err){
        return err
    }
}

const get_token_with_name_exp_strike = async(namee, expiry, strike, pe_ce)=>{
    return await get_token_with_symbol(namee.toUpperCase()+expiry+parseInt(strike)+pe_ce.toUpperCase())
}

//NIFTY06APR2315950PE
//constants.scripts.NIFTY,16,"MAR",23,16500,constants.option_types.PE
//
const build_opt_token = (script,date,month,year,strike,option_type)=>{
    console.log(script+date.toString()+month+year.toString()+strike.toString()+option_type);
    return script+date.toString()+month+year.toString()+strike.toString()+option_type;
}

module.exports = {get_token_with_symbol,get_token_with_name_exp_strike,get_token_with_symbol_exchange,build_opt_token}

///Users/hanuma/Documents/projects/Automate virtual trade/Smart API/Test/
