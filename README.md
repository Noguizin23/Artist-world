# Artist-world

Aplicativo front-end Vite + React.

## Configurando a conexão com o MongoDB

1. Copie o arquivo `.env.example` para `.env` e preencha a variável `MONGODB_URI` com sua string de conexão do MongoDB.
2. Instale a dependência `mongodb` no projeto (``npm install mongodb``).
3. Utilize o módulo `src/lib/mongodb.js` para iniciar a conexão no backend Node.js.
