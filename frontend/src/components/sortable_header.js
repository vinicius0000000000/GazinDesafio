import '../table.css';

function SortableHeader({ label, sortKey, sortConfig, requestSort }) {
    return(
        <th className='centered'>
            <button className="button" onClick={() => requestSort(sortKey)}>
                {label}
                <span className="arrow">
                    {sortConfig.key === sortKey
                    ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                    : <span className="invisible">▲</span>}
                </span>
            </button>
        </th>
    )
}

export default SortableHeader;