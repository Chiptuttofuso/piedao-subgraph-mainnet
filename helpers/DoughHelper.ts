import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { Dough } from "../generated/Dough/Dough"

export class DoughHelper {
  constructor() {}

  static transfer(contract: Address, from: Address, to: Address, amount: BigInt): void {
    let dough = Dough.bind(contract);
    this.incrementAmount(from, amount, dough.name(), dough.symbol());
    this.decrementAmount(to, amount, dough.name(), dough.symbol());
  }

  static incrementAmount(address: Address, amount: BigInt, name: string, symbol: string): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex(), symbol);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(address.toHex(), symbol, name, holder, amount);
    token.balance = token.balance.plus(amount);
    token.save();
  }

  static decrementAmount(address: Address, amount: BigInt, name: string, symbol: string): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex(), symbol);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(address.toHex(), symbol, name, holder, amount);
    token.balance = token.balance.minus(amount);
    token.save();
  }  
}