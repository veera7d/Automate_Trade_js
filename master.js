const util = require("./util/util");
const commands = require("./commands");
const constants = require("./data/constants");
const master_util = require("./util/master_util");
const requests = require("./util/requests");
const {Leg} = require("./util/leg")
//const token_data = require("./util/token_data");
const order_util = require("./util/order_util");
const req_body_util = require("./util/req_body_util");
const file_data_js = require("./data/file_data");


const load_leg_objs = async (input_legs)=>{
    for(let leg_id in input_legs){
        let leg_leg = input_legs[leg_id]["LEG"];
        // let [script,order_action,strike_str,option_type,lots,order_type,price] = order_str;
        // console.log(legid,script,order_action,strike_str,option_type,lots,order_type,price);
        // let leg = new Leg(legid,script,order_action,strike_str,option_type,lots,order_type,price);
        // input_legs[legid]["LEG"] = leg;


        let {legid,script,order_action,strike,option_type,lots,order_type,price,token_obj,ltp,status,pnl,enter_orderid,entry_price,exit_orderid,exit_price,sl_price,sl_trigger_pricee,enter_excp,exit_excp} = leg_leg;

        let leg = new Leg(legid,script,order_action,strike,option_type,lots,order_type,price);
        input_legs[legid]["LEG"] = leg;

        leg.token_obj= token_obj;
        leg.ltp=ltp;
        leg.status=status;
        leg.pnl=pnl;
        leg.enter_orderid=enter_orderid;
        leg.entry_price=entry_price;
        leg.exit_orderid=exit_orderid;
        leg.exit_price=exit_price;
        leg.sl_price=sl_price;
        leg.sl_trigger_pricee=sl_trigger_pricee;
        leg.enter_excp=enter_excp;
        leg.exit_excp=exit_excp;
    }
}


const add_leg_objs = async (input_legs)=>{
    for(let legid in input_legs){
        let order_str = input_legs[legid]["INPUT"];
        let [script,order_action,strike_str,option_type,lots,order_type,price] = order_str;
        console.log(legid,script,order_action,strike_str,option_type,lots,order_type,price);
        let leg = new Leg(legid,script,order_action,strike_str,option_type,lots,order_type,price);
        input_legs[legid]["LEG"] = leg;
    }
}

const update_leg_status = async (file_data)=>{
    try{
        for(let leg_id in file_data.INPUT_LEGS){
            //console.log(leg_id,file_data.INPUT_LEGS[leg_id]);
            let leg = file_data.INPUT_LEGS[leg_id].LEG;
            //console.log("legggggg:",leg)
            if(leg===null){continue;}
            await leg.check_status();
            file_data_js.setFileData(file_data);
            await master_util.save_state();
        }
        setTimeout(()=>{
            update_leg_status(file_data);
        },2*1000);
    }catch(ex){
        console.log("exception in update status legs: ",ex);
    }
}


const ltp_update = async (file_data)=>{
    let input_legs = file_data.INPUT_LEGS;
    let inline_output = "PNL ";

    const reset = "\x1b[0m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const blue = "\x1b[34m";

    for(let legid in input_legs){
        let leg = input_legs[legid]["LEG"];
        if(!leg || !leg.token_obj){
            continue;
        }
        if(leg.status>0){
            leg.ltp = await order_util.get_ltp(req_body_util.ltp_body(leg.token_obj));
        }
        if(leg.entry_price && !leg.exit_price){
            if(leg.order_action===constants.order_action.BUY){
                leg.pnl = leg.ltp - leg.entry_price;
                //console.log("Leg ",leg.legid," PNL: ",leg.pnl);
            }else if(leg.order_action===constants.order_action.SELL){
                leg.pnl = leg.entry_price - leg.ltp;
                //console.log("Leg ",leg.legid," PNL: ",leg.pnl);
            }else{
                console.error("invalid order action",leg.order_action);
            }
            if(leg.pnl>0){
                inline_output+=(` ID ${blue}${parseInt(legid)} ${green}${parseInt(leg.pnl)}${reset}|`);
            }else{
                inline_output+=(` ID ${blue}${parseInt(legid)} ${red}${parseInt(leg.pnl)}${reset}|`);
            }
            
        }
    }
    process.stdout.write(inline_output);
    process.stdout.write('\r');

    file_data_js.setFileData(file_data);
    await master_util.save_state();
    setTimeout(()=>{
        ltp_update(file_data)
    },0.2*1000);
}


const rule_execution = async(file_data,previous_running=-2)=>{
    //console.log(leg_id,file_data.INPUT_LEGS[leg_id]);
    let endd = false;
    let curr_running = file_data["CURR_RUNNING"];
    if(previous_running != curr_running.running){
        previous_running = curr_running.running;
        console.log("current running in master",curr_running.running);
    }
    try{
        if(curr_running.running==-1)
            await commands.start(file_data,file_data[constants.command_const.START]);
        else if(curr_running.running==0){
            endd = await commands.end(file_data,file_data[constants.command_const.END]);
            //console.log("program ended");
            //process.exit(0);
        }else{
            block_res = await commands.block(file_data,file_data[constants.command_const.BLOCK+curr_running.running]);
            //console.log("in while; current running",file_data.CURR_RUNNING);
        }
        if(endd)
        return;
        setTimeout(()=>{
            rule_execution(file_data,previous_running)
        },6*1000);
    }catch(ex){
        console.log(ex);
    } 
}
 
const master = async (json_file_path)=>{
    if(!await util.is_connected_to_angel()){
        console.error("Can not connect to angel");
        return;
    }
    let file_data;
    try{
        file_data = await util.read_json_file(json_file_path);
        file_data_js.setFileData(file_data);
    }catch(ex){
        console.log("error while reading file ",json_file_path,ex)
    }
    if(json_file_path=="./data/savestate.json"){
        load_leg_objs(file_data.INPUT_LEGS);
    }else{
        add_leg_objs(file_data.INPUT_LEGS);
    }
    ltp_update(file_data);
    update_leg_status(file_data);
    rule_execution(file_data);
}


// let leg = new Leg('BANKNIFTY','SELL','ATM','CE',2)
// leg.place_order();


// //console.log("file:data:  ",file_data_js.file_data);
// master("./data/master_data.json")
// .then(data=>console.log("master:",file_data_js.getFileData()));



util.read_json_file("./data/savestate.json")
.then(data=>{
    if(data.CURR_RUNNING.running<1){
        throw new Error("Not an incomplete file");
    }
    master("./data/savestate.json")
})
.then(data=>console.log("master: end"))
.catch(err=>{
    console.log("error in savestate read",err);
    master("./data/master_data.json")
})


// util.get_nxt_thu_expiry()
// .then(data=>console.log(data));

// requests.get_orderbook()
// .then(order_res=>
//     console.log(order_res)
//     )
// .catch(ex=>console.log(ex));


// const time_test = async (time_str)=>{
//     await commands.time(time_str);
//     console.log("hi");
// }

// time_test("08:10:10")
// .then(console.log("completed"))

