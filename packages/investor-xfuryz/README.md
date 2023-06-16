# @shapeshiftoss/investor-xfuryz

ShapeShift's Yearn investor package.

## Installation

```bash
yarn add @shapeshiftoss/investor-xfuryz
```

## Initialization

```javascript
import { XfuryzApi } from '@shapeshiftoss/investor-xfuryz'
import { toChainId, CHAIN_NAMESPACE, CHAIN_REFERENCE } from '@shapeshiftoss/caip'

const api = new XfuryzApi({
  adapter: await adapterManager.byChainId(
    toChainId({ chainNamespace: CHAIN_NAMESPACE.Evm, chainReference: CHAIN_REFERENCE.EthereumMainnet })
  ), // adapter is an ETH @shapeshiftoss/chain-adapters
  providerUrl: '<your eth node privider url>'
})
```

### Functions

- getXfuryzOpportunities
- getXfuryzOpportunityByStakingAddress
- getGasPrice
- getTxReceipt
- checksumAddress
- estimateClaimWithdrawGas
- estimateSendWithdrawalRequestsGas
- estimateAddLiquidityGas
- estimateRemoveLiquidityGas
- estimateWithdrawGas
- estimateInstantWithdrawGas
- estimateDepositGas
- estimateApproveGas
- approve
- allowance
- deposit
- withdraw
- instantWithdraw
- claimWithdraw
- sendWithdrawalRequests
- addLiquidity
- removeLiquidity
- getTimeUntilClaimable
- balance
- totalSupply
- pricePerShare
- apy
- tvl

### Examples

For more in-depth examples, check out ./src/xfuryzcli.ts

```javascript
const api = new XfuryzApi({
  adapter: await adapterManager.byChainId(
    toChainId({ chainNamespace: CHAIN_NAMESPACE.Evm, chainReference: CHAIN_REFERENCE.EthereumMainnet })
  ),
  providerUrl: 'https://dev-api.ethereum.shapeshift.com'
})

await api.approve({
  tokenContractAddress, // XFURY address
  contractAddress, // Staking contract address
  userAddress, // User's wallet address
  wallet // HDWallet
})

await api.deposit({
  contractAddress, // Staking contract address
  amountDesired, // Amount to stake
  userAddress, // User's wallet address
  wallet // HDWallet
})

await api.withdraw({
  contractAddress, // Staking contract address
  amountDesired, // Amount to unstake
  userAddress, // User's wallet address
  wallet // HDWallet
})
```
