import express from "express";
import ItemController from "../controllers/ItemController";
import { ItemGateway } from "../../database/gateways/ItemGateway";

const router = express.Router()

//Item = Produto individual disponível no cardápio da lanchonete (ex: sanduíche, batata frita, refrigerante)
///1ªFase - Entregáveis 2 - iii. Criar
router.post("/item", async (req, res) => {
    try {
        const controller = new ItemController(new ItemGateway());
        const item = await controller.salvarNovoItem(req.body);

        return res.status(201).send(item);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ erro: error.message });
        }
    }
});
///1ªFase - Entregáveis 2 - iii. Editar
router.put("/item", async (req, res) => {
    try {
        const controller = new ItemController(new ItemGateway());
        const item = await controller.editarItem(req.body);

        return res.status(201).send(item);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ erro: error.message });
        }
    }

});
///1ªFase - Entregáveis 2 - iii. Remover
router.delete("/item/:id", async (req, res) => {
    try {
        const controller = new ItemController(new ItemGateway());
        const resposta = await controller.eliminarItem(Number(req.params.id));

        if (resposta) {
            return res.status(201).send("Item excluído");
        }
        else {
            return res.status(404).send("Item não encontrado");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ erro: error.message });
        }
    }
});
///1ªFase - Entregáveis 2 - iv. Buscar item por categoria
router.get("/item/:categoria", async (req, res) => {
    try {
        const controller = new ItemController(new ItemGateway());
        const resposta = await controller.buscaItemPorCategoria(req.params.categoria);

        return res.status(200).json(resposta);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ erro: error.message });
        }
    }
});

export default router;