import { CadastrarItemUseCase } from '../src/application/usecases/CadastrarItemUseCase';
import { Categoria } from '../src/shared/emuns/Categoria';
import { CadastrarItemDto } from '../src/domain/dtos/CadastrarItemDto';
import { ItemGateway } from '../src/infra/database/gateways/ItemGateway';

jest.mock('../src/infra/database/gateways/ItemGateway');

describe("Cadastrar itens no sistema", () => {
    let itemGatewayMock: jest.Mocked<ItemGateway>;
    let cadastrarItemUseCaseMock: CadastrarItemUseCase;

    beforeEach(() => {
        itemGatewayMock = new ItemGateway() as jest.Mocked<ItemGateway>;
        cadastrarItemUseCaseMock = new CadastrarItemUseCase(itemGatewayMock);
    });

    describe("Cenário: Salvar um item com preço negativo", () => {
        it("DADO um item com preço negativo, QUANDO eu tentar salvá-lo ENTÃO deve lançar um erro 'Valor do preço não pode ser negativo'", async () => {
            const dto = new CadastrarItemDto();
            dto.nome = "Sanduíche";
            dto.descricao = "Delicioso sanduíche";
            dto.preco = -10; // Preço inválido
            dto.ingredientes = "Pão, Queijo, Presunto";
            dto.categoria = Categoria.LANCHE;

            await expect(cadastrarItemUseCaseMock.execute(dto)).rejects.toThrow("Valor do preço não pode ser negativo");
        });
    });

    describe("Cenário: Salvar um item sem nome", () => {
        it("DADO um item sem nome, QUANDO eu tentar salvá-lo, ENTÃO deve lançar um erro dizendo 'O nome do item é obrigatório'", async () => {
            const dto = new CadastrarItemDto();
            dto.nome = ""; // Nome inválido
            dto.descricao = "Item sem nome";
            dto.preco = 10;
            dto.ingredientes = "Ingrediente A, Ingrediente B";
            dto.categoria = Categoria.LANCHE;

            await expect(cadastrarItemUseCaseMock.execute(dto)).rejects.toThrow("O nome do item é obrigatório");
        });
    });

    describe("Cenário: Buscar um item inexistente", () => {
        it("DADO um ID de item inexistente, QUANDO eu tentar buscá-lo, ENTÂO deve lançar um erro dizendo 'Item não existe'", async () => {
            itemGatewayMock.buscar.mockRejectedValue(new Error('Item não existe'));
            await expect(cadastrarItemUseCaseMock.get(999)).rejects.toThrow("Item não existe");
        });
    });

    describe("Cenário: Deletar um item pelo índice", () => {
        it("DADO um ID de item existente, QUANDO eu deletá-lo, ENTÃO deve ser deletado com sucesso", async () => {
            itemGatewayMock.deletar.mockResolvedValue(true);

            const resultado = await cadastrarItemUseCaseMock.delete(1);
            expect(itemGatewayMock.deletar).toHaveBeenCalledWith(1);
            expect(resultado).toBe(true);
        });
    });

    describe("Scenario: Tentar deletar um item inexistente", () => {
    it("DADO um ID de item inexistente, QUANDO eu tentar deletá-lo, ENTÃO deve lançar um erro dizendo 'Registro não encontrado'", async () => {
        itemGatewayMock.deletar.mockRejectedValue(new Error('Registro não encontrado'));

        await expect(cadastrarItemUseCaseMock.delete(999)).rejects.toThrow("Registro não encontrado");
    });
    });
});
