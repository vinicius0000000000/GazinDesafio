import '../App.css';
import '../table.css';
import '../modal.css';
import Pagination from '../components/pagination';
import { DeleteObjectModal } from '../components/delete_object_modal';
import { getSortedList, getUpdatedSortConfig, calc_age, formatDate } from '../components/other_functions';
import SortableHeader from '../components/sortable_header';
import { DeleteButton, EditButton, BackToMenuButton, CreateButton } from '../components/buttons';
import { useState, useEffect } from 'react';


function Devs() {
    const [devs, setDevs] = useState([]);
    const [niveis, setNiveis] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalDevs, setTotalDevs] = useState(0);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalDevs / itemsPerPage);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [devToEdit, setDevToEdit] = useState(null);
    const [sortConfig, setSortConfig] = useState({key: 'nome', direction: 'asc'});

    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch para devs e níveis
    const loadDevs = () => {
        fetch(`${API_URL}/devs?page=${currentPage}&limit=${itemsPerPage}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Erro desconhecido');
                    });
                }
                return response.json()})
            .then(data => {
                setDevs(data.data);
                setTotalDevs(data.total);})
            .catch(error => {
                const errorMsg = 'Erro ao buscar devs:\n' + error;
                alert(errorMsg);
                console.error(errorMsg);
                setDevs([]);
            });
    }

    // Precisa de uma função pra poder atualizar quando a página muda
    // e quando há alguma adição/remoção de devs
    useEffect(() => {
        loadDevs();
    }, [currentPage]);

    useEffect(() => {
        fetch(`${API_URL}/niveis`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || 'Erro desconhecido');
                    });
                }
                return response.json()})
            .then(data => setNiveis(data.data))
            .catch(error => {
                const errorMsg = 'Erro ao buscar níveis:' + error;
                alert(errorMsg);
                console.error(errorMsg)
                setNiveis([]);
            });
    }, []);

    // Função de adição de dev
    const handleAddDev = (newDev) => {
        fetch(`${API_URL}/devs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDev),
        })
        .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || 'Erro desconhecido');
                    });
                }
                return response.json()})
        .then(data => {
            setShowCreateModal(false);

            const newTotal = totalDevs + 1;
            const newPage = Math.ceil(newTotal / itemsPerPage);
            setTotalDevs(newTotal);

            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            } else {
                loadDevs();
            }
        })
        .catch(error => {
            const errorMsg = 'Erro ao criar dev:\n' + error;
            alert(errorMsg);
            console.error(errorMsg);
        });
    }

    // Função de edição de dev
    const handleEditDev = (id, updatedDev) => {
        fetch(`${API_URL}/devs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDev),
        })
        .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || 'Erro desconhecido');
                    });
                }
                return response.json()})
        .then(data => {
            setDevs(devs.map(dev => {
                if (dev.id === id) {
                    const nivel = niveis.find(n => n.id == updatedDev.nivel_id);
                    return { ...dev, ...updatedDev, nivel };
                }
                return dev;
            }));
            setShowEditModal(false);
        })
        .catch(error => {
            const errorMsg = 'Erro ao atualizar dev:\n' + error;
            alert(errorMsg);
            console.error(errorMsg);
        });
    }

    // Função de deleção de dev
    const handleDeleteDev = (id) => {
        fetch(`${API_URL}/devs/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        .then(response => {
            if (response.ok) {
                setShowDeleteModal(false);

                setTotalDevs(totalDevs - 1);
                if (currentPage > 1 && (totalDevs - 1) % itemsPerPage === 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    loadDevs();
                }

            } else {
                const errorMsg = 'Erro ao deletar dev: ' + response.statusText;
                alert(errorMsg);
                console.error(errorMsg);
            }
        })
        .catch(error => {
            const errorMsg = 'Erro ao deletar dev: ' + error;
            alert(errorMsg);
            console.error(errorMsg);
        });
    }

    // Adiciona a idade e nome do nível ao objeto dev
    // Isso torna mais fácil puxar suas informações para a criação e ordenação da tabela
    const devFullInfo = devs.map(dev => ({
        ...dev,
        idade: calc_age(dev.data_nasc) || 0,
        nivel_nome: dev.nivel?.nome || ''
    }));

    // Ordena os devs com base na configuração de ordenação
    const sortedDevs = getSortedList(devFullInfo, sortConfig);

    // Aplica a ordenação
    const requestSort = (key) => { setSortConfig(getUpdatedSortConfig(sortConfig, key)); };
        

    return (
        <div className="App">
        <header className="App-header">
            <br/>

            <table>
                <thead>
                    <tr>
                        {SortableHeader({ label: 'Nome', sortKey: 'nome', sortConfig, requestSort })}
                        {SortableHeader({ label: 'Sexo', sortKey: 'sexo', sortConfig, requestSort })}
                        {SortableHeader({ label: 'Data de Nascimento', sortKey: 'data_nasc', sortConfig, requestSort })}
                        {SortableHeader({ label: 'Idade', sortKey: 'idade', sortConfig, requestSort })}
                        {SortableHeader({ label: 'Hobby', sortKey: 'hobby', sortConfig, requestSort })}
                        {SortableHeader({ label: 'Nível', sortKey: 'nivel_nome', sortConfig, requestSort })}
                    </tr>
                </thead>

                <tbody>
                    {/*Usa a ordenação antes de mapear os devs
                       Algumas colunas tem o conteúdo centralizado por questões estéticas*/}
                    {sortedDevs.map((dev) => (
                        <tr key={dev.id}>
                            <td>{dev.nome}</td>
                            <td className='centered'>{dev.sexo}</td>
                            <td className='centered'>{formatDate(dev.data_nasc)}</td>
                            <td className='centered'>{dev.idade}</td>
                            <td>{dev.hobby}</td>
                            <td>{dev.nivel_nome}</td>
                            
                            {/* Botões de Edição e deleção no final da linha */}
                            <td className='button-cell'>
                                <EditButton onClick={() => {
                                    setDevToEdit(dev);
                                    setShowEditModal(true);
                                }} />
                                {DeleteButton(setShowDeleteModal, setDevToEdit, dev)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>

            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <br/>
            <CreateButton label='Criar Dev' onClick={() => setShowCreateModal(true)} />
            <br/>
            {BackToMenuButton()}

        </header>

        {/* Modal para criação de devs */}
        {showCreateModal && (
            <div className="modal-backdrop">
                <div className="modal">
                    <h2 className="modal-title">Criar Desenvolvedor</h2>
                    <form className="modal-form" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const newDev = {
                            nome: formData.get('nome'),
                            sexo: formData.get('sexo'),
                            data_nasc: formData.get('data_nasc'),
                            hobby: formData.get('hobby'),
                            nivel_id: formData.get('nivel_id')
                        };
                        handleAddDev(newDev);
                    }}>
                        <input type="text" name="nome" placeholder="Nome" required />
                        <select name="sexo" required>
                            <option value="">Selecione o sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                        <input type="date" name="data_nasc" required />
                        <input type="text" name="hobby" placeholder="Hobby" required />
                        <select name="nivel_id" required>
                            {niveis?.map(nivel => (
                                <option key={nivel.id} value={nivel.id}>{nivel.nome}</option>
                            ))}
                        </select>
                        <div className='modal-buttons'>
                            <button className='button green' type="submit">Salvar</button>
                            <button className='button red' onClick={() => setShowCreateModal(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Modal para edição de devs */}
        {showEditModal && (
            <div className="modal-backdrop">
                <div className="modal">
                    <h2 className='modal-title'>Editar Desenvolvedor</h2>
                    <form className="modal-form" onSubmit={(e) => {
                        e.preventDefault();
                        const updatedDev = {
                            nome: e.target.nome.value,
                            sexo: e.target.sexo.value,
                            data_nasc: e.target.data_nasc.value,
                            hobby: e.target.hobby.value,
                            nivel_id: e.target.nivel_id.value
                        };
                        handleEditDev(devToEdit.id, updatedDev);
                    }}>
                        <input type="text" name="nome" defaultValue={devToEdit.nome} required />
                        <select name="sexo" defaultValue={devToEdit.sexo} required>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                        <input type="date" name="data_nasc" defaultValue={devToEdit.data_nasc} required />
                        <input type="text" name="hobby" defaultValue={devToEdit.hobby} required />
                        <select name="nivel_id" defaultValue={devToEdit?.nivel.id} required>
                            {niveis?.map(nivel => (
                                <option key={nivel.id} value={nivel.id}>{nivel.nome}</option>
                            ))}
                        </select>
                        <div className='modal-buttons'>
                            <button className='button green' type="submit">Salvar</button>
                            <button className='button red' onClick={() => setShowEditModal(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Modal para confirmação da deleção de devs */}
        <DeleteObjectModal
            label="Desenvolvedor"
            isOpen={showDeleteModal}
            object={devToEdit}
            onDelete={handleDeleteDev}
            onCancel={() => setShowDeleteModal(false)}
        />
            

        </div>
    );
}

export default Devs;