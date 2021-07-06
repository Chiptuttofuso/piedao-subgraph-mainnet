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
  Transfer
} from "../generated/Ypie/Ypie"

/*
handlerTransfer
  if address_from 0x0 -> MINT
*/

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

export function handlerTransfer(event: Transfer): void {}

export function handlerCall(event: Call): void {}
