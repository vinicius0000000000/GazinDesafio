import '../App.css';
import '../table.css';
import Pagination from '../components/pagination';
import { DeleteObjectModal } from '../components/delete_object_modal';
import { getSortedList, getUpdatedSortConfig} from '../components/other_functions';
import SortableHeader from '../components/sortable_header';
import { DeleteButton, EditButton, BackToMenuButton, CreateButton } from '../components/buttons';
import { useState, useEffect } from 'react';

function Niveis() {
    const [niveis, setNiveis] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalNiveis, setTotalNiveis] = useState(0);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalNiveis / itemsPerPage);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [nivelToEdit, setNivelToEdit] = useState(null);
    const [newNivel, setNewNivel] = useState('');

    const [sortConfig, setSortConfig] = useState({key: 'nome', direction: 'asc'});

    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch dos níveis
    const loadNiveis = () => {
        fetch(`${API_URL}/niveis?page=${currentPage}&limit=${itemsPerPage}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Erro desconhecido');
                    });
                }
                return response.json()})
            .then(data => {
                console.log('Dados recebidos:', data);
                setNiveis(data.data);
                setTotalNiveis(data.total);})
            .catch(error => {
                const errorMsg = 'Erro ao buscar niveis:\n' + error;
                alert(errorMsg);
                console.error(errorMsg);
                setNiveis([]);
            });
    }

    useEffect(() => {
        loadNiveis();
    }, [currentPage]);

    // Função para a adição de níveis
    const handleAddNivel = () => {
        fetch(`${API_URL}/niveis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: newNivel }),
        })
        .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || 'Erro desconhecido');
                    });
                }
                return response.json()})
        .then(data => {
            const nivel1 = { ...data, qtdDevs: 0 };
            setNiveis([...niveis, nivel1]);
            setNewNivel('');
            setShowCreateModal(false);

            const newTotal = totalNiveis + 1;
            const newPage = Math.ceil(newTotal / itemsPerPage);
            setTotalNiveis(newTotal);

            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            } else {
                loadNiveis();
            }

        })
        .catch(error => {
            const errorMsg = 'Erro ao criar nivel:\n' + error;
            alert(errorMsg);
            console.error(errorMsg);
        });
    }

    // Função para a edição de níveis
    const handleEditNivel = (id) => {
        fetch(`${API_URL}/niveis/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: newNivel }),
        })
        .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || 'Erro desconhecido');
                    });
                }
                return response.json()})
        .then(data => {
            setNiveis(niveis.map(nivel => 
                nivel.id === id ? { ...nivel, nome: newNivel } : nivel
            ));
            setNewNivel('');
            setShowEditModal(false);
        })
        .catch(error => {
            const errorMsg = 'Erro ao atualizar nivel:\n' + error;
            alert(errorMsg);
            console.error(errorMsg);
        });
    }

    // Função para a deleção de níveis
    const handleDeleteNivel = (id) => {
        fetch(`${API_URL}/niveis/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        .then(async(response) => {
            if (response.ok) {
                setNiveis(niveis.filter(nivel => nivel.id !== id));
                setShowDeleteModal(false);

                setTotalNiveis(totalNiveis - 1);
                if (currentPage > 1 && (totalNiveis - 1) % itemsPerPage === 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    loadNiveis();
                }
            } else {
                const errorData = await response.json();
                console.error('Error deleting nivel:', errorData);
                alert(`Erro ao deletar nível:\n` +
                `${errorData.error}\n` +
                `Dev associados: ${errorData.devsAssociados?.join(', ') || 'Nenhum'}`);
            }
        })
        .catch(error => {
            const errorMsg = 'Erro ao deletar nivel: ' + error;
            alert(errorMsg);
            console.error(errorMsg);
        });
    }

    // Ordena os níveis com base na configuração de ordenação
    const sortedNiveis = getSortedList(niveis, sortConfig);

    // Aplica a ordenação
    const requestSort = (key) => { setSortConfig(getUpdatedSortConfig(sortConfig, key)); };
    
    
    return (
        <div className="App">
        <header className="App-header">
            <table>
                <thead>
                    <tr>
                        {SortableHeader({ label: 'Nível', sortKey: 'nome', sortConfig, requestSort })}
                        {SortableHeader({ label: 'Quantidade de Devs', sortKey: 'qtdDevs', sortConfig, requestSort })}
                    </tr>
                </thead>

                <tbody>
                    {sortedNiveis.map((nivel) => (
                        <tr key={nivel.id}>
                            <td>{nivel.nome}</td>
                            <td>{nivel.qtdDevs}</td>

                            {/* Botões de Edição e deleção no final da linha */}
                            <td className='button-cell'>
                                <EditButton onClick={() => {
                                    setNivelToEdit(nivel);
                                    setNewNivel(nivel.nome);
                                    setShowEditModal(true);
                                }} />
                                {DeleteButton(setShowDeleteModal, setNivelToEdit, nivel)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <br/>
            <CreateButton label='Criar Nível' onClick={() => setShowCreateModal(true)} />
            <br/>
            {BackToMenuButton()}

        </header>

        {/* Modal para criação de níveis */}
        {showCreateModal && (
            <div className="modal-backdrop">
                <div className="modal">
                    <h2 className="modal-title">Criar Nível</h2>
                    <form className='modal-form'>
                        <input
                            type="text"
                            value={newNivel}
                            onChange={(e) => setNewNivel(e.target.value)}
                            placeholder="Digite o Nome do Nível"
                        />
                        <div className='modal-buttons'>
                            <button className='button green' onClick={handleAddNivel}>Salvar</button>
                            <button className='button red' onClick={() => setShowCreateModal(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Modal para edição de níveis */}
        {showEditModal && (
            <div className="modal-backdrop">
                <div className="modal">
                    <h2 className="modal-title">Editar Nível</h2>
                    <form className='modal-form'>
                        <input
                            type="text"
                            value={newNivel}
                            onChange={(e) => setNewNivel(e.target.value)}
                            placeholder="Digite o Novo Nome do Nível"
                        />
                        <div className='modal-buttons'>
                            <button className='button green' onClick={() => handleEditNivel(nivelToEdit.id)}>Salvar</button>
                            <button className='button red' onClick={() => setShowEditModal(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Modal para confirmação da deleção de níveis */}
        <DeleteObjectModal
            label="Nível"
            isOpen={showDeleteModal}
            object={nivelToEdit}
            onDelete={handleDeleteNivel}
            onCancel={() => setShowDeleteModal(false)}
        />

        </div>
    );
}

export default Niveis;