import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { Holder, Token, GlobalStat, HoldersCounter, Wallet, PieVault } from "../generated/schema"
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
      token.save();
    }
    
    return <Token>token;
  }

  static loadWallet(holder: Holder, token: Token): Wallet {
    let wallet = Wallet.load(holder.id + "_" + token.id);

    if (wallet == null) {
      wallet = new Wallet(holder.id + "_" + token.id);
      wallet.balance = BigInt.fromI32(0).toBigDecimal();
      wallet.holder = holder.id;
      wallet.token = token.id;
      wallet.save();
    }
    
    return <Wallet>wallet;
  }  

  static loadPieVault(id: string, token: Token, action: string, amount: BigInt, block: ethereum.Block): PieVault {
    let pieVault = PieVault.load(id);

    if (pieVault == null) {
      pieVault = new PieVault(id);
      pieVault.action = action;
      pieVault.block = block.number;
      pieVault.timestamp = block.timestamp;
      pieVault.price = BigInt.fromI32(0).toBigDecimal();
      pieVault.balance = BigInt.fromI32(0).toBigDecimal();
      pieVault.totalSupply = BigInt.fromI32(0);
      pieVault.token = token.id;
      pieVault.save();
    }
    
    /*
      pieVault.balance = pieVault.totalSupply.plus(amount);
      pieVault.totalSupply = pieVault.totalSupply.plus(amount.times(pieVault.price));
    */
    return <PieVault>pieVault;
  }   
}