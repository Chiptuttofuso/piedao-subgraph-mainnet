import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { PieVault } from "../generated/Ypie/PieVault"

export class PieVaultsHelper {
  constructor() {}

  static transfer(contract: Address, from: Address, to: Address, amount: BigInt): void {
    let ypie = PieVault.bind(contract);

    if(from.toHex() != "0x0") {
      this.incrementAmount(from, amount, ypie.symbol(), ypie.name());
    }

    if(to.toHex() != "0x0") {
      this.decrementAmount(to, amount, ypie.symbol(), ypie.name());
    }
   }
 
   static incrementAmount(address: Address, amount: BigInt, symbol: string, name: string): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), symbol);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(address.toHex(), symbol, name, holder, amount);
     token.balance = token.balance.plus(amount);
     token.save();
   }
 
   static decrementAmount(address: Address, amount: BigInt, symbol: string, name: string): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), symbol);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(address.toHex(), symbol, name, holder, amount);
     token.balance = token.balance.minus(amount);
     token.save();
   }    
}