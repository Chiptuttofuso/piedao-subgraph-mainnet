import { 
  AnnualizedFeeSet,
  Approval ,
  Call,
  CallerAdded,
  CallerRemoved,
  CapSet,
  EntryFeeBeneficiaryShareSet,
  EntryFeeSet,
  ExitFeeBeneficiaryShareSet,
  ExitFeeSet,
  FeeBeneficiarySet,
  FeeCharged,
  LockSet,
  OwnershipTransferred,
  PoolExited,
  PoolJoined,
  TokenAdded,
  TokenRemoved,
  Transfer,
  PieVault
} from "../generated/Ypie/PieVault"
import {PieVaultsHelper } from "../helpers/PieVaultsHelper"
import { log } from "@graphprotocol/graph-ts"

export function handlerTransfer(event: Transfer): void {
  let ypie = PieVault.bind(event.address);
  let tokens = ypie.getTokens();

  tokens.forEach(token => {
    let tokenContract = PieVault.bind(token);
    let tokenBalance = tokenContract.balanceOf(token);
    let tokenPrice = PieVaultsHelper.findTokenPrice(token);
    log.info("balance of token -----> {} - {} - {} - {}", 
      [
        tokenContract.name(), 
        tokenBalance.toString(),
        tokenPrice.ethPrice.toString(),
        tokenPrice.tokenPrice.toString()
      ]);
  });
  
  PieVaultsHelper.transfer(event.address, event.params.from, event.params.to, event.params.value);
}

export function handlerAnnualizedFeeSet(event: AnnualizedFeeSet): void {}

export function handlerApproval(event: Approval): void {}

export function handlerCallerAdded(event: CallerAdded): void {}

export function handlerCallerRemoved(event: CallerRemoved): void {}

export function handlerCapSet(event: CapSet): void {}

export function handlerEntryFeeBeneficiaryShareSet(event: EntryFeeBeneficiaryShareSet): void {}

export function handlerEntryFeeSet(event: EntryFeeSet): void {}

export function handlerExitFeeBeneficiaryShareSet(event: ExitFeeBeneficiaryShareSet): void {}

export function handlerExitFeeSet(event: ExitFeeSet): void {}

export function handlerFeeBeneficiarySet(event: FeeBeneficiarySet): void {}

export function handlerFeeCharged(event: FeeCharged): void {}

export function handlerLockSet(event: LockSet): void {}

export function handlerOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlerPoolExited(event: PoolExited): void {}

export function handlerPoolJoined(event: PoolJoined): void {}

export function handlerTokenAdded(event: TokenAdded): void {}

export function handlerTokenRemoved(event: TokenRemoved): void {}

export function handlerCall(event: Call): void {}
