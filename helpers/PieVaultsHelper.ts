import { Address, BigInt, BigDecimal, log } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { PieVault } from "../generated/Ypie/PieVault"
import { Factory } from "../generated/Ypie/Factory"
import { Pair, Pair__getReservesResult } from "../generated/Ypie/Pair"
import { ERC20 } from "../helpers/ERC20"

class PriceSet {
  constructor(public tokenPrice: BigDecimal, public ethPrice: BigDecimal) {
    this.tokenPrice = tokenPrice
    this.ethPrice = ethPrice
  }
}

export class PieVaultsHelper {
  constructor() {}

  static transfer(contract: Address, from: Address, to: Address, amount: BigInt): void {
    let ypie = PieVault.bind(contract);

    if(from.toHex() != "0x0") {
      this.incrementAmount(from, amount, ypie);
    } else {
      this.mint(from, amount, ypie);
    }

    if(to.toHex() != "0x0") {
      this.decrementAmount(to, amount, ypie);
    } else {
      this.burn(from, amount, ypie);
    }
   }

   static mint(address: Address, amount: BigInt, pieVault: PieVault): void {

   }

   static burn(address: Address, amount: BigInt, pieVault: PieVault): void {
     
  }   
 
   static incrementAmount(address: Address, amount: BigInt, pieVault: PieVault): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>pieVault);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(<ERC20>pieVault);

     // loading the Token Entity, or creating one if doesn't exist yet...
     let wallet = EntityHelper.loadWallet(holder, token);     
     
     wallet.balance = wallet.balance.plus(amount.toBigDecimal());
     wallet.save();
   }
 
   static decrementAmount(address: Address, amount: BigInt, pieVault: PieVault): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>pieVault);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(<ERC20>pieVault);

     // loading the Token Entity, or creating one if doesn't exist yet...
     let wallet = EntityHelper.loadWallet(holder, token);   

     wallet.balance = wallet.balance.minus(amount.toBigDecimal());
     wallet.save();
   }

   static findTokenPrice(tokenAddress: Address): PriceSet {
    let FACTORY_ADDRESS = Address.fromString('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
    let WETH_ADDRESS = Address.fromString('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');

    let factoryContract = Factory.bind(FACTORY_ADDRESS);
    let pairAddress = factoryContract.getPair(Address.fromString(tokenAddress.toHexString()), WETH_ADDRESS);
    let pairContract = Pair.bind(pairAddress);
  
    let tryReserves = pairContract.try_getReserves();
    let reserves: Pair__getReservesResult;

    if(tryReserves.reverted) {
      log.warning(
        '****00091 pairAddress.getReserves failed pairAddress {}, tokenAddress {}',
        [
          pairAddress.toHexString(),
          tokenAddress.toHexString()
        ]);

      return new PriceSet(BigInt.fromI32(0).toBigDecimal(), BigInt.fromI32(0).toBigDecimal());
    } else {
      reserves = tryReserves.value;
      let token0 = pairContract.token0();
      let tokenPrice:BigDecimal;
      let ethPrice:BigDecimal;
      if(token0 == tokenAddress) {
        tokenPrice = reserves.value1.toBigDecimal().div(reserves.value0.toBigDecimal());
        ethPrice = reserves.value0.toBigDecimal().div(reserves.value1.toBigDecimal());
      } else {
        tokenPrice = reserves.value0.toBigDecimal().div(reserves.value1.toBigDecimal());
        ethPrice = reserves.value1.toBigDecimal().div(reserves.value0.toBigDecimal());
      }

      return new PriceSet(tokenPrice, ethPrice);
    }
  }   
}