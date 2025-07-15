const Dev = require('../models/devsModel');

function calc_age(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--; 
    }
    return age;
}

function verifyTypes(nome, sexo, data_nasc, hobby, nivel_id) {
    let msg = '';
    if (typeof nome != 'string' || nome.trim() === '') {
        // Trim evita nomes que são apenas espaços em branco
        msg = 'Campo nome incorreto';
    } else if (typeof sexo != 'string' || !['M', 'F'].includes(sexo)) {
        msg = 'Campo sexo incorreto';
    } else if (typeof data_nasc !== 'string' || isNaN(Date.parse(data_nasc))) {
        msg = 'Campo data de nascimento incorreto';
    } else if (typeof hobby !== 'string' || hobby.trim() === '') {
        msg = 'Campo hobby incorreto';
    } else if (typeof nivel_id !== 'string' || Number(nivel_id) <= 0 || isNaN(Number(nivel_id))) {
        msg = 'campo nível incorreto';
    }

    return msg;
}

exports.getDevs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const totalDevs = await Dev.count();
        const devs = await Dev.findAll(limit, offset);
        
        if (devs.length === 0) {
            return res.status(404).json({ message: 'Nenhum desenvolvedor cadastrado' });
        }

        res.status(200).json({
            data: devs,
            total: totalDevs
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar desenvolvedores' });
    }
}

exports.createDev = async (req, res) => {
    try {
        const { nome, sexo, data_nasc, hobby, nivel_id } = req.body;
        //console.log('Dados recebidos:', nome, sexo, data_nasc, hobby, nivel_id);

        if (!nome || !sexo || !data_nasc || !hobby || !nivel_id) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando ou inválidos' });
        }

        const verifyType = verifyTypes(nome, sexo, data_nasc, hobby, nivel_id)
        if (verifyType != '') {
            return res.status(400).json({ error: verifyType });
        }

        if (calc_age(data_nasc) < 0) {
            return res.status(400).json({ error: 'A idade não pode ser negativa' });
        }

        const newDev = await Dev.create({ nome, sexo, data_nasc, hobby, nivel_id });
        res.status(201).json(newDev);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar desenvolvedor' });
    }
}

exports.updateDev = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, sexo, data_nasc, hobby, nivel_id } = req.body;
        //console.log('Atualizando desenvolvedor ID:', id, 'com dados:', nome, sexo, data_nasc, hobby, nivel_id);

        if (!nome || !sexo || !data_nasc || !hobby || !nivel_id) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando ou inválidos' });
        }

        const verifyType = verifyTypes(nome, sexo, data_nasc, hobby, nivel_id)
        if (verifyType != '') {
            return res.status(400).json({ error: verifyType });
        }

        if (calc_age(data_nasc) < 0) {
            return res.status(400).json({ error: 'A idade não pode ser negativa' });
        }

        const updated = await Dev.update(
            { id },
            { nome, sexo, data_nasc, hobby, nivel_id }
        );

        if (updated) {
            const updatedDev = await Dev.findByPk(id);
            res.status(200).json(updatedDev);
        } else {
            res.status(404).json({ error: 'Desenvolvedor não encontrado' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar desenvolvedor' });
    }
}

exports.deleteDev = async (req, res) => {
    try {
        const { id } = req.params;
        //console.log('Deletando desenvolvedor ID:', id);

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const deleted = await Dev.destroy({ id });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Desenvolvedor não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar desenvolvedor' });
    }
}
