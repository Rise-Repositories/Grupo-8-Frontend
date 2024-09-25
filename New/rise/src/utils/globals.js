export function formatDate(dataString) {
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export function formatDateTime(dataString) {
    const data = new Date(dataString);
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const horas = data.getHours();
    const minutos = data.getMinutes();
    const segundos = data.getSeconds();
    return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
}

export function validateText(text) {
    return text.trim() ? true : false;
}

export function validateCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
};

export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export function validatePassword(password) {
    return /[0-9]/.test(password) &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[@#$%&*-+!?~^`_<>()[\]{}/\\]/.test(password) &&
        password.length >= 6
}

export function validateCNPJ(cnpj) {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return regex.test(cnpj);
};

export function validateCEP(cep) {
    const regex = /^\d{5}-\d{3}$/;
    return regex.test(cep);
};
