import { ItemGateway } from "../src/infra/database/gateways/ItemGateway";
import { Categoria } from "../src/shared/emuns/Categoria";
import { Preco } from "../src/shared/valueobjects/Preco";
import { AppDataSource } from "../src/infra/database/data-source";
import { Item } from "../src/domain/entities/Item";

jest.mock('../src/infra/database/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

describe("ItemGateway", () => {
    let itemGateway: ItemGateway;
    const mockRepository = {
        save: jest.fn(),
        findOneBy: jest.fn(),
        remove: jest.fn(),
        findBy: jest.fn(),
    }

    beforeEach(() => {
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
        itemGateway = new ItemGateway();
    });

    describe("Cenário: Salvar um novo item", () => {
        it("DADO um item válido, QUANDO eu tentar salvá-lo, ENTÃO deve ser salvo com sucesso", async () => {
            const item = { id: 0, nome: "Pizza", descricao: "Deliciosa", preco: new Preco(20), ingredientes: "Queijo", categoria: Categoria.LANCHE };
            const citem = new Item(item.id, item.nome, item.descricao, item.preco, item.ingredientes, item.categoria);
            const itemSalvo = { ...item, id: 1 };
            mockRepository.save.mockResolvedValue(itemSalvo);

            const resultado = await itemGateway.salvar(citem);
            expect(resultado.id).toBe(1);
            expect(resultado.nome).toBe("Pizza");
        });
    });

    describe("Cenário: Modificar o preço de um item", () => {
        it("DADO um item existente, QUANDO eu modificar seu preço, ENTÃO o preço deve ser atualizado corretamente", async () => {
            const item = { id: 1, nome: "Pizza", descricao: "Deliciosa", preco: new Preco(20), ingredientes: "Queijo", categoria: Categoria.LANCHE };
            const citem = new Item(item.id, item.nome, item.descricao, item.preco, item.ingredientes, item.categoria);
            const itemAtualizado = item;
            itemAtualizado.preco = new Preco(30);
            mockRepository.save.mockResolvedValue(itemAtualizado);
            citem.preco = new Preco(30);
            const resultado = await itemGateway.salvar(citem);
            console.log(resultado);
            expect(resultado.id).toBe(1);
            expect(resultado.nome).toBe("Pizza");
            expect(resultado.preco.valor).toBe(itemAtualizado.preco); // Verifica o novo preço
        });
    });

    describe("Cenário: Pesquisar um item pelo ID", () => {
        it("DADO um ID válido, QUANDO eu buscar o item, ENTÃO deve retornar os dados do item corretamente", async () => {
            const item = {
                id: 1,
                nome: "Pizza",
                descricao: "Deliciosa pizza",
                preco: new Preco(25),
                ingredientes: "Queijo, Molho de Tomate",
                categoria: Categoria.LANCHE
            };

            // Mock do método findOneBy para retornar o item correto
            mockRepository.findOneBy.mockResolvedValue({
                id: item.id,
                nome: item.nome,
                descricao: item.descricao,
                preco: item.preco.valor, // Simula a persistência apenas do valor do preço
                ingredientes: item.ingredientes,
                categoria: item.categoria,
            });

            const resultado = await itemGateway.buscar(item.id);

            // Validações
            expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: item.id });
            expect(resultado.id).toBe(1);
            expect(resultado.nome).toBe("Pizza");
            expect(resultado.descricao).toBe("Deliciosa pizza");
            expect(resultado.preco).toBeInstanceOf(Preco);
            expect(resultado.preco.valor).toBe(25);
            expect(resultado.ingredientes).toBe("Queijo, Molho de Tomate");
            expect(resultado.categoria).toBe(Categoria.LANCHE);
        });
    });

    describe("Cenário: Buscar um item inexistente", () => {
        it("DADO um ID inválido, QUANDO eu tentar buscar o item, ENTÃO deve lançar um erro dizendo 'Item não existe'", async () => {
            mockRepository.findOneBy.mockResolvedValue(null);

            await expect(itemGateway.buscar(1)).rejects.toThrow("Item não existe");
        });
    });

    describe("Cenário: Excluir um item pelo ID", () => {
        it("DADO um ID de item existente, QUANDO eu tentar excluí-lo, ENTÃO o item deve ser removido com sucesso", async () => {
            const item = { id: 1, nome: "Pizza" };
            mockRepository.findOneBy.mockResolvedValue(item);

            const resultado = await itemGateway.deletar(1);
            expect(resultado).toBe(true);
        });
    });

    describe("Cenário: Tentar excluir um item inexistente", () => {
        it("DADO um ID de item inexistente, QUANDO eu tentar excluí-lo, ENTÃO deve lançar um erro dizendo 'Registro não encontrado'", async () => {
            // Mock do método findOneBy para simular item não encontrado
            mockRepository.findOneBy.mockResolvedValue(null);

            await expect(itemGateway.deletar(999)).rejects.toThrow("Registro não encontrado");

            // Verifica se o método findOneBy foi chamado com o ID correto
            expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
        });
    });


    describe("Cenário: Listar itens por categoria", () => {
        it("DADO uma categoria válida, QUANDO eu buscar os itens dessa categoria, ENTÃO deve retornar uma lista de itens correspondentes", async () => {
            const itens = [
                { id: 1, nome: "Hambúrguer", categoria: Categoria.LANCHE },
                { id: 2, nome: "Refrigerante", categoria: Categoria.BEBIDA },
            ];
            mockRepository.findBy.mockResolvedValue(itens);

            const resultado = await itemGateway.listaPorCategoria(Categoria.LANCHE);
            expect(resultado.length).toBe(2);
        });
    });
});