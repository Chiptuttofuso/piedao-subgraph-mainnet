import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Holder, Token, GlobalStat, HoldersCounter } from "../generated/schema"
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

  static loadToken(id: string, symbol: string, name: string, holder: Holder, amount: BigInt): Token {
    let token = Token.load(id + "_" + symbol);

    if (token == null) {
      token = new Token(id + "_" + symbol);
      token.balance = amount;
      token.symbol = symbol;
      token.name = name;
      token.address = <Bytes>Bytes.fromHexString(id);
      token.decimals = BigInt.fromI32(18);
      token.price = BigInt.fromI32(0);
      token.holder = holder.id;
      token.save();
    }
    
    return <Token>token;
  }
}