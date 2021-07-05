import { BigInt } from "@graphprotocol/graph-ts"
import {
  Dough,
  ClaimedTokens,
  Transfer,
  NewCloneToken,
  Approval
} from "../generated/Dough/Dough"
import { Holder } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  let holder = Holder.load(event.transaction.from.toHex());

  if (holder == null) {
    holder = new Holder(event.transaction.from.toHex());
    holder.balance = BigInt.fromI32(0);
  }

  holder.balance = holder.balance.plus(event.params._amount);
  //holder.balance = BigInt.fromI32(123);
  holder.save();
}

export function handleClaimedTokens(event: ClaimedTokens): void {}

export function handleNewCloneToken(event: NewCloneToken): void {}

export function handleApproval(event: Approval): void {}
