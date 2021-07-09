import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { PieVault } from "../generated/Ypie/PieVault"
import { ERC20 } from "../helpers/ERC20"

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
 
   static incrementAmount(address: Address, amount: BigInt, pieVault: PieVault): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>pieVault);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(<ERC20>pieVault);

     // loading the Token Entity, or creating one if doesn't exist yet...
     let wallet = EntityHelper.loadWallet(address.toHex(), holder, token);     
     
     wallet.balance = wallet.balance.plus(amount);
     wallet.save();
   }
 
   static decrementAmount(address: Address, amount: BigInt, pieVault: PieVault): void {
     // loading the Holder Entity, or creating one if doesn't exist yet...
     let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>pieVault);
 
     // loading the Token Entity, or creating one if doesn't exist yet...
     let token = EntityHelper.loadToken(<ERC20>pieVault);

     // loading the Token Entity, or creating one if doesn't exist yet...
     let wallet = EntityHelper.loadWallet(address.toHex(), holder, token);   

     wallet.balance = wallet.balance.minus(amount);
     wallet.save();
   }    
}