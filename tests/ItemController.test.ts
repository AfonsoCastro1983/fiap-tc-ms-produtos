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

    describe("Cenário: Salvar um novo item", () => {
        it("DADO um item válido, QUANDO eu tentar salvá-lo, ENTÃO deve ser salvo com sucesso", async () => {
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
    });

    describe("Cenário: Tentar salvar um item com dados inválidos", () => {
        it("DADO um item com dados inválidos, QUANDO eu tentar salvá-lo, ENTÃO deve lançar um erro", async () => {
            const request = {
                nome: "",
                descricao: "Item inválido",
                preco: -5,
                ingredientes: "",
                categoria: "INVALIDA",
            };

            await expect(controller.salvarNovoItem(request)).rejects.toThrow();
        });
    });

    describe("Cenário: Editar um item existente", () => {
        it("DADO um item existente com novas informações, QUANDO eu tentar editá-lo, ENTÃO deve ser atualizado com sucesso", async () => {
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
    });

    describe("Cenário: Excluir um item existente", () => {
        it("DADO um item existente, QUANDO eu tentar excluí-lo, ENTÃO deve ser removido com sucesso", async () => {
            itemGatewayMock.deletar.mockResolvedValue(true);

            const resultado = await controller.eliminarItem(1);

            expect(resultado).toBe(true);
            expect(itemGatewayMock.deletar).toHaveBeenCalledWith(1);
        });
    });

    describe("Cenário: Tentar excluir um item inexistente", () => {
        it("DADO um item inexistente, QUANDO eu tentar excluí-lo, ENTÃO deve lançar um erro", async () => {
            itemGatewayMock.deletar.mockRejectedValue(new Error('Registro não encontrado'))

            await expect(controller.eliminarItem(999)).rejects.toThrow();
            expect(itemGatewayMock.deletar).toHaveBeenCalledWith(999);
        });
    });

    describe("Cenário: Listar itens por categoria válida", () => {
        it("DADO uma categoria válida, QUANDO eu buscar os itens, ENTÃO deve retornar uma lista de itens correspondentes", async () => {
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
    });

    describe("Cenário: Listar itens por categoria inválida", () => {
        it("DADO uma categoria inválida, QUANDO eu buscar os itens, ENTÃO deve lançar um erro", async () => {
            await expect(controller.buscaItemPorCategoria("INVALIDA")).rejects.toThrow("Categoria Inválida");
        });
    });
});
