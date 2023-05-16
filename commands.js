const util = require("./util/util");
const constants = require("./data/constants");
const order_util = require("./util/order_util");
const master_util = require("./util/master_util")
const file_data_js = require("./data/file_data");
const { Leg } = require("./util/leg");
const file_data = require("./data/file_data");


// Program will end if ind time is < time string
// time_str HH:MM:SS//
const time = (time_str)=>{
    //console.log("time:",file_data_js.getFileData())//delete line
    time_str = time_str.toString();
    if(time_str === ""){
        return true;
    }
    ind_obj = util.get_ind_dmyhms();
    ind_secs = (ind_obj.hours * 60 * 60)+(ind_obj.minutes * 60)+ind_obj.seconds;
    let [cond_hours,cond_mins,cond_s] = time_str.split(':');
    cond_secs = (cond_hours * 60 * 60)+(cond_mins * 60)+cond_s;
    if(parseInt(ind_secs)>parseInt(cond_secs)){
        return true;
    }
    return false;
}

//order command
const order = async (file_data,order_obj) =>{
    try{
        for(let comd in order_obj){
            if(comd==="PLACED")
            continue;
            if(comd==="SL"){
                let [leg_id,exit_value,PTS_PNL] = order_obj[comd];
                let leg = file_data.INPUT_LEGS[leg_id]["LEG"];
                //place sl stoploss limit order
                //exit_value = convert to points
                if(PTS_PNL==="PNL"){
                    exit_value = exit_value/constants.lot_size[leg.script];
                }
                leg.sl_price = exit_value;
                continue;
            }
            for(let legid of order_obj[comd]){
                console.log("order:",legid,comd);
                if(comd === constants.command_const.ENTER){
                    let leg = file_data.INPUT_LEGS[legid]["LEG"];
                    leg.enter();
                }else if(comd === constants.command_const.MODIFY){

                }else if(comd === constants.command_const.EXIT){
                    if(legid==="ALL"){
                        master_util.exit_all_legs(file_data.INPUT_LEGS);
                        break;
                    }
                    let leg = file_data.INPUT_LEGS[legid]["LEG"];
                    leg.exit();
                }else{
                    console.log("wrong ORDER Command ",comd);
                }
            }
        }
    }catch(ex){
        console.log("exception command order ",ex);
    }
}

//[LEG_id,VARIABLE,VALUE,ABS_PTS]
const rule = async (input_legs,rule)=>{
    //console.log("IN RULE: ",typeof rule,rule);
    //let [leg,P_or_L,value,pnl_pts]=rule;

    let leg = rule[0];
    let P_or_L = rule[1];
    let value = rule[2];
    let pnl_pts = rule[3];
    //console.log(leg,P_or_L,value,pnl_pts);
    
    leg = input_legs[leg]["LEG"];

    let leg_pnl = leg.pnl;
    if(pnl_pts === "PTS"){
        value = value * constants.lot_size[leg.script];
        leg_pnl = leg_pnl * constants.lot_size[leg.script];
    }
    if(P_or_L === "PROFIT"){
        if(leg_pnl > value){
            console.log("profit, ",leg_pnl ,">", value);
            return true;
        }
    }else{
        if(leg_pnl < -value){
            console.log("loss, ",leg_pnl ,"<", -value);
            return true;
        }
    }
    //console.log("false, ",leg_pnl, value);
    return false;
}

const condition = async (file_data,cond_obj) => {
    let is_cond_true = undefined;
    for(let key in cond_obj){
        if(!key.includes("RULE")){
            continue;
        }
        let rule_res = await rule(file_data.INPUT_LEGS,cond_obj[key]);
        if(is_cond_true === undefined){
            is_cond_true = rule_res;
            continue;
        }
        is_cond_true = is_cond_true && rule_res;
    }
    if(is_cond_true){
        if(cond_obj["NXT_BLOCK"] === "EXIT"){
            file_data.CURR_RUNNING.running = 0;
            await master_util.save_state();
            return true;
        }
        file_data.CURR_RUNNING.running = cond_obj["NXT_BLOCK"];
        await master_util.save_state();
        return true;
    }
}

const block = async (file_data,block_obj)=>{
    try{
        for(let obj in block_obj){
            if(obj === "ORDER"){
                if(block_obj[obj].PLACED)
                continue;
                block_obj[obj].PLACED = true;
                console.log("ORDER CALL in block",block_obj[obj]);
                order_res = await order(file_data,block_obj[obj]);
            }else
            if(obj.includes(constants.command_const.CONDITION)){
                cond_res = await condition(file_data,block_obj[obj]);
                if(cond_res){
                    return;
                }
            }
        }
    }catch(ex){
        console.log("error in block",ex);
    }
}

const start = async (file_data,start_obj)=>{
    for(let obj in start_obj){
        console.log(obj,start_obj[obj]);
        if(obj==constants.command_const.TIME){
            time_out = time(start_obj[obj]);
            //console.log("time out",time_out);
            if(!time_out){
                //console.log("exiting process in enter block as time not meet");
                return;
            }
        }else if(obj==="ORDER"){
            console.log("ORDER CALL ",start_obj);
            order_res = await order(file_data,start_obj[obj]);

        }else if(obj === "NXT_BLOCK"){
            file_data.CURR_RUNNING.running= start_obj[obj];
            await master_util.save_state();
            console.log(file_data.CURR_RUNNING.running);
        }
    }
}

const end = async (file_data,end_obj)=>{
    for(let obj in end_obj){
        //console.log(obj,end_obj[obj]);
        if(obj==constants.command_const.TIME){
            let time_out = time(end_obj[obj]);
            if(!time_out){
                return false;
            }
            continue;
            
        }else if(obj==="ORDER"){
            console.log("ORDER CALL ",end_obj);
            order_res = await order(file_data,end_obj[obj]);

        }
        // else if(obj==constants.command_const.EXIT){
        //     if(end_obj[obj][0]==="ALL"){
        //         //exit all the legs
        //         master_util.exit_all_legs(file_data.INPUT_LEGS);
        //         break;
        //     }
            
        // }
        file_data.CURR_RUNNING.running = 0;
        break;
    }
    // setTimeout(()=>{
    //     console.log("exiting the process");
    //     process.exit(0);
    // },60*1000)
    return true;
}

module.exports = {start,end,time,block}