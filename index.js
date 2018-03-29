const Server = require('./config/server');
const RpcServer = require("./app/rpcserver");
const Ethereum = require("./ethereum/ethereum");

// 启动以太坊服务
let eth = new Ethereum();
eth.startPoll();

// 启动JSON-RPC服务
const options = {
  port: Server.port,
  host: Server.rpc_host
};
let server = new RpcServer(eth, options);
server.start();
