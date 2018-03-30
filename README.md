# 快速开始
```
git clone https://github.com/zhangpanyi/ethfaucet.git
cd ethfaucet && npm install
node index.js
```

# JSON RPC

## 1. 发送ETH代币

**请求参数说明** 

方法名称: `eth_sendToken`

|参数名|类型|说明|
|:-----  |:-----|----- |
|to |string   |对方地址  |
|amount |string   |转账金额  |

**返回参数说明** 

|参数名|类型|说明|
|:-----  |:-----|----- |
|hash |string   |txid  |

**示例代码**

```
// 请求示例
{
	"jsonrpc": "2.0",
	"id": 1,
	"method": "eth_sendToken",
	"params": ["0xc299ac73687fa17e10a206c47dc0e81b8c7828e6", "0.1"]
}

// 返回结果
{"id":1,"result":{"hash":"0xa353c3886ee17b2beccca21037c14c227a77f6b51bed00fa7cfe1c664a08fa4e"}}
```

### 2. 发送ERC20代币

**请求参数说明** 

方法名称: `eth_sendERC20`

|参数名|类型|说明|
|:-----  |:-----|----- |
|symbol |string   |代币符号  |
|to |string   |对方地址  |
|amount |string   |转账金额  |

**返回参数说明** 

|参数名|类型|说明|
|:-----  |:-----|----- |
|hash |string   |txid  |

**示例代码**

```
// 请求示例
{
	"jsonrpc": "2.0",
	"id": 1,
	"method": "eth_sendERC20",
	"params": ["BOKKY", "0xc299ac73687fa17e10a206c47dc0e81b8c7828e6", "0.1"]
}

// 返回结果
{"id":1,"result":{"hash":"0xa353c3886ee17b2beccca21037c14c227a77f6b51bed00fa7cfe1c664a08fa4e"}}
```

