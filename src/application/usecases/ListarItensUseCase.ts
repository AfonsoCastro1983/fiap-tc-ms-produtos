import { Categoria } from "../../shared/emuns/Categoria";
import { IItemGateway } from "../interfaces/IItemGateway";
import { IItem } from "../interfaces/IItem";

export class ListarItensUseCase {
    private ItemGateway: IItemGateway;
    
    constructor(itemGateway: IItemGateway) {
        this.ItemGateway = itemGateway;
    }

    async listarPorCategoria(categoria: string): Promise<Array<IItem>> {
        const categoriaValida = Categoria[categoria as keyof typeof Categoria];
        if (categoriaValida) {
            const itens = this.ItemGateway.listaPorCategoria(categoriaValida);
            return itens;
        }
        else {
            throw new Error('Categoria Inválida')
        }
    }
}