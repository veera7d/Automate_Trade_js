const requests = require("./requests");
const util = require("./util");
const file_data_js = require("../data/file_data")


const save_state = async () => {
    return await util.write_json_file("./data/savestate.json",file_data_js.getFileData());
} 

const add_order_to_file = (file_orders,order_res) =>{
    file_orders[order_res.data.orderid] = {"script":order_res.data.script,"status":null};
}

const update_order_status = async (file_orders,orderid) =>{
    try{
        let order_res = await requests.get_orderbook();
        for(let order of order_res.data){
            if(order.orderid===orderid){
                file_orders[orderid] = order.status;
            }
        }
    }catch(ex){
        console.log("ex update order status",ex);
    }
}

const add_position_to_file_data = (file_positions,symbolname,quantity) =>{
    if(file_positions[symbolname]){
        file_positions[symbolname].quantity += quantity;
        return;
    }
    file_positions[symbolname] = {quantity: quantity,pos_obj:{}};
}

const update_position_status = async (file_positions,symbolname) =>{
    try{
        let position_res = await requests.get_positions();
        for(let pos of position_res.data){
            if(pos.symbolname===symbolname){
                file_positions[symbolname].pos_obj = pos;
            }
        }
    }catch(ex){
        console.log("ex update order status",ex);
    }
}

const exit_leg=(leg_obj)=>{
    leg_obj.exit();
}

const exit_all_legs = (input_legs)=>{
    for(let leg in input_legs){
        if(!input_legs[leg].LEG){
            continue;
        }
        exit_leg(input_legs[leg].LEG);
    }
}

module.exports = {save_state,exit_all_legs,exit_leg};