const Web3 = require('web3');
const Notify = require('./notify');
const Accounts = require('./accounts');
const Transfer = require('./transfer');
const Tokens = require('../config/tokens');

class Ethereum {
    constructor(){
        // 私有变量
        this._eth = null;
        this._acounts = null;
        this._interval = null;
        this._web3 = new Web3();
        this._erc20_tokens = [];
        this._lastBlockNumber = 0;

        // 初始ETH配置  
        this._eth = Tokens["eth"];
        this._web3.setProvider(new Web3.providers.HttpProvider(this._eth.web3_url));
        this._eth.private_key = this._readPrivateKey(this._eth.keystore, this._eth.unlock_password);

        // 初始ERC20配置
        for (let key in Tokens) {
            if (key != "eth" && Tokens[key].family == "ETH") {
                let token = Tokens[key];
                token.private_key = this._readPrivateKey(token.keystore, token.unlock_password);
                this._erc20_tokens.push(token);
            }
        }

        // 获取账号列表
        this._acounts = new Accounts(this._web3);
        this._acounts.loadAccounts();

        // 创建转账模块
        this._transfer = new Transfer(this._web3);
        this._transfer.sendToken(
            "0xB49446a6379412222330B7739149B70B1aBF113D",
            "0xC299Ac73687Fa17e10A206c47DC0E81b8c7828E6",
            "1",
            this._eth.private_key);
    }

    // 开始轮询
    startPoll() {
        let self = this;
        if (this._interval == null) {
            let handler = async function() {
                // 获取区块高度
                let web3 = self._web3;
                let blockNumber = await web3.eth.getBlockNumber();
                blockNumber = blockNumber - self._eth.confirmations;
                if (self._lastBlockNumber == 0) {
                    self._lastBlockNumber = blockNumber - 1;
                }
                if (blockNumber <= self._lastBlockNumber) {
                    return
                }

                // 获取区块信息
                let block = await web3.eth.getBlock(blockNumber);

                // 获取交易信息
                for (let idx in block.transactions) {
                    let transaction = await web3.eth.getTransaction(block.transactions[idx]);               
                    if (self._acounts.has(transaction.to)) {
                        let notify = new Notify();
                        notify.from         = transaction.from;
                        notify.to           = transaction.to;
                        notify.hash         = transaction.hash;
                        notify.blockNumber  = transaction.blockNumber;
                        notify.post(self._eth.walletnotify);
                    }
                }
                self._lastBlockNumber += 1;
            };
            //this._interval = setInterval(handler, 1000);
        }
    }

    // 生成地址
    async generateAddress() {
        let web3 = this._web3;
        let address = await web3.eth.personal.newAccount('');
        this._acounts.add(address);
        return address;
    }
    
    // 读取私钥
    _readPrivateKey(keystore, unlock_password) {
        const fs = require("fs");
        const path = require('path');
        const keythereum = require("keythereum");

        let buffer = fs.readFileSync(path.join('.', keystore));
        try {
            let privateKey = keythereum.recover(unlock_password, JSON.parse(buffer));
            return privateKey;
        } catch (error) {
            console.error("Failed to get private key, unlock password is invalid.");
            throw error;
        }  
    }
}

module.exports = Ethereum
