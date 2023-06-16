jest.mock('../thorService')
import { ChainAdapterManager } from '@shapeshiftoss/chain-adapters'
import Web3 from 'web3'

import { BTC, ETH, UNSUPPORTED, XFURY } from '../../../utils/test-data/assets'
import { ThorchainSwapperDeps } from '../../types'
import { btcThornodePool, ethThornodePool, xfuryThornodePool } from '../test-data/responses'
import { thorService } from '../thorService'
import { getTradeRate } from './getTradeRate'

describe('getTradeRate', () => {
  const deps: ThorchainSwapperDeps = {
    midgardUrl: '',
    daemonUrl: '',
    adapterManager: <ChainAdapterManager>{},
    web3: <Web3>{},
  }

  it('should calculate a correct rate for trading xfury to eth', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [xfuryThornodePool, ethThornodePool] }),
    )

    // 1 eth
    const rate = await getTradeRate(ETH, XFURY.assetId, '1000000000000000000', deps)
    const expectedRate = '12554.215976'
    expect(rate).toEqual(expectedRate)
  })

  it('should calculate a correct rate for trading eth to xfury', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [xfuryThornodePool, ethThornodePool] }),
    )

    // 1 xfury
    const rate = await getTradeRate(XFURY, ETH.assetId, '1000000000000000000', deps)
    const expectedRate = '0.000078'
    expect(rate).toEqual(expectedRate)
  })

  it('should calculate a correct rate for trading xfury to btc', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [xfuryThornodePool, btcThornodePool] }),
    )

    // 1 xfury
    const rate = await getTradeRate(XFURY, BTC.assetId, '1000000000000000000', deps)
    const expectedRate = '0.000005'
    expect(rate).toEqual(expectedRate)
  })

  it('should calculate a correct rate for trading btc to xfury', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [xfuryThornodePool, btcThornodePool] }),
    )

    // 0.01 btc
    const rate = await getTradeRate(BTC, XFURY.assetId, '1000000', deps)
    const expectedRate = '193385.0366'
    expect(rate).toEqual(expectedRate)
  })

  it('should throw if trying to calculate a rate for an unsupported asset', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [xfuryThornodePool, ethThornodePool] }),
    )

    await expect(
      getTradeRate(UNSUPPORTED, ETH.assetId, '1000000000000000000', deps),
    ).rejects.toThrow(`[getTradeRate]: No sellPoolId for asset ${UNSUPPORTED.assetId}`)
  })
})
