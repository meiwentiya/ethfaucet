Tokens = {
    eth: {
        symbol: 'ETH',
        confirmations: 5,
        keystore: 'keystore/main.keystore',
        unlockpassword: '123456',
        web3url: 'http://128.1.131.4:8545/',
        walletnotify: 'http:/127.0.0.1:3000/eth/'
    },
    eos: {
        symbol: 'BOKKY',
        family: 'ETH',
        keystore: 'keystore/main.keystore',
        unlockpassword: '123456',
        contractaddress: '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367',
        walletnotify: 'http:/127.0.0.1:3000/eos/'
    }
}

module.exports = Tokens
