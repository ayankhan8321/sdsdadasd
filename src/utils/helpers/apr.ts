import BigNumber from 'bignumber.js'
import lpAprs from '../constants/lpAprs.json'


// const BLOCKS_PER_YEAR = 10000
const CAKE_PER_YEAR = "100000000"

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
// export const getPoolApr = (
//   stakingTokenPrice: number,
//   rewardTokenPrice: number,
//   totalStaked: number,
//   tokenPerBlock: number,
// ): number => {
//   const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
//   const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
//   const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
//   return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
// }

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
): { cakeRewardsApr: number; lpRewardsApr: number } => {
  const yearlyCakeRewardAllocation = poolWeight ? poolWeight.times(new BigNumber(CAKE_PER_YEAR)) : new BigNumber(NaN)
  const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
  let cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  console.log(cakePriceUsd, yearlyCakeRewardAllocation, poolLiquidityUsd, "get farm apr apr.ts")
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }
  // @ts-ignore
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}