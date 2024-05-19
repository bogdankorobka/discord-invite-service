import { Item } from "./item";

export class Bot implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public merchant_guid?: string,
    public token?: string,
    public id?: number,
    public created_at?: Date,
    public updated_at?: Date,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {
    this["@id"] = _id;
  }
}
