Tokens = {
    eth: {
        symbol: "ETH",
        confirmations: 5,
        keystore: "keystore/main.keystore",
        unlock_password: "123456",
        web3_url: "http://128.1.131.4:8545/",
        walletnotify: "http:/127.0.0.1:3000/eth/"
    },
    eos: {
        symbol: "EOS",
        family: "ETH",
        keystore: "keystore/main.keystore",
        unlock_password: "123456",
        contract_address: "0x213213123213213",
        walletnotify: "http:/127.0.0.1:3000/eos/"
    }
}

module.exports = Tokens
