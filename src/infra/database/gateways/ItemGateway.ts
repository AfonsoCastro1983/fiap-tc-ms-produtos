import { Repository } from "typeorm";
import { IItem } from "../../../application/interfaces/IItem";
import { IItemGateway } from "../../../application/interfaces/IItemGateway";
import { Item } from "../../../domain/entities/Item";
import { AppDataSource } from "../data-source";
import { ItemRepository } from "../repositories/Item";
import { Preco } from "../../../shared/valueobjects/Preco";
import { Categoria } from "../../../shared/emuns/Categoria";

export class ItemGateway implements IItemGateway {
    private readonly repItem: Repository<ItemRepository>;

    constructor () {
        this.repItem = AppDataSource.getRepository(ItemRepository);
    }

    async salvar(item: Item): Promise<IItem> {
        let rep = new ItemRepository();

        rep.id = item.id;
        rep.nome = item.nome;
        rep.descricao = item.descricao;
        rep.preco = item.preco.valor;
        rep.ingredientes = item.ingredientes;
        rep.categoria = item.categoria;
        const novo = await this.repItem.save(rep);
        rep = novo;
        
        item = new Item(rep.id,rep.nome,rep.descricao,new Preco(rep.preco),rep.ingredientes,rep.categoria);
        return item;
    }

    async buscar(id: number): Promise<IItem> {
        const pesq = await this.repItem.findOneBy({ id: id });
        let item : Item;
        if (!pesq) {
            throw new Error('Item não existe');
        }
        item = new Item(pesq.id, pesq.nome, pesq.descricao, new Preco(pesq.preco), pesq.ingredientes, pesq.categoria);
        return item;
    }

    async deletar(id: number): Promise<boolean> {
        const pesq = await this.repItem.findOneBy({ id: id });
        if (pesq) {
            try {
                await this.repItem.remove(pesq);
                return true;
            }
            catch (error) {
                return false;
            }
        }
        else {
            throw new Error('Registro não encontrado');
        }        
    }

    async listaPorCategoria(categoria: Categoria): Promise<IItem[]> {
        const itens = await this.repItem.findBy({categoria: categoria});
        const retorno: Item[] = [];
        itens.forEach(element => {
            retorno.push(new Item(element.id,element.nome,element.descricao,new Preco(element.preco),element.ingredientes,element.categoria));
        });

        return retorno;
    }
}