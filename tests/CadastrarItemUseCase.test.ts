import { CadastrarItemUseCase } from '../src/application/usecases/CadastrarItemUseCase';
import { Categoria } from '../src/shared/emuns/Categoria';
import { CadastrarItemDto } from '../src/domain/dtos/CadastrarItemDto';
import { ItemGateway } from '../src/infra/database/gateways/ItemGateway';

jest.mock('../src/infra/database/gateways/ItemGateway');

describe("CadastrarItemUseCase", () => {
    let itemGatewayMock: jest.Mocked<ItemGateway>;
    let cadastrarItemUseCaseMock: CadastrarItemUseCase;

    beforeEach(() => {
        itemGatewayMock = new ItemGateway() as jest.Mocked<ItemGateway>;
        cadastrarItemUseCaseMock = new CadastrarItemUseCase(itemGatewayMock);
    });

    it("deve lançar erro ao tentar salvar um item com preço negativo", async () => {
        const dto = new CadastrarItemDto();
        dto.nome = "Sanduíche";
        dto.descricao = "Delicioso sanduíche";
        dto.preco = -10; // Preço inválido
        dto.ingredientes = "Pão, Queijo, Presunto";
        dto.categoria = Categoria.LANCHE;

        await expect(cadastrarItemUseCaseMock.execute(dto)).rejects.toThrow("Valor do preço não pode ser negativo");
    });

    it("deve lançar erro ao tentar salvar um item sem nome", async () => {
        const dto = new CadastrarItemDto();
        dto.nome = ""; // Nome inválido
        dto.descricao = "Item sem nome";
        dto.preco = 10;
        dto.ingredientes = "Ingrediente A, Ingrediente B";
        dto.categoria = Categoria.LANCHE;

        await expect(cadastrarItemUseCaseMock.execute(dto)).rejects.toThrow("O nome do item é obrigatório");
    });

    it("deve lançar erro ao buscar um item inexistente", async () => {
        itemGatewayMock.buscar.mockRejectedValue(new Error('Item não existe'));
        await expect(cadastrarItemUseCaseMock.get(999)).rejects.toThrow("Item não existe");
    });

    it("deve deletar um item pelo índice", async () => {
        itemGatewayMock.deletar.mockResolvedValue(true);

        const resultado = await cadastrarItemUseCaseMock.delete(1);
        expect(itemGatewayMock.deletar).toHaveBeenCalledWith(1);
        expect(resultado).toBe(true);
    });

    it("deve lançar erro ao tentar deletar um item inexistente", async () => {
        itemGatewayMock.deletar.mockRejectedValue(new Error('Registro não encontrado'));

        await expect(cadastrarItemUseCaseMock.delete(999)).rejects.toThrow("Registro não encontrado");
    });
});
