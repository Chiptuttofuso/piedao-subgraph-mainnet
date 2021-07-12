import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { PriceHelper } from "../helpers/PriceHelper"
import { PieVault, PoolExited, PoolJoined } from "../generated/Ypie/PieVault"
import { PieLog } from "../generated/schema"
import { ERC20 } from "../helpers/ERC20"

export class PieVaultsHelper {
  constructor() { }

  static transfer(contract: Address, from: Address, to: Address, amount: BigInt): void {
    let pieVault = PieVault.bind(contract);

    if (from.toHex() != "0x0000000000000000000000000000000000000000") {
      this.decrementAmount(from, amount, pieVault);
    }

    if (to.toHex() != "0x0000000000000000000000000000000000000000") {
      this.incrementAmount(to, amount, pieVault);
    }
  }

  static calculateTokensPrices(pieVault: PieVault, transaction: ethereum.Transaction, pieLog: PieLog): void {
    // retrieving all the underlying tokens...
    let tokens = pieVault.getTokens();

    // for each tokens, we generate the relative entities...
    for(let i = 0; i < tokens.length; i++) {
      let token = tokens[i];

      let tokenContract = PieVault.bind(token);
      let tokenBalance = tokenContract.balanceOf(token);
      let price = PriceHelper.findTokenPrice(token);

      let tokenEntity = EntityHelper.loadToken(<ERC20>tokenContract);
      let tokenInPieTransaction = EntityHelper.loadTokenInPieTransaction(transaction.hash.toHex(), tokenEntity, pieLog);

      tokenInPieTransaction.price = price.tokenPrice;
      tokenInPieTransaction.balance = tokenBalance.toBigDecimal();
      tokenInPieTransaction.save();
    };   
  }

  static mint(event: PoolJoined): void {
    // loading the pieVault, to be used for the Token and the PieLog...
    let pieVault = PieVault.bind(event.address);

    // loading the pieVault Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>pieVault);

    // loading the PieLog Entity, or creating one if doesn't exist yet...
    let pieLog = EntityHelper.loadPieLog(event.transaction.hash.toHex(), token, "mint", event.params.amount, event.block);

    // TODO: updating the amount and the amountUSD for the pieLog Entity...
    //  pieLog.amount = BigInt.fromI32(0).toBigDecimal();
    //  pieLog.amountUSD = BigInt.fromI32(0).toBigDecimal();
    //  pieLog.save();

    // generating the TokensInPieTransaction entities...
    PieVaultsHelper.calculateTokensPrices(pieVault, event.transaction, pieLog);
  }

  static burn(event: PoolExited): void {
    // loading the pieVault, to be used for the Token and the PieLog...
    let pieVault = PieVault.bind(event.address);

    // loading the pieVault Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>pieVault);

    // loading the PieLog Entity, or creating one if doesn't exist yet...
    let pieLog = EntityHelper.loadPieLog(event.transaction.hash.toHex(), token, "burn", event.params.amount, event.block);

    // TODO: updating the amount and the amountUSD for the pieLog Entity...
    //  pieLog.amount = BigInt.fromI32(0).toBigDecimal();
    //  pieLog.amountUSD = BigInt.fromI32(0).toBigDecimal();
    //  pieLog.save();

    // generating the TokensInPieTransaction entities...
    PieVaultsHelper.calculateTokensPrices(pieVault, event.transaction, pieLog);
  }

  static incrementAmount(address: Address, amount: BigInt, pieVault: PieVault): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>pieVault);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>pieVault);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let position = EntityHelper.loadPosition(holder, token);

    position.balance = position.balance.plus(amount.toBigDecimal());
    position.save();
  }

  static decrementAmount(address: Address, amount: BigInt, pieVault: PieVault): void {
    // loading the Holder Entity, or creating one if doesn't exist yet...
    let holder = EntityHelper.loadHolder(address.toHex(), <ERC20>pieVault);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>pieVault);

    // loading the Token Entity, or creating one if doesn't exist yet...
    let position = EntityHelper.loadPosition(holder, token);

    position.balance = position.balance.minus(amount.toBigDecimal());
    position.save();
  }
}