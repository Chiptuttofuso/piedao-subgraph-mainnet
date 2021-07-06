import { BigInt } from "@graphprotocol/graph-ts"
import {
  Dough,
  ClaimedTokens,
  Transfer,
  NewCloneToken,
  Approval
} from "../generated/Dough/Dough"
import { Holder, Token } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  // loading the Holder Entity, or creating one if doesn't exist yet...
  let holder = Holder.load(event.transaction.from.toHex());

  if (holder == null) {
    holder = new Holder(event.transaction.from.toHex());
    holder.save();
  }

  // loading the Token Entity, or creating one if doesn't exist yet...
  let token = Token.load(event.transaction.from.toHex() + "_DOUGH");

  if (token == null) {
    token = new Token(event.transaction.from.toHex() + "_DOUGH");
    token.balance = event.params._amount;
    token.symbol = "DOUGH";
    token.holder = holder.id;
  } else {
    token.balance = token.balance.plus(event.params._amount);
  }

  token.save();
}

export function handleClaimedTokens(event: ClaimedTokens): void {}

export function handleNewCloneToken(event: NewCloneToken): void {}

export function handleApproval(event: Approval): void {}
