# FundMe Web3 项目

这是一个基于 Solidity 和 Hardhat 的众筹平台智能合约项目，用于学习 Web3 开发。

## 项目概述

`FundMe` 是一个去中心化的众筹智能合约，实现了以下功能：

- **投资功能**：用户可以参与众筹活动，最小投资额为 100 USD（按 ETH 价格折算）
- **目标机制**：众筹目标为 1000 USD 的 ETH
- **锁定期**：合约在规定期间内接收投资，之后开启结算期
- **提取资金**：若达到众筹目标，项目方可以提取资金
- **退款机制**：若未达到众筹目标，投资者可以退回投资款项

## 项目结构

```
web3_tutorial/
├── contracts/                    # Solidity 智能合约
│   ├── FundMe.sol              # 主要众筹合约
│   ├── Lock.sol                # 示例合约
│   └── mocks/
│       └── MockV3Aggregator.sol # Chainlink 预言机模拟合约
├── deploy/                      # 合约部署脚本
│   ├── 00-deploy-mock.js       # 部署 Mock 预言机合约
│   └── 01-deploy-fund-me.js    # 部署 FundMe 合约
├── test/                        # 测试文件
│   ├── unit/                   # 单元测试
│   │   └── fundme.test.js
│   └── staging/                # 集成测试
│       └── fundMe.staging.test.js
├── scripts/                     # 实用脚本
├── tasks/                       # Hardhat 任务
├── deployments/                 # 部署记录
├── artifacts/                   # 编译输出
├── hardhat.config.js           # Hardhat 配置文件
├── helper-hardhat-config.js    # 网络配置
└── package.json                # 项目依赖
```

## 关键特性

### FundMe 合约主要功能

| 功能 | 描述 |
|------|------|
| `fund()` | 投资者投资，需满足最小投资额并在锁定期内 |
| `getFund()` | 项目方在锁定期结束后提取资金（需达到目标值） |
| `refund()` | 投资者在锁定期结束后退款（目标未达成时） |
| `transferOwnership()` | 转移项目所有权 |
| `getChainlinkDataFeedLatestAnswer()` | 获取 Chainlink 预言机价格数据 |

### 核心参数

- **最小投资额**：100 * 10^18 wei（相当于 100 USD 等值的 ETH）
- **众筹目标**：1000 * 10^18 wei（相当于 1000 USD 等值的 ETH）
- **锁定时间**：可在部署时配置
- **ETH 价格来源**：Chainlink 预言机（Sepolia 测试网）

## 技术栈

- **开发框架**：Hardhat
- **智能合约语言**：Solidity 0.8.24
- **钱包**：ethers.js v6
- **测试框架**：Chai
- **预言机**：Chainlink
- **网络**：Sepolia 测试网

## 依赖项

```json
{
  "@chainlink/contracts": "^1.5.0",
  "@nomicfoundation/hardhat-ethers": "^3.1.1",
  "@nomicfoundation/hardhat-toolbox": "^5.0.0",
  "ethers": "^6.14.0",
  "hardhat": "^2.28.6",
  "hardhat-deploy": "^0.12.4",
  "hardhat-deploy-ethers": "^0.4.2",
  "hardhat-gas-reporter": "^2.3.0",
  "dotenv": "^17.4.2"
}
```

## 安装与配置

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量配置

在项目根目录创建 `.env.enc` 或 `.env` 文件，配置以下环境变量：

```
SEPOLIA_RPC_URL=<你的 Sepolia RPC 网址>
PRIVATE_KEY=<你的私钥>
PRIVATE_KEY_1=<第二个私钥（可选）>
ETHERSCAN_API_KEY=<Etherscan API Key（用于合约验证）>
```

### 3. 编译合约

```bash
npx hardhat compile
```

## 使用说明

### 本地测试（Hardhat 网络）

```bash
# 运行单元测试
npx hardhat test test/unit/fundme.test.js

# 运行所有测试
npx hardhat test
```

### 部署到 Sepolia 测试网

```bash
# 部署到 Sepolia
npx hardhat deploy --network sepolia

# 部署到 Hardhat 本地网络
npx hardhat deploy
```

### 验证合约（Sepolia）

合约部署到 Sepolia 时会自动验证（如配置了 Etherscan API Key）。

## 合约工作流程

### 投资流程

```
1. 投资者调用 fund() 并发送 ETH
   ├─ 检验：ETH 价值 ≥ 100 USD
   ├─ 检验：在锁定期内
   └─ 记录：投资额到 fundersToAmount 映射

2. 锁定期结束后
   ├─ 若达到目标：项目方调用 getFund() 提取全部资金
   └─ 若未达目标：投资者调用 refund() 退款
```

## 核心合约逻辑

### 价格转换

使用 Chainlink 预言机获取 ETH/USD 汇率，将 ETH 金额转换为 USD 价值：

```solidity
function convertEthToUsd(uint256 ethAmount) internal view returns (uint256)
```

### 修饰符

- `onlyOwner`：仅项目方可调用
- `windowClosed`：仅在锁定期结束后可调用

## 测试覆盖

项目包含单元测试，覆盖以下场景：

- ✅ 所有者验证
- ✅ 数据源验证
- ✅ 时间窗口检查
- ✅ 最小投资额检查
- ✅ 投资功能
- ✅ 资金提取
- ✅ 退款功能

## 网络配置

### 支持的网络

- **hardhat**：本地开发网络（ChainId: 31337）
- **sepolia**：Sepolia 测试网（ChainId: 11155111）

### Sepolia 网络配置

```javascript
{
  url: "SEPOLIA_RPC_URL",
  accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
  chainId: 11155111
}
```

## 部署信息

部署记录保存在 [deployments/sepolia/](deployments/sepolia/) 目录中：

- `FundMe.json` - FundMe 合约信息
- `MockV3Aggregator.json` - Mock 预言机信息

## 安全性注意事项

1. **私钥管理**：永远不要在代码中提交私钥，使用环境变量
2. **测试网使用**：在主网前充分测试合约功能
3. **资金安全**：投资者投资前应理解合约逻辑和风险
4. **审计**：生产环境部署前建议进行专业审计

## 故障排除

### 常见问题

**Q: 部署时提示 "Send more ETH"**
- A: 确保发送的 ETH 价值至少 100 USD

**Q: 无法调用 getFund()**
- A: 检查是否满足以下条件：
  - 锁定期已结束
  - 你是合约所有者
  - 众筹资金达到目标

**Q: 部署到 Sepolia 失败**
- A: 检查 Sepolia RPC URL 和私钥配置

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request！

## 参考资源

- [Hardhat 官方文档](https://hardhat.org/)
- [Solidity 官方文档](https://docs.soliditylang.org/)
- [Chainlink 预言机文档](https://docs.chain.link/)
- [ethers.js 文档](https://docs.ethers.org/)

---

**最后更新**：2026 年 5 月

**项目版本**：1.0.0
