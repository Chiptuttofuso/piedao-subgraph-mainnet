import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import { EntityHelper } from "../helpers/EntityHelper"
import { PriceHelper } from "../helpers/PriceHelper"
import { PieVault, PoolExited, PoolJoined } from "../generated/Ypie/PieVault"
import { PieLog } from "../generated/schema"
import { ERC20 } from "../helpers/ERC20"
import { LendingRegistry } from "../generated/Ypie/LendingRegistry"

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
    let LendingRegistryAddress = Address.fromString("0xB739Dcf499306B191D9D4fa5255A8f20066a6a96");

    // retrieving all the underlying tokens...
    let tokens = pieVault.getTokens();

    // for each tokens, we generate the relative entities...
    for(let i = 0; i < tokens.length; i++) {
      let token = tokens[i];

      // binding the LendingRegistry Contract, to check if the token
      // is wrapped or not...
      let lendingRegistry = LendingRegistry.bind(LendingRegistryAddress);
      let wrapped = lendingRegistry.wrappedToUnderlying(token);

      // if the token is wrapped, we replace the token address with the wrapped one,
      // otherwise we just leave it as it is...
      if(wrapped.toHex() != "0x0000000000000000000000000000000000000000") {
        token = wrapped;
      }

      // first, we bind the current token address to a smart contract...
      let tokenContract = PieVault.bind(token);
      // then, we use the contract to retrieve the balanceOf...
      let tokenBalance = tokenContract.balanceOf(token);
      // finally, we use the PriceHelper to get the price of the token...
      let price = PriceHelper.findTokenPrice(token);

      // we can now load the token entity, or create it if it doesn't exist yet...
      let tokenEntity = EntityHelper.loadToken(<ERC20>tokenContract);
      // loading the tokenInPieTransaction entity, and connect it to the relative token and pieLog...
      let tokenInPieTransaction = EntityHelper.loadTokenInPieTransaction(transaction.hash.toHex(), tokenEntity, pieLog);

      // adding the price to the tokenInPieTransaction entity...
      tokenInPieTransaction.price = price.tokenPrice;
      // adding the balance to the tokenInPieTransaction entity...
      tokenInPieTransaction.balance = tokenBalance.toBigDecimal();

      // finally, saving the tokenInPieTransaction entity...
      tokenInPieTransaction.save();
    };   
  }

  static mint(event: PoolJoined): void {
    // loading the pieVault, to be used for the Token and the PieLog...
    let pieVault = PieVault.bind(event.address);

    // loading the pieVault Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>pieVault);

    // loading the PieLog Entity, or creating one if doesn't exist yet...
    let pieLog = EntityHelper.loadPieLog(event.transaction.hash.toHex(), token, "mint", event.block);

    // updating the amount and the amountUSD for the pieLog Entity...
    let precision = BigInt.fromI32(10).pow(<u8>token.decimals.toI32()).toBigDecimal();
    let price = PriceHelper.findTokenPrice(event.address);
        
    pieLog.amount = pieLog.amount.plus(event.params.amount.toBigDecimal());
    pieLog.amountUSD = price.tokenPrice.times(pieLog.amount).div(precision);

    pieLog.save();

    // generating the TokensInPieTransaction entities...
    PieVaultsHelper.calculateTokensPrices(pieVault, event.transaction, pieLog);
  }

  static burn(event: PoolExited): void {
    // loading the pieVault, to be used for the Token and the PieLog...
    let pieVault = PieVault.bind(event.address);

    // loading the pieVault Entity, or creating one if doesn't exist yet...
    let token = EntityHelper.loadToken(<ERC20>pieVault);

    // loading the PieLog Entity, or creating one if doesn't exist yet...
    let pieLog = EntityHelper.loadPieLog(event.transaction.hash.toHex(), token, "burn", event.block);

    // updating the amount and the amountUSD for the pieLog Entity...
    let precision = BigInt.fromI32(10).pow(<u8>token.decimals.toI32()).toBigDecimal();
    let price = PriceHelper.findTokenPrice(event.address);

    pieLog.amount = pieLog.amount.minus(event.params.amount.toBigDecimal());
    pieLog.amountUSD = price.tokenPrice.times(pieLog.amount).div(precision);

    pieLog.save();

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