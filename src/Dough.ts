import {
  ClaimedTokens,
  Transfer,
  NewCloneToken,
  Approval
} from "../generated/Dough/Dough"
import { DoughHelper } from "../helpers/DoughHelper"

export function handleTransfer(event: Transfer): void {
  DoughHelper.transfer(event.params._from, event.params._to, event.params._amount);
}

export function handleClaimedTokens(event: ClaimedTokens): void {}

export function handleNewCloneToken(event: NewCloneToken): void {}

export function handleApproval(event: Approval): void {}
