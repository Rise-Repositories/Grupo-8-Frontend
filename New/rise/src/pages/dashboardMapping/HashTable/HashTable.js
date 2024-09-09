class HashTable {
    constructor(size = 100) { // Define o tamanho da tabela hash para uma melhor distribuição
        this.size = size;
        this.table = new Array(size);
    }

    // Adiciona um mapeamento à tabela hash
    addMapping(mapping) {
        const { address, lastServed } = mapping;
        const priority = this.calculatePriority(lastServed);
        const key = this.hash(priority);

        if (!this.table[key]) {
            this.table[key] = [];
        }
        this.table[key].push(mapping);
    }

    // Calcula a prioridade com base no tempo desde o último atendimento
    calculatePriority(lastServed) {
        if (!lastServed) return Number.MAX_VALUE; // Nunca atendido tem a maior prioridade
        const lastServedDate = new Date(lastServed);
        const currentDate = new Date();
        const diffTime = currentDate - lastServedDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferença em dias
    }

    // Função de hash com normalização da prioridade
    hash(priority) {
        // Normaliza a prioridade para um índice na tabela hash
        return Math.floor(priority % this.size);
    }

    // Obtém mapeamentos não atendidos
    getUnattendedMappings() {
        const unattended = [];
        for (const bucket of this.table) {
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
    getMappingsByPriority() {
        const prioritized = [];
        for (const bucket of this.table) {
            if (bucket) {
                prioritized.push(...bucket);
            }
        }
        // Ordena por prioridade, mais antigo primeiro
        prioritized.sort((a, b) => {
            const priorityA = this.calculatePriority(a.lastServed);
            const priorityB = this.calculatePriority(b.lastServed);
            return priorityB - priorityA; // Maior prioridade (mais tempo sem atendimento) vem primeiro
        });
        return prioritized;
    }
}

export default HashTable;
