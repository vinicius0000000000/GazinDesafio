const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

const port = 3001;
app.use(cors());

// middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// inclui e usa as rotas
const devsRoute = require('./routes/devs');
const niveisRoute = require('./routes/niveis');

app.use('/devs', devsRoute);
app.use('/niveis', niveisRoute);

app.get('/', (req, res) => {
    res.send('API Node ativa');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
