import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"

export class DoughHelper {
  constructor() {}

  static transfer(from: Address, to: Address, amount: BigInt): void {
   this.incrementAmount(from, amount);
   this.decrementAmount(to, amount);
  }

  static incrementAmount(address: Address, amount: BigInt): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex());

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(address.toHex(), "DOUGH", holder, amount);
    token.balance = token.balance.plus(amount);
    token.save();     
  }

  static decrementAmount(address: Address, amount: BigInt): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex());

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(address.toHex(), "DOUGH", holder, amount);
    token.balance = token.balance.minus(amount);
    token.save();    
  }  
}