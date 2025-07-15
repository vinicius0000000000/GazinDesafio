const db = require('../db');

exports.findAll = async (limit, offset) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT niveis.id, niveis.nome, COUNT(devs.id) as qtdDevs
                        FROM niveis
                        LEFT JOIN devs ON devs.nivel_id = niveis.id
                        GROUP BY niveis.id, niveis.nome`;

        const params = []

        if (limit !== undefined && parseInt(limit) > 0) {
            query = `SELECT * FROM (${query}) AS subquery LIMIT ? OFFSET ?`;
            params.push(limit, offset || 0);
        }

        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('Erro na consulta:', err);
                return reject(err);
            }

            const resultado = rows.map(row => ({
                id: row.id,
                nome: row.nome,
                qtdDevs: row.qtdDevs || 0
            }));

            //console.log('Resultado da consulta:', resultado);

            resolve(resultado);
        });
    });
};

exports.count = async () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS total FROM niveis';
        
        db.get(query, [], (err, row) => {
            if (err) {
                console.error('Erro ao contar níveis:', err);
                return reject(err);
            }
            resolve(row.total);
        });
    });
};

exports.create = async (nivel) => {
    return new Promise((resolve, reject) => {
        const query = {
            text: 'INSERT INTO niveis (nome) VALUES ($1) RETURNING *',
            values: [nivel.nome]
        };

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na inserção:', err);
                return reject(err);
            }

            if (rows.length === 0) {
                return reject(new Error('Nenhum nível criado'));
            }

            resolve(rows[0]);
        });
    });
}

exports.update = async (id, nivel) => {
    return new Promise((resolve, reject) => {
        //console.log('Atualizando nível:', nivel, 'com ID:', id.id);
        const query = {
            text: 'UPDATE niveis SET nome = $1 WHERE id = $2 RETURNING *',
            values: [nivel.nome, id.id]
        };
        // Precisa usar id.id por causa do formato com que o objeto é passado do frontend
        // caso contrário, ficaria undefined
        // Formato atual do const id: { id: 1 }

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na atualização:', err);
                return reject(err);
            }
            if (rows.length === 0) {
                return reject(new Error('Nível não encontrado'));
            }
            resolve(rows[0]);
        });
    });
}

exports.delete = async (id) => {
    //console.log('Deletando nível com ID:', id);
    return new Promise((resolve, reject) => {
        const query = {
            text: 'DELETE FROM niveis WHERE id = $1 RETURNING *',
            values: [id]
        };

        db.all(query.text, query.values, (err, rows) => {
            if (err) {  
                console.error('Erro na deleção:', err);
                return reject(err);
            }
            if (rows.length === 0) {
                return reject(new Error('Nível não encontrado'));
            }
            resolve(rows[0]);
        });
    });
}

exports.findByPk = async (id) => {
    return new Promise((resolve, reject) => {
        const query = {
            text: 'SELECT * FROM niveis WHERE id = $1',
            values: [id],
            rowMode: 'object'
        };

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na busca por ID:', err);
                return reject(err);
            }
            if (rows.length === 0) {
                return reject(new Error('Nível não encontrado'));
            }
            resolve(rows[0]);
        });
    });
}

exports.findOne = async (options = {}) => {
    return new Promise((resolve, reject) => {
        const { where } = options;
        //console.log('Buscando nível com opções:', where);
        const query = {
            text: 'SELECT d.nome FROM niveis n LEFT JOIN devs d ON d.nivel_id = n.id WHERE n.id = $1',
            values: [where.id],
            rowMode: 'object'
        };

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na busca:', err);
                return reject(err);
            }
            resolve(rows);
        });
    });
}
