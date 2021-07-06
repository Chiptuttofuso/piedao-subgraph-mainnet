import { BigInt } from "@graphprotocol/graph-ts"
import { Holder, Token } from "../generated/schema"

export class EntityHelper {
  constructor() {}

  static loadHolder(id: string): Holder {
    let holder = Holder.load(id);

    if (holder == null) {
      holder = new Holder(id);
      holder.save();
    }

    return <Holder>holder;
  }

  static loadToken(id: string, symbol: string, holder: Holder, amount: BigInt): Token {
    let token = Token.load(id + "_" + symbol);

    if (token == null) {
      token = new Token(id + "_" + symbol);
      token.balance = amount;
      token.symbol = "DOUGH";
      token.holder = holder.id;
    }
    
    return <Token>token;
  }
}