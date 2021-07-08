import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"

export class PieVaultsHelper {
  constructor() {}

  static transfer(from: Address, to: Address, amount: BigInt, symbol: string): void {
    if(from.toHex() != "0x0") {
      this.incrementAmount(from, amount, symbol);
    }

    if(to.toHex() != "0x0") {
      this.decrementAmount(to, amount, symbol);
    }
   }
 
   static incrementAmount(address: Address, amount: BigInt, symbol: string): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), symbol);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(address.toHex(), symbol, holder, amount);
     token.balance = token.balance.plus(amount);
     token.save();
   }
 
   static decrementAmount(address: Address, amount: BigInt, symbol: string): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), symbol);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(address.toHex(), symbol, holder, amount);
     token.balance = token.balance.minus(amount);
     token.save();
   }    
}