import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { PieVault } from "../generated/Ypie/PieVault"

export class PieVaultsHelper {
  constructor() {}

  static transfer(contract: Address, from: Address, to: Address, amount: BigInt): void {
    let ypie = PieVault.bind(contract);

    if(from.toHex() != "0x0") {
      this.incrementAmount(from, amount, ypie);
    }

    if(to.toHex() != "0x0") {
      this.decrementAmount(to, amount, ypie);
    }
   }
 
   static incrementAmount(address: Address, amount: BigInt, ypie: PieVault): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), ypie.symbol());
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(address.toHex(), ypie, holder, amount);
     token.balance = token.balance.plus(amount);
     token.save();
   }
 
   static decrementAmount(address: Address, amount: BigInt, ypie: PieVault): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), ypie.symbol());
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(address.toHex(), ypie, holder, amount);
     token.balance = token.balance.minus(amount);
     token.save();
   }    
}