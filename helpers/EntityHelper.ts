import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Holder, Token, GlobalStat, HoldersCounter } from "../generated/schema"
import { ERC20 } from "../helpers/ERC20"
const UNIQUE_STAT_ID = "unique_stats_id"
export class EntityHelper {

  constructor() {}

  static loadGlobalStats(): GlobalStat {
    let stats = GlobalStat.load(UNIQUE_STAT_ID);

    if(stats == null) {
      stats = new GlobalStat(UNIQUE_STAT_ID);
      stats.save();
    }
    
    return <GlobalStat>stats;
  }

  static loadHoldersCounter(symbol: string): HoldersCounter {
    let holdersCounter = HoldersCounter.load(symbol);
    let stats = this.loadGlobalStats();

    if(holdersCounter == null) {
      holdersCounter = new HoldersCounter(symbol);
      holdersCounter.count = BigInt.fromI32(0);
      holdersCounter.globalStat = stats.id;
      holdersCounter.save();
    }

    return <HoldersCounter>holdersCounter;
  }

  static incrementHoldersCounter(symbol: string): HoldersCounter {
    let holdersCounter = this.loadHoldersCounter(symbol);

    holdersCounter.count = holdersCounter.count.plus(BigInt.fromI32(1));
    holdersCounter.save();

    return <HoldersCounter>holdersCounter;
  }

  static loadHolder(id: string, symbol: string): Holder {
    let holder = Holder.load(id);

    if (holder == null) {
      holder = new Holder(id);
      holder.save();

      this.incrementHoldersCounter(symbol);
    }

    return <Holder>holder;
  }

  static loadToken(id: string, tokenContract: ERC20, holder: Holder, amount: BigInt): Token {
    let token = Token.load(id + "_" + tokenContract.symbol());

    if (token == null) {
      token = new Token(id + "_" + tokenContract.symbol());
      token.balance = amount;
      token.symbol = tokenContract.symbol();
      token.name = tokenContract.name();
      token.address = <Bytes>tokenContract._address;
      token.decimals = BigInt.fromI32(tokenContract.decimals());
      token.price = BigInt.fromI32(0);
      token.holder = holder.id;
      token.save();
    }
    
    return <Token>token;
  }
}