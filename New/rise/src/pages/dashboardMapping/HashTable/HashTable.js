class HashTable {

    constructor() {
        this.table = new Object();
    }

    // Adiciona um mapeamento à tabela hash
    addMapping(mapping) {
        const { address, lastServed } = mapping;
        const key = this.hash(lastServed);

        if (!this.table[key]) {
            this.table[key] = [];
        }
        this.table[key].push(mapping);
    }

    // Calcula a prioridade com base no tempo desde o último atendimento
    hash(lastServed) {
        if (!lastServed) return Number.MAX_VALUE; // Nunca atendido tem a maior prioridade
        const lastServedDate = new Date(lastServed);
        const currentDate = new Date();
        const diffTime = currentDate - lastServedDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferença em dias
    }

    // Obtém mapeamentos não atendidos
    getUnattendedMappings() {
        const unattended = [];
        for (const [key, bucket] of Object.entries(this.table)) {
            if (bucket) {
                bucket.forEach(item => {
                    if (!item.lastServed) {
                        unattended.push(item);
                    }
                });
            }
        }
        return unattended;
    }

    // Obtém mapeamentos ordenados por prioridade
    getMappingsByPriority(dataFiltro = new Date()) {

        const hashFiltro = this.hash(dataFiltro);

        const prioritized = [];
        for (const [key, bucket] of Object.entries(this.table)) {
            if (bucket && key >= hashFiltro) {
                prioritized.push(...bucket);
            }
        }
        // Ordena por prioridade, mais antigo primeiro
        prioritized.sort((a, b) => {
            const priorityA = this.hash(a.lastServed);
            const priorityB = this.hash(b.lastServed);
            return priorityB - priorityA; // Maior prioridade (mais tempo sem atendimento) vem primeiro
        });
        return prioritized;
    }
}

export default HashTable;
