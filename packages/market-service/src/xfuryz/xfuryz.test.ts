import { HistoryTimeframe } from '@shapeshiftoss/types'
import axios from 'axios'

import { bn } from '../utils/bignumber'
import { XFURYZ_ASSET_ID, XfuryzMarketService } from './xfuryz'
import { mockXfuryzMarketData, xfury } from './xfuryzMockData'

const xfuryzMarketService = new XfuryzMarketService({
  coinGeckoAPIKey: 'secret',
  providerUrls: {
    jsonRpcProviderUrl: 'dummy',
    unchainedEthereumHttpUrl: '',
    unchainedEthereumWsUrl: '',
    osmosisMarketDataUrl: '',
    osmosisPoolMetadataUrl: '',
  },
})

jest.mock('axios')

const mockTotalSupply = jest.fn().mockReturnValue(bn('502526240759422886301171305'))
const mockTvl = jest.fn().mockReturnValue(bn('52018758965754575223841191'))
jest.mock('@shapeshiftoss/investor-xfuryz', () => ({
  XfuryzApi: jest.fn().mockImplementation(() => ({
    totalSupply: mockTotalSupply,
    tvl: mockTvl,
  })),
  xfuryzAddresses: [{ xfuryz: '0xAddress' }],
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('xfuryz market service', () => {
  describe('getMarketCap', () => {
    it('can return xfury market data', async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: [{ market_data: xfury }] } })
      const result = await xfuryzMarketService.findAll()
      expect(Object.keys(result).length).toEqual(1)
    })

    it('can handle api errors', async () => {
      mockedAxios.get.mockRejectedValue({ error: 'foo' })
      const result = await xfuryzMarketService.findAll()
      expect(Object.keys(result).length).toEqual(0)
    })

    it('can handle rate limiting', async () => {
      mockedAxios.get.mockRejectedValue({ status: 429 })
      const result = await xfuryzMarketService.findAll()
      expect(Object.keys(result).length).toEqual(0)
    })
  })

  describe('findByAssetId', () => {
    const args = {
      assetId: XFURYZ_ASSET_ID,
    }

    it('should return market data for XFURYy', async () => {
      mockedAxios.get.mockResolvedValue({ data: { market_data: xfury } })
      expect(await xfuryzMarketService.findByAssetId(args)).toEqual(mockXfuryzMarketData)
    })

    it('should return null on network error', async () => {
      mockedAxios.get.mockRejectedValue(Error)
      jest.spyOn(console, 'warn').mockImplementation(() => void 0)
      await expect(xfuryzMarketService.findByAssetId(args)).rejects.toEqual(
        new Error('XfuryzMarketService(findByAssetId): error fetching market data'),
      )
    })
  })

  describe('findPriceHistoryByAssetId', () => {
    const args = {
      assetId: XFURYZ_ASSET_ID,
      timeframe: HistoryTimeframe.HOUR,
    }

    it('should return market data for XFURYy', async () => {
      const mockHistoryData = {
        prices: [
          [1631664000000, 0.480621954029937],
          [1631577600000, 0.48541321175453755],
          [1631491200000, 0.4860349080635926],
          [1631404800000, 0.46897407484696146],
        ],
      }

      const expected = [
        { date: new Date('2021-09-15T00:00:00.000Z').valueOf(), price: 0.480621954029937 },
        { date: new Date('2021-09-14T00:00:00.000Z').valueOf(), price: 0.48541321175453755 },
        { date: new Date('2021-09-13T00:00:00.000Z').valueOf(), price: 0.4860349080635926 },
        { date: new Date('2021-09-12T00:00:00.000Z').valueOf(), price: 0.46897407484696146 },
      ]
      mockedAxios.get.mockResolvedValue({ data: mockHistoryData })
      expect(await xfuryzMarketService.findPriceHistoryByAssetId(args)).toEqual(expected)
    })

    it('should return null on network error', async () => {
      mockedAxios.get.mockRejectedValue(Error)
      jest.spyOn(console, 'warn').mockImplementation(() => void 0)
      await expect(xfuryzMarketService.findPriceHistoryByAssetId(args)).rejects.toEqual(
        new Error('XfuryzMarketService(findPriceHistoryByAssetId): error fetching price history'),
      )
    })
  })
})
