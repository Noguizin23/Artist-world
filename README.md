# Artist-world

Aplicativo front-end Vite + React.

## Configurando a conexão com o MongoDB

1. Copie o arquivo `.env.example` para `.env` e preencha a variável `MONGODB_URI` com sua string de conexão do MongoDB.
2. Instale as dependências do backend executando `npm install`.
3. Utilize o módulo `src/lib/mongodb.js` para iniciar a conexão no backend Node.js.

## Rodando o projeto localmente

1. Inicie o servidor backend que utiliza o MongoDB:

   ```bash
   npm run server
   ```

2. Em outra aba do terminal, inicie o front-end:

   ```bash
   npm run dev
   ```
