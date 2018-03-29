const to = require('./errors');

class Ethereum {
    constructor(){
        // 私有变量
        this._eth = null;
        this._acounts = null;
        this._interval = null;
        this._erc20_tokens = [];
        this._lastBlockNumber = 0;
        const Web3 = require('web3');
        this._web3 = new Web3();

        // 初始ETH配置
        const Tokens = require('../config/tokens');
        this._eth = Tokens["eth"];
        this._web3.setProvider(new Web3.providers.HttpProvider(this._eth.web3_url));
        [this._eth.private_key, this._eth.address] = this._readPrivateKey(this._eth.keystore, this._eth.unlock_password);

        // 初始ERC20配置
        for (let key in Tokens) {
            if (key != "eth" && Tokens[key].family == "ETH") {
                let token = Tokens[key];
                [token.private_key, token.address] = this._readPrivateKey(token.keystore, token.unlock_password);
                this._erc20_tokens.push(token);
            }
        }

        // 获取账号列表
        const Accounts = require('./accounts');
        this._acounts = new Accounts(this._web3);
        let error = this._acounts.loadAccounts();
        if (error != null) {
            throw error;
        }

        // 创建转账模块
        const Transfer = require('./transfer');
        this._transfer = new Transfer(this._web3);
    }

    // 开始轮询
    startPoll() {
        let self = this;
        if (this._interval == null) {
            const Notify = require('./notify');
            let handler = async function() {
                // 获取区块高度
                let web3 = self._web3;
                let error, blockNumber, block, transaction;
                [error, blockNumber] = await to(web3.eth.getBlockNumber());
                if (error != null) {
                    console.info("Failed to call `getBlockNumber`", error.message);
                    return
                }

                blockNumber = blockNumber - self._eth.confirmations;
                if (self._lastBlockNumber == 0) {
                    self._lastBlockNumber = blockNumber - 1;
                }
                if (blockNumber <= self._lastBlockNumber) {
                    return
                }

                // 获取区块信息
                [error, block] = await to(web3.eth.getBlock(blockNumber));
                if (error != null) {
                    console.info("Failed to call `getBlock`", error.message);
                    return
                }

                // 获取交易信息
                for (let i = 0; i < block.transactions.length;) {
                    [error, transaction] = await to(web3.eth.getTransaction(block.transactions[i]));
                    if (error != null) {
                        console.info("Failed to call `getTransaction`", block.transactions[i], error.message);
                        continue
                    }
                    
                    if (self._acounts.has(transaction.to)) {
                        let notify = new Notify();
                        notify.from         = transaction.from;
                        notify.to           = transaction.to;
                        notify.hash         = transaction.hash;
                        notify.blockNumber  = transaction.blockNumber;
                        notify.post(self._eth.walletnotify);
                    }
                    i++;
                }
                self._lastBlockNumber += 1;
            };
            this._interval = setInterval(handler, 3000);
        }
    }

    // 生成地址
    async generateAddress() {
        let error, address;
        let web3 = this._web3;
        [error, address] = await to(web3.eth.personal.newAccount(''));
        if (error != null) {
            console.info("Failed generate new eth address", error.message);
            return error
        }
        this._acounts.add(address);
        return [error, address];
    }
    
    // 读取私钥
    _readPrivateKey(keystore, unlock_password) {
        const fs = require("fs");
        const path = require('path');
        const keythereum = require("keythereum");

        let buffer = fs.readFileSync(path.join('.', keystore));
        try {
            let obj = JSON.parse(buffer);
            let privateKey = keythereum.recover(unlock_password, obj);
            return [privateKey, "0x"+obj.address];
        } catch (error) {
            console.error("Failed to get private key, unlock password is invalid.");
            throw error;
        }  
    }
}

module.exports = Ethereum
