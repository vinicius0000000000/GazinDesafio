import '../table.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div>
            <button className="pagination-button" 
                onClick={() => onPageChange(currentPage => Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}>
                {'<'}
            </button>

            <span> Página {currentPage} </span>

            <button className="pagination-button" 
                onClick={() => onPageChange(currentPage => currentPage + 1)}
                disabled={currentPage >= totalPages}>
                {'>'}
            </button>
        </div>
    )
}

export default Pagination;