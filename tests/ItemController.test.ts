import ItemController from '../src/infra/http/controllers/ItemController'
import { Categoria } from '../src/shared/emuns/Categoria';
import { ItemGateway } from '../src/infra/database/gateways/ItemGateway';
import { Preco } from '../src/shared/valueobjects/Preco';

jest.mock('../src/infra/database/gateways/ItemGateway');

describe("ItemController", () => {
    let controller: ItemController;
    let itemGatewayMock: jest.Mocked<ItemGateway>;

    beforeEach(() => {
        itemGatewayMock = new ItemGateway() as jest.Mocked<ItemGateway>;
        itemGatewayMock.salvar = jest.fn();
        itemGatewayMock.buscar = jest.fn();
        itemGatewayMock.deletar = jest.fn();
        itemGatewayMock.listaPorCategoria = jest.fn();
        controller = new ItemController(itemGatewayMock);
    });

    test("deve salvar um novo item", async () => {
        const request = {
            nome: "Hambúrguer",
            descricao: "Hambúrguer delicioso",
            preco: 20,
            ingredientes: "Carne, Pão, Alface",
            categoria: "LANCHE",
        };

        const savedItem = { id: 1, ...request, preco: new Preco(20), categoria: Categoria.LANCHE };
        itemGatewayMock.salvar.mockResolvedValue(savedItem);

        const resultado = await controller.salvarNovoItem(request);

        expect(resultado.id).toBe(1);
        expect(resultado.nome).toBe("Hambúrguer");
        expect(resultado.preco).toBe(20);
        expect(resultado.categoria).toBe(Categoria.LANCHE);
        expect(itemGatewayMock.salvar).toHaveBeenCalledWith(expect.anything());
    });

    test("deve lançar erro ao salvar um item com dados inválidos", async () => {
        const request = {
            nome: "",
            descricao: "Item inválido",
            preco: -5,
            ingredientes: "",
            categoria: "INVALIDA",
        };

        await expect(controller.salvarNovoItem(request)).rejects.toThrow();
    });

    test("deve editar um item existente", async () => {
        const request = {
            id: 1,
            nome: "Hambúrguer Atualizado",
            descricao: "Descrição atualizada",
            preco: 25,
            ingredientes: "Carne, Pão, Bacon",
            categoria: "LANCHE",
        };

        const updatedItem = { ...request, preco: new Preco(25), categoria: Categoria.LANCHE };
        itemGatewayMock.salvar.mockResolvedValue(updatedItem);

        const resultado = await controller.editarItem(request);

        expect(resultado.id).toBe(1);
        expect(resultado.nome).toBe("Hambúrguer Atualizado");
        expect(resultado.preco).toBe(25);
        expect(itemGatewayMock.salvar).toHaveBeenCalledWith(expect.anything());
    });

    test("deve excluir um item existente", async () => {
        itemGatewayMock.deletar.mockResolvedValue(true);

        const resultado = await controller.eliminarItem(1);

        expect(resultado).toBe(true);
        expect(itemGatewayMock.deletar).toHaveBeenCalledWith(1);
    });

    test("deve lançar erro ao excluir um item inexistente", async () => {
        itemGatewayMock.deletar.mockRejectedValue(new Error('Registro não encontrado'))

        await expect(controller.eliminarItem(999)).rejects.toThrow();
        expect(itemGatewayMock.deletar).toHaveBeenCalledWith(999);
    });

    test("deve listar itens por categoria válida", async () => {
        // Configura o mock para retornar a lista de itens
        itemGatewayMock.listaPorCategoria.mockResolvedValue([
            { id: 1, nome: "Pizza", descricao: "Testes", ingredientes: "Testes", preco: new Preco(25), categoria: Categoria.LANCHE },
            { id: 2, nome: "Suco", descricao: "Testes", ingredientes: "Testes", preco: new Preco(10), categoria: Categoria.LANCHE },
        ]);
    
        // Chama o método do controlador
        controller = new ItemController(itemGatewayMock);
        const resultado = await controller.buscaItemPorCategoria("LANCHE");
    
        // Validações
        expect(resultado.itens.length).toBe(2);
        expect(resultado.itens[0].nome).toBe("Pizza");
        expect(resultado.itens[1].nome).toBe("Suco");
        expect(itemGatewayMock.listaPorCategoria).toHaveBeenCalledWith(Categoria.LANCHE);
    });

    test("deve lançar erro ao listar itens por categoria inválida", async () => {
        await expect(controller.buscaItemPorCategoria("INVALIDA")).rejects.toThrow("Categoria Inválida");
    });
});
