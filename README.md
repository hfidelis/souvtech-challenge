# Desafio Software Engineer | SOUV

## Tecnologias Utilizadas

### Backend:
- Nest.js
- Prisma
- class-validator e class-transformer
- JWT
- Swagger (OpenAPI)
- PostgreSQL

### Frontend:
- Next.js
- TypeScript
- React Query
- Axios
- React Hook Form
- Tailwind CSS
- Lucide Icons
- Shadcn UI
- zustand
- zod

### Funcionalidades
- Autenticação via JWT
- Registro e Login de Usuários
- Proteção de rotas no backend e frontend
- CRUD de itens
- Paginação de itens
- Associação de itens a usuários
- Endpoints para marcar como pago/devolver um item
- Validações de dados no backend e frontend
- Documentação da API via Swagger (OpenAPI)
- Seed inicial do banco de dados com um usuário default e categorias de item
- Tratamento de erros e mensagens amigáveis no frontend

### Como executar o projeto
1. Clone o repositório:
   ```bash
   git clone https://github.com/hfidelis/souvtech-challenge
   cd souvtech-challenge
    ```

2. As variáveis de ambiente estão definidas e comitadas apenas por questões de praticidade para o teste e avaliação. No diretório raíz temos uma arquivo `.env` com as variáveis do banco de dados e no diretório do backend temos um arquivo `.env` com as variáveis JWT, string do banco e dados do super usuário.

```bash
# .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=souv_shopping_list
POSTGRES_PORT=5432

# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/souv_shopping_list?schema=public"
JWT_SECRET="0f7ddfb27f1b08a28ebf58a25cfe3f3a"
JWT_EXPIRES_IN="3600s"
PORT=3000
DEFAULT_USER="user@souv.tech"
DEFAULT_PASSWORD="souvtech"
```

3. Inicie o banco de dados utilizando docker-compose:
    ```bash
    docker-compose up -d
    ```

4. Inicialize o backend (Dependências, migrações, seed e start):
    ```bash
    cd backend

    npm install

    npx prisma migrate deploy

    npx prisma db seed

    npm run start:dev
    ```

**Agora o backend estará rodando em** `http://localhost:3000` **e a documentação da API via Swagger (OpenAPI) estará disponível em** `http://localhost:3000/api/docs`.

**O usuário default inicial é:**
- Email: `user@souv.tech`
- Senha: `souvtech`

5. Inicialize o frontend (Dependências e start):
    ```bash
    cd ../frontend

    npm install

    npm run dev
    ```

**Agora o frontend estará rodando em** `http://localhost:3001`.

### Vídeo demonstrativo:

> https://drive.google.com/file/d/1VxGoIAXrsU6up9v3Mvwn63vh02Ipzll4/view?usp=sharing

### Screenshots:

![1](./docs/1.png)

![2](./docs/2.png)

![3](./docs/3.png)
