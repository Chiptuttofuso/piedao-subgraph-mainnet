// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class GlobalStat extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save GlobalStat entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save GlobalStat entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("GlobalStat", id.toString(), this);
  }

  static load(id: string): GlobalStat | null {
    return store.get("GlobalStat", id) as GlobalStat | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get locksCounter(): BigInt | null {
    let value = this.get("locksCounter");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set locksCounter(value: BigInt | null) {
    if (value === null) {
      this.unset("locksCounter");
    } else {
      this.set("locksCounter", Value.fromBigInt(value as BigInt));
    }
  }

  get holdersCounter(): Array<string> | null {
    let value = this.get("holdersCounter");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set holdersCounter(value: Array<string> | null) {
    if (value === null) {
      this.unset("holdersCounter");
    } else {
      this.set("holdersCounter", Value.fromStringArray(value as Array<string>));
    }
  }
}

export class HoldersCounter extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save HoldersCounter entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save HoldersCounter entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("HoldersCounter", id.toString(), this);
  }

  static load(id: string): HoldersCounter | null {
    return store.get("HoldersCounter", id) as HoldersCounter | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }

  get globalStat(): string {
    let value = this.get("globalStat");
    return value.toString();
  }

  set globalStat(value: string) {
    this.set("globalStat", Value.fromString(value));
  }
}

export class Holder extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Holder entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Holder entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Holder", id.toString(), this);
  }

  static load(id: string): Holder | null {
    return store.get("Holder", id) as Holder | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokens(): Array<string> {
    let value = this.get("tokens");
    return value.toStringArray();
  }

  set tokens(value: Array<string>) {
    this.set("tokens", Value.fromStringArray(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    return value.toBigInt();
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get holder(): string {
    let value = this.get("holder");
    return value.toString();
  }

  set holder(value: string) {
    this.set("holder", Value.fromString(value));
  }
}
