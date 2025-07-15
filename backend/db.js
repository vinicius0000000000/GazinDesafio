const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do db
const dbPath = path.resolve(__dirname, 'database.db');

// conecta/cria o db
const db = new sqlite3.Database(dbPath, (e) => {
    if (e) {
        console.error('Erro de conexao: ', e);
    } else {
        console.log('Conectado ao banco de dados');
        createStartingTable();
    }
})

function createStartingTable() {
    db.run('Pragma foreign_keys = ON');

    db.run(`create table if not exists niveis (
                id integer primary key autoincrement,
                nome text not null
        )`);

    db.run(`create table if not exists devs (
                id integer primary key autoincrement,
                nivel_id integer not null,
                nome text not null,
                sexo text not null,
                data_nasc date not null,
                hobby text not null,
                foreign key (nivel_id) references niveis(id)
        )`);
}

module.exports = db;
