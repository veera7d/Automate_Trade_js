const WebSocket = require('ws');
const ws_util = require("./websoc_util");
//const file_data = require('../data/file_data');
const constants = require("./../data/constants");
const Parser = require('binary-parser').Parser;


class Websocket_LTP {
    constructor(file_data) {
        this.websocket = new WebSocket("ws://smartapisocket.angelone.in/smart-stream",
            {
                headers: {
                    'Authorization': constants.get_auth_tokens().auth_token,
                    'x-xapi-key': constants.get_auth_tokens().api_key,
                    'x-Client-code': constants.get_auth_tokens().client_code,
                    'x-feed-token': constants.get_auth_tokens().feed_token
                }
            });
        this.payload = [];
        this.started = false;
        this.receiving = false;
        this.wsopen = false;
        this.websocket.on("open", () => {
            this.wsopen = true;
            setInterval(() => {
                if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) return;
                this.websocket.send("ping");
                console.log("ping");
            }, 29 * 1000);
        });
        this.websocket.on("error", (error) => {
            console.log(error);
            this.wsopen = false;
        });
        this.websocket.on("message", (data) => {
            //handle message
            let buff = new Buffer.from(data);
            const subscription_mode = new Parser().uint8('subscription_mode');
            if (subscription_mode.parse(buff)?.subscription_mode === 1) {
                this.update_ltp(file_data, LTP(data));
                return;
            }
            console.log(buff);
        });
        setTimeout(() => {
            this.manager();
        }, 5000);
    }
    subscribe_ltp(token_obj) {
        if (this.websocket.readyState !== WebSocket.OPEN) return;
        console.log("Subscribe", token_obj.token);
        this.started = true;
        let payload = ws_util.build_websoc_ltpreq(token_obj);
        this.payload.push(payload);
        this.websocket.send(JSON.stringify(payload));
    }
    unsubscribe_ltp(token_obj) {
        if (this.websocket.readyState !== WebSocket.OPEN) return;
        console.log("UNSubscribe", token_obj.token);
        let payload = ws_util.build_websoc_ltpreq(token_obj, false);
        let index = this.payload.findIndex((p => { return p.correlationID === token_obj.token }));
        if (index) {
            this.payload.splice(index, 1);
        }
        this.websocket.send(JSON.stringify(payload));
    }
    unsubscribe_all_ltp() {
        if (this.websocket.readyState !== WebSocket.OPEN) return;
        let payloadd = this.payload.action = 0;
        this.websocket.send(JSON.stringify(payloadd));
        this.started = false;
        this.payload = [];
    }
    update_ltp(file_data, data) {
        /*EXAMPLE DATA {
            subscription_mode: '1',
            exchange_type: '1',
            token: '"11536"',
            sequence_number: '1713919',
            exchange_timestamp: '1687493879000',
            last_traded_price: '322545'
        } */
        this.receiving = true;
        let input_legs = file_data.INPUT_LEGS;
        for (let leg in input_legs) {
            if(!input_legs[leg].LEG.token_obj){
                continue;
            }
            if (input_legs[leg].LEG.token_obj.token !== data.token.substring(1,data.token.length-1)) {
                continue;
            }
            input_legs[leg].LEG.ltp = parseFloat(data.last_traded_price) / 100;
            //console.log(data.token, input_legs[leg].LEG.ltp);
        }
    }

    manager() {
        if (this.started && this.receiving) {
            setTimeout(() => {
                this.manager();
            }, 3000);
            this.receiving = false;
            //console.log("working fine rerurning manager websocket");
            return;
        }
        if (this.started && !this.receiving) {
            if (this.websocket.readyState !== WebSocket.OPEN) return;
            this.payload.map(payloadd => this.websocket.send(JSON.stringify(payloadd)));
            this.receiving = false;
        }
    }
}

function LTP(buf) {
    const ltp = new Parser()
        .endianess('little')
        .int8('subscription_mode', { formatter: toNumber })
        .int8('exchange_type', { formatter: toNumber })
        .array('token', {
            type: 'uint8',
            length: 25,
            formatter: _atos,
        })
        .int64('sequence_number', { formatter: toNumber })
        .int64('exchange_timestamp', { formatter: toNumber })
        .int32('last_traded_price', { formatter: toNumber });

    return ltp.parse(buf);
}

function toNumber(number) {
    return number.toString();
}


function _atos(array) {
    var newarray = [];
    try {
        for (var i = 0; i < array.length; i++) {
            newarray.push(String.fromCharCode(array[i]));
        }
    } catch (e) {
        throw new Error(e);
    }

    let token = JSON.stringify(newarray.join(''));
    return token.replaceAll('\\u0000', '');
}

module.exports = { Websocket_LTP };