import { Categoria } from "../../shared/emuns/Categoria";

export class CadastrarItemDto {
    id?: number;
    nome: string = "";
    descricao: string = "";
    preco: number = 0;
    ingredientes: string = "";
    categoria: Categoria = Categoria.LANCHE;
  }