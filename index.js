const Ethereum = require("./ethereum/ethereum");

let eth = new Ethereum();
eth.generateAddress();
eth.startPoll();
