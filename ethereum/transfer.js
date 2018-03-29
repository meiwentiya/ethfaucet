let Tx = require('ethereumjs-tx');
const future = require('../conmon/future');

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
            throw error;
        }
        amount = web3.utils.toWei(amount);
        if (amount > balance) {
            throw new Error('Insufficient coins');
        }
     
        // 构造消息
        let gasPrice, count, transaction;
        [error, gasPrice] = await future(web3.eth.getGasPrice());
        if (error != null) {
            console.error('Failed to send token,', error.message);
            throw error;
        }
        [error, count] = await future(web3.eth.getTransactionCount(from));
        if (error != null) {
            console.error('Failed to send token,', error.message);
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
        [error, transaction] = await future(web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')));
        if (error != null) {
            console.error('Failed to send token,', error.message);
            throw error;
        }
        return transaction.transactionHash;
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
            throw error;
        }
        if (amount > balance) {
            throw new Error('Insufficient coins');
        }

        // 构造消息
        let gasPrice, count, transaction;
        [error, gasPrice] = await future(web3.eth.getGasPrice());
        if (error != null) {
            console.error('Failed to send erc20 token,', error.message);
            throw error;
        }
        [error, count] = await future(web3.eth.getTransactionCount(from));
        if (error != null) {
            console.error('Failed to send erc20 token,', error.message);
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

        function asdasd() {
            function saasdasd() {

            }

            var promise = new Promise(function(resolve, reject){
            })
            return promise
        }


        // 发送签名消息
        let transactionHash = null;
        let input = '0x' + serializedTx.toString('hex');
        web3.eth.sendSignedTransaction(input).once('transactionHash', function(hash) {
            transactionHash = hash;
            console.info('sendSignedTransaction', transactionHash, promise.done());
        });

        await promise;

waitgroup
//https://www.npmjs.com/package/waitgroup

        // if (error != null) {
        //     console.error('Failed to send erc20 token,', error.message);
        //     throw error;
        // }
        console.info(transactionHash);
        return transactionHash;
    }
};

module.exports = Transfer;



// Copyright (c) 2012 Sam Nguyen <samxnguyen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(){
    var WaitGroup = function(){
        this.total = 0; // Number of total items
        this.ready = 0; // Number of items ready
    };
    
    WaitGroup.prototype.add = function WaitGroupAdd(){
        this.total++;
    };
    
    WaitGroup.prototype.done = function WaitGroupDone(){
        this.ready++;
    };
    
    WaitGroup.prototype.wait = function(fn) {
      var self = this;
      setTimeout(function(){
        if(self.ready == self.total) return fn();
        self.wait(fn);
      }, 0);
    };
    
    // Export to node.js
    if(typeof(module) !== "undefined") {
        module.exports = WaitGroup;
    }
    // Export to browser
    else {
        window.WaitGroup = WaitGroup;
    }
    
    })();
    async function test() {
        console.log('Hello')
        await sleep(1000)
        console.log('world!')
      }
      
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      }
      
      test()
      
      作者：贺师俊
      链接：https://www.zhihu.com/question/31636244/answer/52835780
      来源：知乎
      著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。