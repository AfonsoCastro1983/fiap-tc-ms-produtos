import { Preco } from "../../shared/valueobjects/Preco";
import { Categoria } from "../../shared/emuns/Categoria";
import { IItem } from "../../application/interfaces/IItem";

export class Item implements IItem {
  private _id: number;
  private _nome: string;
  private _descricao: string;
  private _preco: Preco;
  private _ingredientes: string;
  private _categoria: Categoria;

  constructor(id: number,nome: string,descricao: string,preco: Preco,ingredientes: string,categoria: Categoria) {
    this._id = id;
    this._nome = nome;
    if (this._nome == "") {
      throw new Error("O nome do item é obrigatório");
    }
    this._descricao = descricao;
    this._preco = preco;
    this._ingredientes = ingredientes;
    this._categoria = categoria;
  }

  get id(): number {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get descricao(): string {
    return this._descricao;
  }

  get preco(): Preco {
    return this._preco;
  }

  set preco(value: Preco) {
    this._preco = value;
  }

  get ingredientes(): string {
    return this._ingredientes;
  }

  get categoria(): Categoria {
    return this._categoria;
  }
}