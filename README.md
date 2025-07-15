# GazinDesafio
Desafio FullStack para o Gazin

Não consegui rodar com o docker. O frontend funcionava corretamente,
mas o backend dava erro ou rodava sem conseguir acessar o banco de dados

Tecnologias utilizadas:
    Node.js – Backend
    Express.js – Framework web para API
    CORS – Para permitir chamadas entre front e back
    SQLite3 – Banco de dados local
    React.js – Interface do usuário
    JavaScript – Linguagem do projeto

Como rodar o projeto
1. Clone o repositório:
    git clone https://github.com/vinicius0000000000/GazinDesafio.git
    cd GazinDesafio

2. Instalar as dependencias:
    cd backend
    npm install

    cd ../frontend
    npm install

3. Rodar o projeto:
    3.a. Iniciar o backend:
        cd backend
        node server.js
    
    3.b. Iniciar o frontend (em outro cmd):
        cd frontend
        npm start

    O servidor roda em http://localhost:3001 e o frontend em http://localhost:3000

