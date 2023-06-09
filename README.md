# Automate_Trade_js
automating intraday trades with no coding needed.

-> In BLOCKS the RULE command will be executed with "and" condition within them.
             the CONDITION command will be executed with "or" condition within them.

{
    "CURR_RUNNING":
    {
        "running":int  //should start with -1
    },
    "INPUT_LEGS": //the input legs shoud be selected first  - all the legs used in the stratagie
    {
        "1":{ //leg id willl be used to enter and exit
            "INPUT":["script","BUY/SELL","STRIKE","CE/PE",LOTS,ORDER_TYPE,LIMIT-PRICE], // leg parameters - leave ordertype and limite_price emoty for market order
            "LEG":null //should be initiated to null will be populated by master.js
        },
        "2":{
            "INPUT":["BANKNIFTY","SELL","ITM2","PE",2],
            "LEG":null
        }
    },
    "START":
    {
        "TIME":"01:00:00", // the program will wait until this time is crossed in a given day.
        "ORDER":{ // order command is used to place order defined inside it.
            "ENTER":["1","2"] // enter command - used to enter the legs with give list of ids.
        },
        "NXT_BLOCK":1 // the execution will go to next block 1(BLOCK1)
    },
    "BLOCK1":
    {
        "CONDITION1": // holds rules to check the conditions with and condition within them and next block to be executed if all the rules are true in this condition command
        {
            "RULE1":["leg_id","PROFIT/LOSS",int_value,"PTS/PNL"], // taked leg_id , profit or loss to be checked for that leg and the value in actual pnl or points the option move.
            "NXT_BLOCK":0 // the next block to be executed 0 means exit block.
        }
    },
    "BLOCK2":
    {
        "ORDER":{
            "PLACED":false, // if the order placed is true then ignore this command.
            "EXIT":["1"] // exit command will take the legids and close those positions.
        },
        "CONDITION1":
        {
            "RULE1":["1","LOSS",1000,"PNL"],
            "NXT_BLOCK":0
        }
    },
    "END":
    {
        "TIME":"05:25:00", // waits until this time is crossed and execute all other commands.
        "ORDER":{
            "EXIT":["ALL"]
        }
    }
}



example:
{
    "CURR_RUNNING":
    {
        "running":-1
    },
    "INPUT_LEGS":
    {
        "1":{
            "INPUT":["BANKNIFTY","SELL","OTM2","CE",2],
            "LEG":null
        },
        "2":{
            "INPUT":["BANKNIFTY","SELL","ITM2","PE",2],
            "LEG":null
        }
    },
    "START":
    {
        "TIME":"01:00:00",
        "ORDER":{
            "ENTER":["1","2"]
        },
        "NXT_BLOCK":1
    },
    "BLOCK1":
    {
        "CONDITION1":
        {
            "RULE1":["1","PROFIT",2000,"PTS"],
            "NXT_BLOCK":0
        }
    },
    "BLOCK2":
    {
        "ORDER":{
            "PLACED":false,
            "EXIT":["1"]
        },
        "CONDITION1":
        {
            "RULE1":["1","LOSS",1000,"PNL"],
            "NXT_BLOCK":0
        }
    },
    "END":
    {
        "TIME":"05:25:00",
        "ORDER":{
            "EXIT":["ALL"]
        }
    }
}
