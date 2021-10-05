# api-cadastro

API HTTP em Express.js (Typescript), com cadastro e controle de usuários.

## Relacionamentos

Modele uma base de dados com registros de usuário e endereços. O relacionamento entre elas deve ser do tipo 1:N, ou seja, cada usuário pode estar relacionado à vários endereços, mas cada endereço está relacionado à apenas um usuário.

## Tarefas

### Setup Inicial - 001

- Criação do repositório.
- Instalar dependências inicias.
- Definir banco de dados.
- Criar script do banco de dados.

### Endpoint de cadastro e Login - 002

- **POST** - Criar endpoint para cadastro de usuário.
- **POST** -Criar endpoint para login do usuário.

### Endpoints de navegação do usuário - 003

- **GET** - Endpoint para recuperar os dados do usuário, incluindo seus endereços.
- **PATCH** - Endpoint para atualizar os dados do usuário.
- **PUT** - Endpoint para remover a conta do usuário.

### Endpoints de gerenciamento de endereços - 004

- **POST** - Endpoint para a criação de um endereço.
- **GET** - Endpoint para a busca de endereços. Deve permitir o uso de querystring (ex: GET localhost:3000/user/address?country=BR).
- **GET** - Enpoint para busca de endereço específico. Deve permitir o uso de query params (ex: GET localhost:3000/user/address/123).
- **PATCH** - Endpoint para atualizar um endereço.
- **DELETE** - Endpoint para remoção do endereço.

### Testes - 005

### Swagger API - 006
