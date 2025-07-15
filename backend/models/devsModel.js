const db = require('../db');

exports.findAll = async (limit, offset) => {
    return new Promise((resolve, reject) => {
        const query = {
            text: `SELECT
                    devs.id AS dev_id,
                    devs.nome,
                    devs.sexo,
                    devs.data_nasc,
                    devs.hobby,
                    niveis.id AS nivel_id,
                    niveis.nome AS nivel_nome
                  FROM devs
                  JOIN niveis ON devs.nivel_id = niveis.id
                  LIMIT $1 OFFSET $2`,
            rowMode: 'object'
        };

        db.all(query.text, [limit, offset], (err, rows) => {
            if (err) {
                console.error('Erro na busca de desenvolvedores:', err);
                return reject(err);
            }

            const devs = rows.map(row => ({
                id: row.dev_id,
                nome: row.nome,
                sexo: row.sexo,
                data_nasc: row.data_nasc,
                hobby: row.hobby,
                nivel: {
                    id: row.nivel_id,
                    nome: row.nivel_nome
                }
            }));
            resolve(devs);
        });
    });
}

exports.count = async () => {
    return new Promise((resolve, reject) => {
        const query = {
            text: 'SELECT COUNT(*) AS total FROM devs',
            rowMode: 'object'
        };

        db.get(query.text, [], (err, row) => {
            if (err) {
                console.error('Erro ao contar desenvolvedores:', err);
                return reject(err);
            }
            resolve(row.total);
        });
    });
};

exports.create = async (dev) => {
    return new Promise((resolve, reject) => {
        const query = {
            text: 'INSERT INTO devs (nome, sexo, data_nasc, hobby, nivel_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [dev.nome, dev.sexo, dev.data_nasc, dev.hobby, dev.nivel_id]
        };

        //console.log('Query:', query);

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na inserção:', err);
                return reject(err);
            }
            if (rows.length === 0) {
                return reject(new Error('Nenhum desenvolvedor criado'));
            }
            resolve(rows[0]);
        });
    });
}

exports.update = async (id, dev) => {
    return new Promise((resolve, reject) => {
        const query = {
            text: 'UPDATE devs SET nome = $1, sexo = $2, data_nasc = $3, hobby = $4, nivel_id = $5 WHERE id = $6 RETURNING *',
            values: [dev.nome, dev.sexo, dev.data_nasc, dev.hobby, dev.nivel_id, id.id]
        };
        // Precisa usar id.id por causa do formato com que o objeto é passado do frontend
        // caso contrário, ficaria undefined
        // Formato atual do const id: { id: 1 }

        //console.log('Query', query);

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na atualização:', err);
                return reject(err);
            }
            if (rows.length === 0) {
                return reject(new Error('Desenvolvedor não encontrado'));
            }
            resolve(rows[0]);
        });
    });
}

exports.destroy = async (id) => {
    return new Promise((resolve, reject) => {
        const query = {
            text: 'DELETE FROM devs WHERE id = $1 RETURNING *',
            values: [id.id]
        };
        //console.log('Query:', query);

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na deleção:', err);
                return reject(err);
            }
            if (rows.length === 0) {
                return reject(new Error('Desenvolvedor não encontrado'));
            }
            resolve(rows[0]);
        });
    });
}

exports.findByPk = async (id) => {
    return new Promise((resolve, reject) => {
        const query = {
            text: 'SELECT * FROM devs WHERE id = $1',
            values: [id],
            rowMode: 'object'
        };

        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                console.error('Erro na busca por ID:', err);
                return reject(err);
            }
            if (rows.length === 0) {
                return reject(new Error('Desenvolvedor não encontrado'));
            }
            resolve(rows[0]);
        });
    });
}
