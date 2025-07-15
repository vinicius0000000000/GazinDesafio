import '../table.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';

export function DeleteButton(setShowDeleteModal, setObjectToEdit, object) {
    return (
        <button className="table-button red" onClick={() => {
            setObjectToEdit(object);
            setShowDeleteModal(true); }}
            >Deletar</button>
    );
}

export function EditButton({ onClick }) {
    return (
        <button className="table-button" onClick={onClick}>
            Editar
        </button>
    );
}

export function CreateButton({ label, onClick }) {
    return (
        <button className="App-button" onClick={onClick}>
            {label}
        </button>
    );
}

export const BackToMenuButton = () => {
    const navigate = useNavigate();

    return (
        <button className="App-button" onClick={() => navigate('/')}>Voltar</button>
    )
}

