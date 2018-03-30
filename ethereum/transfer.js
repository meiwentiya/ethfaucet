let Tx = require('ethereumjs-tx');
let logger = require('../common/logger');
const future = require('../common/future');

class Transfer {
    constructor(web3){
        this._web3 = web3;
    }

    // 发送eth代币
    async sendToken(from, to, amount, privateKey) {
        // 检查余额
        let error, balance;
        let web3 = this._web3;
        [error, balance] = await future(web3.eth.getBalance(from, 'latest'));
        if (error != null) {
            logger.error('Failed to send token, getBalance, %s', error.message);
            throw error;
        }
        amount = web3.utils.toWei(amount);
        if (amount > balance) {
            error = new Error('Insufficient coins');
            logger.error('Failed to send token, %s', error.message);
            throw error;
        }
     
        // 构造消息
        let gasPrice, count, transaction;
        [error, gasPrice] = await future(web3.eth.getGasPrice());
        if (error != null) {
            logger.error('Failed to send token, %s', error.message);
            throw error;
        }
        [error, count] = await future(web3.eth.getTransactionCount(from));
        if (error != null) {
            logger.error('Failed to send token, %s', error.message);
            throw error;
        }
        let rawTransaction = {
            from        : from,
            to          : to,
            nonce       : web3.utils.toHex(count),
            gasLimit    : web3.utils.toHex(500000),
            gasPrice    : web3.utils.toHex(gasPrice),
            value       : web3.utils.toHex(amount)
        }

        // 签名消息
        let tx = new Tx(rawTransaction);
        tx.sign(privateKey);
        let serializedTx = tx.serialize();  

        // 发送签名消息
        let receipt = null;
        let input = '0x' + serializedTx.toString('hex');
        [error, receipt] = await future(web3.eth.sendSignedTransaction(input));
        if (error != null) {
            logger.error('Failed to send token, %s', error.message);
            throw error;
        }
        return receipt.transactionHash;
    }

    // 发送erc20代币
    async sendERC20Token(contractaddress, from, to, amount, privateKey) {
        // 构造合约
        let error, balance;
        let web3 = this._web3;
        const abi = require('./abi');
        amount = web3.utils.toWei(amount);
        let contract = new web3.eth.Contract(abi, contractaddress);

        // 检查余额
        [error, balance] = await future(contract.methods.balanceOf(from).call());
        if (error != null) {
            logger.error('Failed to send erc20 token, balanceOf, %s', error.message);
            throw error;
        }
        if (amount > balance) {
            error = new Error('Insufficient coins');
            logger.error('Failed to send erc20 token, %s', error.message);
            throw error;
        }

        // 构造消息
        let gasPrice, count, transaction;
        [error, gasPrice] = await future(web3.eth.getGasPrice());
        if (error != null) {
            logger.error('Failed to send erc20 token, %s', error.message);
            throw error;
        }
        [error, count] = await future(web3.eth.getTransactionCount(from));
        if (error != null) {
            logger.error('Failed to send erc20 token, %s', error.message);
            throw error;
        }
        let rawTransaction = {
            from        : from,
            to          : contractaddress,
            nonce       : web3.utils.toHex(count),
            gasLimit    : web3.utils.toHex(500000),
            gasPrice    : web3.utils.toHex(gasPrice),
            data        : contract.methods.transfer(to, amount).encodeABI(),
        }

        // 签名消息
        let tx = new Tx(rawTransaction);
        tx.sign(privateKey);
        let serializedTx = tx.serialize();

        // 发送签名消息
        let receipt = null;
        let input = '0x' + serializedTx.toString('hex');
        [error, receipt] = await future(web3.eth.sendSignedTransaction(input));
        if (error != null) {
            logger.error('Failed to send erc20 token, %s', error.message);
            throw error;
        }
        return receipt.transactionHash;
    }

};

module.exports = Transfer;
