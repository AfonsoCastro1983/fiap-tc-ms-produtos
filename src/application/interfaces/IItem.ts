import { Preco } from "../../shared/valueobjects/Preco"
import { Categoria } from "../../shared/emuns/Categoria"

export interface IItem {
    id: number,
    nome: string,
    descricao: string,
    preco: Preco,
    ingredientes: string,
    categoria: Categoria
}