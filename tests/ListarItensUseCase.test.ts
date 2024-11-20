import { ListarItensUseCase } from '../src/application/usecases/ListarItensUseCase'
import { Categoria } from '../src/shared/emuns/Categoria';
import { ItemGateway } from '../src/infra/database/gateways/ItemGateway';
import { Preco } from '../src/shared/valueobjects/Preco';

jest.mock('../src/infra/database/gateways/ItemGateway');

describe("ListarItensUseCase", () => {
    let listarItensUseCaseMock: ListarItensUseCase;
    let itemGatewayMock: jest.Mocked<ItemGateway>;

    beforeEach(() => {
        itemGatewayMock = new ItemGateway() as jest.Mocked<ItemGateway>;
        itemGatewayMock.listaPorCategoria = jest.fn();
        listarItensUseCaseMock = new ListarItensUseCase(itemGatewayMock);
    });

    test("deve listar itens por categoria válida", async () => {
        const itens = [
            { id: 1, nome: "Pizza", descricao: "Teste", ingredientes: "Teste", categoria: Categoria.LANCHE, preco: new Preco(25) },
            { id: 2, nome: "Refrigerante", descricao: "Teste", ingredientes: "Teste", categoria: Categoria.BEBIDA, preco: new Preco(10) },
        ];

        itemGatewayMock.listaPorCategoria.mockResolvedValue(itens);

        const resultado = await listarItensUseCaseMock.listarPorCategoria("LANCHE");

        expect(itemGatewayMock.listaPorCategoria).toHaveBeenCalledWith(Categoria.LANCHE);
        expect(resultado).toEqual(itens);
        expect(resultado.length).toBe(2);
        expect(resultado[0].nome).toBe("Pizza");
    });

    test("deve lançar erro ao tentar listar itens por categoria inválida", async () => {
        await expect(listarItensUseCaseMock.listarPorCategoria("INVALIDA"))
            .rejects
            .toThrow("Categoria Inválida");
    });

    test("deve retornar uma lista vazia quando não houver itens para a categoria", async () => {
        itemGatewayMock.listaPorCategoria.mockResolvedValue([]);

        const resultado = await listarItensUseCaseMock.listarPorCategoria("BEBIDA");

        expect(itemGatewayMock.listaPorCategoria).toHaveBeenCalledWith(Categoria.BEBIDA);
        expect(resultado).toEqual([]);
    });
});
