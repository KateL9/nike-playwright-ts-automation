import { Gender } from "../enums/Gender";
import { Price } from "../enums/Price";

export interface IFilterOption {
    gender: Gender[];
    price: Price[];
    sale: boolean;
}