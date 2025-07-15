const Nivel = require('../models/niveisModel');

exports.getNiveis = async (req, res) => {
    //console.log('Recebido GET /niveis com body:', req.body);
    try {
        const { page = 1, limit = 0 } = req.query;
        const offset = (page - 1) * limit;

        const totalNiveis = await Nivel.count();
        const niveis = await Nivel.findAll(limit, offset);
        
        if (niveis.length === 0) {
            return res.status(404).json({ message: 'Nenhum nível cadastrado' });
        }
       
        //console.log('Níveis encontrados:', niveis);

        res.status(200).json({
            data: niveis,
            total: totalNiveis,
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar níveis' });
    }
}

exports.createNivel = async (req, res) => {
    //console.log('Recebido POST /niveis com body:', req.body);
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'Nome do nível é obrigatório' });
        }

        if (typeof nome != 'string' || nome.trim() === '') {
            // Trim evita nomes que são apenas espaços em branco
            return res.status(400).json({ error: 'Campo nome incorreto' });
        }

        const newNivel = await Nivel.create({ nome });
        res.status(201).json(newNivel);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar nível' });
    }
}

exports.updateNivel = async (req, res) => {

    try {
        const { id } = req.params;
        const { nome } = req.body;

        //console.log('Recebido PUT /niveis com body:', nome, '\ne params:', id);

        if (!nome) {
            return res.status(400).json({ error: 'Nome do nível é obrigatório' });
        }

        const updated = await Nivel.update(
            { id }, { nome }
        );

        if (updated) {
            const updatedNivel = await Nivel.findByPk(id);
            res.status(200).json(updatedNivel);
        } else {
            res.status(404).json({ error: 'Nível não encontrado' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar nível' });
    }
}

exports.deleteNivel = async (req, res) => {
    try {
        const { id } = req.params;
        //console.log('Recebido DELETE /niveis com params:', id);
        const devsAssociados = await Nivel.findOne({ where: { id } });
        //console.log('Devs associados ao nível:', devsAssociados);

        const devs = devsAssociados
                .map(dev => dev.nome)
                .filter(nome => nome);
        //console.log('Devs filtrados:', devs);

        if (devs.length > 0) {
            return res.status(400).json({
                error: 'Não é possível deletar um nível com desenvolvedores associados\nRemova os desenvolvedores desse nível e tente novamente\n',
                devsAssociados: devs
            });
        }

        const deleted = await Nivel.delete(id);

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Nível não encontrado' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar nível' });
    }
}