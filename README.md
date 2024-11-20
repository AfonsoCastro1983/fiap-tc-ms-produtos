# Lanchonete API - Pós-Tech FIAP - Arquitetura de Software

Este repositório contém o código-fonte para as APIs de gerenciamento de produtos da Lanchonete, desenvolvido durante o primeiro módulo da Pós-Tech FIAP de Arquitetura de Software. O projeto foi atualizado para usar uma arquitetura baseada em micro serviços e implementado com tecnologias modernas para escalabilidade e manutenção.

## Tecnologias Utilizadas

- **TypeScript**: Linguagem de programação.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados.
- **Docker**: Ferramenta de virtualização e orquestração de containers.
- **Docker Compose**: Ferramenta para orquestrar múltiplos serviços Docker.
- **Swagger**: Ferramenta de documentação de APIs.
- **TypeORM**: ORM (Object-Relational Mapping) para qualquer banco de dados.
- **Amazon ECS**: Serviço gerenciado para execução de containers.
- **API Gateway**: Serviço gerenciado que permite criar, publicar e gerenciar APIs seguras e escaláveis para acessar aplicações backend.

## APIs de Produtos

### Domínios e Entidades

A API de gerenciamento de produtos inclui as seguintes classes de domínio:

- **Produto**: Representa um item do cardápio da lanchonete.

### Endpoints

- **POST /produto**: Criação de um novo produto.
  - Exemplo de payload:
    ```json
    {
      "nome": "Hambúrguer Clássico",
      "descricao": "Hambúrguer com queijo, alface e tomate.",
      "preco": 18.50,
      "ingredientes": "Pão, carne, queijo, alface, tomate",
      "categoria": "LANCHE"
    }
    ```
    ```json
    {
      "nome": "Refrigerante",
      "descricao": "Refrigerante gelado de 350ml.",
      "preco": 5.00,
      "ingredientes": "Água, açúcar, gás carbônico",
      "categoria": "BEBIDA"
    }
    ```
    ```json
    {
      "nome": "Batata Frita",
      "descricao": "Batata frita crocante e salgada.",
      "preco": 10.00,
      "ingredientes": "Batata, óleo, sal",
      "categoria": "ACOMPANHAMENTO"
    }
    ```
    ```json
    {
      "nome": "Sorvete",
      "descricao": "Sorvete de chocolate com calda.",
      "preco": 12.00,
      "ingredientes": "Leite, açúcar, cacau",
      "categoria": "SOBREMESA"
    }
    ```
    ```json
    {
      "nome": "Sanduíche Natural",
      "descricao": "Sanduíche natural com frango e salada.",
      "preco": 15.00,
      "ingredientes": "Pão integral, frango, alface, tomate",
      "categoria": "LANCHE"
    }
    ```
    ```json
    {
      "nome": "Suco de Laranja",
      "descricao": "Suco de laranja natural de 300ml.",
      "preco": 8.00,
      "ingredientes": "Laranja",
      "categoria": "BEBIDA"
    }
    ```
    ```json
    {
      "nome": "Anéis de Cebola",
      "descricao": "Anéis de cebola fritos e crocantes.",
      "preco": 12.00,
      "ingredientes": "Cebola, farinha, óleo",
      "categoria": "ACOMPANHAMENTO"
    }
    ```
    ```json
    {
      "nome": "Brownie",
      "descricao": "Brownie de chocolate com nozes.",
      "preco": 9.00,
      "ingredientes": "Chocolate, farinha, ovos, nozes",
      "categoria": "SOBREMESA"
    }
    ```
    ```json
    {
      "nome": "Cheeseburger",
      "descricao": "Cheeseburger com queijo cheddar.",
      "preco": 20.00,
      "ingredientes": "Pão, carne, queijo cheddar, alface",
      "categoria": "LANCHE"
    }
    ```
    ```json
    {
      "nome": "Milkshake",
      "descricao": "Milkshake de morango de 400ml.",
      "preco": 14.00,
      "ingredientes": "Leite, sorvete, morango",
      "categoria": "BEBIDA"
    }
    ```
- **PUT /produto**: Atualização de dados de um produto existente.
- **DELETE /produto/{id}**: Exclusão de um produto pelo identificador.
- **GET /produto/{categoria}**: Busca de produtos por categoria. Categorias disponíveis: `LANCHE`, `BEBIDA`, `ACOMPANHAMENTO`, `SOBREMESA`.

### Documentação da API

A documentação da API pode ser acessada através do Swagger no ambiente local:

```bash
http://localhost:8000/docs