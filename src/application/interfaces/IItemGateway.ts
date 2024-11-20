import { Item } from "../../domain/entities/Item";
import { Categoria } from "../../shared/emuns/Categoria";
import { IItem } from "./IItem";

export interface IItemGateway {
    salvar(item: Item): Promise<IItem>;
    deletar(id: number): Promise<boolean>;
    buscar(id: number): Promise<IItem>;
    listaPorCategoria(categoria: Categoria): Promise<IItem[]>;
}