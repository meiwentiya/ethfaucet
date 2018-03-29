const to = require('./errors');

class Accounts {
    constructor(web3){
        this._web3 = web3;
        this._accounts = null;
    }

    // 是否存在
    has(address) {
        if (this._accounts == null) {
            return false;
        }
        return this._accounts.has(address);
    }

    // 添加账户
    add(address) {
        if (this._accounts == null) {
            this._accounts = new Set(accounts);
        }
        this._accounts.add(address);
    }

    // 加载账户列表
    async loadAccounts() {
        let error, accounts;
        [error, accounts] = await to(this._web3.eth.getAccounts());
        if (error != null) {
            return error
        }
        this._accounts = new Set(accounts);
        return null;
    }
}

module.exports = Accounts;
