// Ordena uma lista com base na configuração de ordenação
export const getSortedList = (list, sortConfig) => {
    return [...list].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    })
};

// Atualiza a configuração de ordenação
export const getUpdatedSortConfig = (currentConfig, key) => {
    let direction = 'asc';
    if (currentConfig.key === key && currentConfig.direction === 'asc') {
        direction = 'desc';
    }
    return { key, direction };
};

// Calcula a idade com base na data de nascimento
export function calc_age(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--; 
    }
    return age;
}

// Formata a data para DD/MM/YYYY
export function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}