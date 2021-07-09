import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Holder, Token, GlobalStat, HoldersCounter, Wallet } from "../generated/schema"
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

  static loadHolder(id: string, tokenContract: ERC20): Holder {
    let holder = Holder.load(id);

    if (holder == null) {
      holder = new Holder(id);
      holder.save();

      this.incrementHoldersCounter(tokenContract.symbol());
    }

    return <Holder>holder;
  }

  static loadToken(tokenContract: ERC20): Token {
    let token = Token.load(tokenContract.symbol());

    if (token == null) {
      token = new Token(tokenContract.symbol());
      token.name = tokenContract.name();
      token.address = <Bytes>tokenContract._address;
      token.decimals = BigInt.fromI32(tokenContract.decimals());
      token.price = BigInt.fromI32(0);
      token.save();
    }
    
    return <Token>token;
  }

  static loadWallet(id: string, holder: Holder, token: Token): Wallet {
    let wallet = Wallet.load(id);

    if (wallet == null) {
      wallet = new Wallet(id);
      wallet.balance = BigInt.fromI32(0);
      wallet.holder = holder.id;
      wallet.token = token.id;
      wallet.save();
    }
    
    return <Wallet>wallet;
  }  
}