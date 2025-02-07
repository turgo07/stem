function validarCPF() {
    const cpf = document.getElementById("cpf").value.replace(/\D/g, ""); // Remove tudo que não for número
    const cpfErro = document.getElementById("cpfErro");

    if (cpf.length !== 11 || !validarDigitoCPF(cpf)) {
        cpfErro.textContent = "CPF inválido";
        cpfErro.style.color = "red";
        return false;
    } else {
        cpfErro.textContent = "";
        return true;
    }
}

function validarDigitoCPF(cpf) {
    let soma = 0, resto;
    if (cpf === "00000000000") return false;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function validarDataNascimento() {
    const data = new Date(document.getElementById("dataNascimento").value);
    const hoje = new Date();
    const dataErro = document.getElementById("dataErro");

    if (isNaN(data) || data > hoje || hoje.getFullYear() - data.getFullYear() < 18) {
        dataErro.textContent = "Data de nascimento inválida (mínimo 18 anos)";
        dataErro.style.color = "red";
        return false;
    } else {
        dataErro.textContent = "";
        return true;
    }
}

function validarSenha() {
    const senha = document.getElementById("senha").value;
    const botaoEntrar = document.getElementById("botaoEntrar");
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const dataNascimento = document.getElementById("dataNascimento").value.replace(/-/g, "");

    const checklist = {
        min8: senha.length >= 8,
        maiuscula: /[A-Z]/.test(senha),
        minuscula: /[a-z]/.test(senha),
        numero: /\d/.test(senha),
        especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
        max20: senha.length <= 20,
        espacos: !/\s/.test(senha),
        repeticoes: !/(.)\1{2,}/.test(senha),  
        sequencias: !/(123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(senha),
        cpfNaSenha: cpf ? !senha.includes(cpf) : true,
        dataNaSenha: dataNascimento ? !senha.includes(dataNascimento) : true
    };

    let senhaValida = true;
    Object.keys(checklist).forEach(id => {
        const valido = checklist[id];
        document.getElementById(id).innerHTML = (valido ? "✅" : "❌") + " " + document.getElementById(id).textContent.slice(2);
        document.getElementById(id).style.color = valido ? "green" : "red";

        if (!valido) senhaValida = false;
    });

    botaoEntrar.disabled = !(senhaValida && validarCPF() && validarDataNascimento());
}

async function login() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const cpf = document.getElementById("cpf").value;
    const dataNascimento = document.getElementById("dataNascimento").value;

    const resposta = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, cpf, dataNascimento, senha })
    });

    const dados = await resposta.json();

    if (resposta.status === 200) {
        window.location.href = "sucesso.html";  
    } else {
        document.getElementById("mensagem").textContent = dados.erro;
    }
}