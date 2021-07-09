import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { Dough } from "../generated/Dough/Dough"
import { ERC20 } from "../helpers/ERC20"

export class DoughHelper {
  constructor() {}

  static transfer(contract: Address, from: Address, to: Address, amount: BigInt): void {
    let dough = Dough.bind(contract);

    this.incrementAmount(from, amount, dough);
    this.decrementAmount(to, amount, dough);
  }

  static incrementAmount(address: Address, amount: BigInt, dough: Dough): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>dough);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>dough);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let wallet = EntityHelper.loadWallet(holder, token);   

    wallet.balance = wallet.balance.plus(amount);
    wallet.save();
  }

  static decrementAmount(address: Address, amount: BigInt, dough: Dough): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>dough);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>dough);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let wallet = EntityHelper.loadWallet(holder, token); 

    wallet.balance = wallet.balance.minus(amount);
    wallet.save();
  }  
}