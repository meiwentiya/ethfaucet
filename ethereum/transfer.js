const to = require('./errors');
var Tx = require('ethereumjs-tx');

class Transfer {
    constructor(web3){
        this._web3 = web3;
    }

    // 发送eth代币
    async sendToken(from, to, amount, privateKey) {
        // 构造消息
        let web3 = this._web3;
        let error, gasPrice, count, transaction;
        [error, gasPrice] = await web3.eth.getGasPrice();
        if (error != null) {
            return error;
        }
        [error, count] = await web3.eth.getTransactionCount(from);
        if (error != null) {
            return error;
        }
        var rawTransaction = {
            from        : from,
            to          : to,
            nonce       : web3.utils.toHex(count),
            gasLimit    : '0x5208',
            gasPrice    : web3.utils.toHex(gasPrice),
            value       : web3.utils.toHex(web3.utils.toWei(amount))
        }

        // 签名消息
        var tx = new Tx(rawTransaction);
        tx.sign(privateKey);
        var serializedTx = tx.serialize();  

        // 发送签名消息
        [error, transaction] = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        if (error != null) {
            return error;
        }
        return [null, transaction.transactionHash];
    }

    // 发送erc20代币
    sendERC20Token(from, privateKey) {

    }
};

module.exports = Transfer;
