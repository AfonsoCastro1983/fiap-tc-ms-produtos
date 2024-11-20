import { Item } from "../../domain/entities/Item";
import { Preco } from "../../shared/valueobjects/Preco";
import { CadastrarItemDto } from "../../domain/dtos/CadastrarItemDto";
import { IItemGateway } from "../interfaces/IItemGateway";
import { IItem } from "../interfaces/IItem";

export class CadastrarItemUseCase {
    private itemGateway: IItemGateway;

    constructor (itemGateway: IItemGateway) {
        this.itemGateway = itemGateway;
    }
    async execute(dto: CadastrarItemDto): Promise<IItem> {
        const preco = new Preco(dto.preco);
        const item = new Item(dto.id||0,dto.nome,dto.descricao,preco,dto.ingredientes,dto.categoria);

        return this.itemGateway.salvar(item);
    }

    async get(id: number): Promise<IItem> {
        return this.itemGateway.buscar(id);        
    }

    async delete(index: number): Promise<boolean> {
        return this.itemGateway.deletar(index);
    }
}