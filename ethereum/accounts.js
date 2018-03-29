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
    loadAccounts() {
        let self = this;
        this._web3.eth.getAccounts(function(error, accounts) {
            if (error != null) {
                throw error;
            }
            console.error('accounts count:', accounts.length);
            self._accounts = new Set(accounts);
        });
    }
}

module.exports = Accounts;
