const future = require('../conmon/future');

class RPCServer {
    constructor(ethereum, options){
        this._schema = {};
        this._ethereum = ethereum;

        let self = this;
        const rpc = require('node-json-rpc');
        this._server = new rpc.Server(options);
        this._server.addMethod('eth_sendToken', function(data, callback) {
            self._ethSendToken(data, callback);
        });
        this._server.addMethod('eth_sendERC20', function(data, callback) {
            self._ethSendERC20(data, callback);
        });
    }

    // 开始服务
    start() {
        this._server.start(function (error) {
            if (error) {
                throw error;
            } else {
                console.log('JSON RPC server running ...');
            }
        });
    }

    // 发送ETH
    async _ethSendToken(data, callback) {
        // 校验参数
        if (data.length < 2) {
            let error = {code: -32602, message: "Invalid params" };
            callback(error, undefined);
            return
        }

        if (typeof data[0] != 'string' || data[0].length != 42) {
            let error = {code: -32602, message: "Invalid params, to address" };
            callback(error, undefined);
            return 
        }
        if (typeof data[1] != 'string' || !data[1].match("(^-?[0-9.]+)")) {
            let error = {code: -32000, message: "Invalid param, amount"};
            callback(error, undefined);
            return 
        }

        // 发送代币
        let error, hash;
        [error, hash] = await future(this._ethereum.sendToken(data[0], data[1]));
        if (error != null) {
            error = {code: -32000, message: error.message};
            callback(error, undefined);
        }
        callback(undefined, {'result': {'hash': hash}});
    }

    // 发送ERC20
    async _ethSendERC20(data, callback) {
        // 校验参数
        if (data.length < 3) {
            let error = {code: -32602, message: "Invalid params" };
            callback(error, undefined);
            return
        }

        if (typeof data[0] != 'string') {
            let error = {code: -32602, message: "Invalid params, token symbol" };
            callback(error, undefined);
            return 
        }
        if (typeof data[1] != 'string' || data[1].length != 42) {
            let error = {code: -32602, message: "Invalid params, to address" };
            callback(error, undefined);
            return 
        }
        if (typeof data[2] != 'string' || !data[2].match("(^-?[0-9.]+)")) {
            let error = {code: -32000, message: "Invalid param, amount"};
            callback(error, undefined);
            return 
        }

        // 发送代币
        let error, hash;
        [error, hash] = await future(this._ethereum.sendERC20Token(data[0], data[1], data[2]));
        if (error != null) {
            error = {code: -32000, message: error.message};
            callback(error, undefined);
        }
        callback(undefined, {'result': {'hash': hash}});
    }
}

module.exports = RPCServer;
