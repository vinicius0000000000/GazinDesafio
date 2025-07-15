export function DeleteObjectModal({ label, isOpen, object, onDelete, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2 className='modal-title'>Deletar {label}</h2>
                <p className='modal-msg'>Você tem certeza que deseja deletar o {label} {object.nome}?</p>
                <div className='modal-buttons'>
                    <button className='button red' onClick={() => onDelete(object.id)}>Deletar</button>
                    <button className='button gray' onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}