const requests = require("./requests");
const constants = require("../data/constants");
const order_util = require("./order_util");
//const file_data_js = require("../data/file_data");
const util = require("./util")

class Entry_Exit{
    
}

class Leg{
    constructor(legid,script,order_action,strike,option_type,lots,order_type=null,price=null){
        this.legid = legid;
        this.script=script;
        this.order_action=order_action;
        this.strike=strike;
        this.option_type=option_type;
        this.lots = lots;
        this.order_type = order_type;
        this.price = price;

        this.token_obj = null;
        this.ltp = null;

        this.subscribed_ltp = false;
        
        //this.pos_obj = {};
        //this.order_status = null;
        this.status = 0;
        this.pnl=0;
        
        //this.stop_loss_order=null;

        this.enter_orderid = null;
        this.entry_price = null;

        this.exit_orderid = null;
        this.exit_price=null;
        this.sl_price = null;
        this.sl_trigger_pricee = null;

        this.enter_excp = null;
        this.exit_excp = null;
    }

    async update_enter_order_status(){
        try{
            // //delete this unbtil return;
            // //if(this.enter_orderid!=null){
            //     this.status = 2;
            // //}
            // return;
            let enter_order_obj = await util.get_order_obj(this.enter_orderid);
            if(!enter_order_obj || !enter_order_obj.status){
                console.error("error while updating entry order status",enter_order_obj);
                return;
            }
            
            if(enter_order_obj.status === "complete"){
                this.status = 2;
                //update order entry price
                this.entry_price = enter_order_obj.price;
                //place sl order if available
                if(this.sl_price){
                    if(this.order_action===constants.order_action.BUY){
                        this.sl_price = this.entry_price - this.sl_price;
                        this.sl_trigger_pricee = this.sl_price+(this.sl_price*0.01);
                    }else{
                        this.sl_price = this.entry_price + this.sl_price;
                        this.sl_trigger_pricee = this.sl_price-(this.sl_price*0.01);;
                    }
                    this.exit();
                }
            }else if(enter_order_obj.status === "open"){
                return;
            }else if(enter_order_obj.status === "rejected" || enter_order_obj.status === "cancelled"){
                //this.status=1; // uncomment this
                this.status = 2; // delete this
                this.entry_price = this.ltp;//delete this
                if(this.sl_price){//delete this
                    if(this.order_action===constants.order_action.BUY){//delete this
                        this.sl_price = this.entry_price - this.sl_price;//delete this
                        this.sl_trigger_pricee = this.sl_price+(this.sl_price*0.01);//delete this
                    }else{//delete this
                        this.sl_price = this.entry_price + this.sl_price;//delete this
                        this.sl_trigger_pricee = this.sl_price-(this.sl_price*0.01);;//delete this
                    }
                    this.exit();//delete this
                }//delete this
            }

        }catch(ex){
            console.error("update_enter_order_status: ",ex);
        }
        
    }

    async update_exit_order_status(){
        try{
            // //delete this unbtil return;
            // //if(this.enter_orderid!=null){
            //     this.status = 2;
            // //}
            // return;
            let exit_order_obj = await util.get_order_obj(this.exit_orderid);
            if(!exit_order_obj  || !exit_order_obj.status){
                console.error("error while updating entry order status",exit_order_obj);
                return;
            }
            
            if(exit_order_obj.status === "complete"){
                this.status = 4;
                this.exit_price = exit_order_obj.price;
            }else if(exit_order_obj.status === "open"){
                return;
            }else if(exit_order_obj.status === "rejected" || exit_order_obj.status === "cancelled"){
                //this.status=3; // uncomment this
                this.status = 4; // delete this
                this.exit_price =this.ltp;//delete this
            }

        }catch(ex){
            console.error("update_enter_order_status: ",ex);
        }
        
    }

    async update_status(){
        switch(this.status){
            case 1:
                this.update_enter_order_status();
                break;
            case 3:
                this.update_exit_order_status();
                break;
            default:
                console.log("update status:",this.status);
        }
    }

    async check_status(){
        //console.log("in check status",this.legid);
        switch(this.status){
            case 0:
                return;
            case 1:
                if(this.enter_orderid){
                    await this.update_status();
                    return;
                }
                await this.place_order();
                await this.update_status();
                break;
            case 2:
                if(this.enter_excp !== null){
                    this.status=1;
                }
                // // in 2 we no need to update the status
                // else{
                //     await this.update_status();
                // }
                break;
            case 3:
                if(this.exit_orderid){
                    await this.update_status();
                    return;
                }
                await this.place_order(false);
                await this.update_status();
                break;
            case 4:
                if(this.exit_excp === null){
                    this.status=0;
                }else{
                    this.status=3;
                }
                break;
            default:
                console.log("check status:",this.status);
        }
    }

    async place_order(enter = true){
        let order_action = this.order_action;
        if(!enter){
            if(order_action === constants.order_action.BUY){
                order_action = constants.order_action.SELL;
            }else if(order_action === constants.order_action.SELL){
                order_action = constants.order_action.BUY;
            }else{
                throw Error("invalid order action:",this.order_action);
            }
        }
        try{
            let {order_res,token_obj} = await order_util.place_option_order(
                this.legid,
                this.script,
                this.option_type,
                order_action
                ,this.lots*constants.lot_size[this.script],
                this.strike,
                this.order_type,
                enter ? this.price : this.sl_price,
                enter ? null : this.sl_trigger_pricee);
                this.token_obj=token_obj;
            console.log("enter:",enter,order_res);
            if(!order_res.data.orderid){
                console.log("order_res is empty",order_res);
                throw new Error("order_res is empty",order_res);
            }
            if(enter){
                this.enter_orderid = order_res.data.orderid;
                console.log("enter_orderid:",this.enter_orderid);
            }else{
                this.exit_orderid = order_res.data.orderid;
            }
        }catch(ex){
            if(enter){
                this.enter_excp = ex;
            }else{
                this.exit_excp = ex;
            }
            console.log("leg place order:",ex);
        }
    }

    async exit(){
        //this.place_order();
        if(this.status < 2){
            console.log("exit leg status:",this.status);
            return;
        }
        if(this.status==2){
            this.status=3;
        }
        //this.place_order(false);//delete
    }

    async enter(){
        if(this.status >1){
            console.log("entry leg status:",this.status);
            return;
        }
        util.populate_tokendata_to_leg(this);
        if(this.status<1){
            this.status=1;
        }
        //this.place_order();//delete
    }
}

module.exports = {Leg};