// importando express
const express = require("express");
// cria aplicação
const app = express();
app.use(express.json());
const porta = 3000;

function validacao({nome, idade, cpf, cep, uf, rua, numero}) {
    
    
    if (!nome || !idade || !cpf || !cep || !uf || !rua || !numero) {
        return false; 
    }
    if (cep.length !== 8 || cpf.length !== 11 || uf.length !== 2) {
        return false; 
    }
    
    
    return true;
}

const alunos = [
    {
        id: 1,
        nome: "Maria Silva",
        idade: 18,
        cpf: "12345678901",
        cep: "01234567",
        uf: "SP",
        rua: "Av. Central",
        numero: 123,
        complemento: "Apto 12"
    }

]

app.get("/alunos",(req,res) =>{
    res.json(alunos)
})

// http://localhost:3000/alunos/2
app.get("/alunos/:id",(req,res) =>{
    const id = parseInt(req.params.id)
    // const aluno = alunos.filter( (aluno => aluno.id === id))
    const aluno = alunos.find( (aluno => aluno.id === id))    
    // console.log( `Caiu aqui ${id} `)
    // console.log(aluno)
    if(aluno){
        res.json(aluno)
    }else{
        res.status(404).json(
            {erro: "Aluno não encontrado"}
        )
    }
   
})

app.post("/alunos", (req, res) => {
    const {nome, idade, cpf, cep, uf, rua, numero, complemento} = req.body;


    const cpfExiste = alunos.find(alunos => alunos.cpf === cpf);
    if(cpfExiste){
        return res.status(409).json({
            erro:"CPF já existe"
        })
    }
    
    if(!validacao({nome, idade, cpf, cep, uf, rua, numero})){
        return res.status(400).json({
            erro: "Preencha os campos vazio"
        })
    }  
    
    const id = alunos.length > 0 ? alunos[alunos.length - 1].id + 1 : 1   

    const novoAluno = {id,nome, idade, cpf, cep, uf, rua, numero, complemento}
    console.log(novoAluno)

    alunos.push(novoAluno)

    res.status(201).json({
        mensagem: "Aluno Cadastrado com sucesso",
        aluno: novoAluno
    })
   
})

app.put("/alunos/:id", (req, res)=>{
    const id = parseInt(req.params.id)
    const {nome, idade, cpf, cep, uf, rua, numero, complemento} = req.body;

    if(!validacao({nome, idade, cpf, cep, uf, rua, numero})){
        return res.status(400).json({
            erro: "Preencha os campos obrigatorio"
        })
    }  
    // filter  traz todos
    // find traz apenas o primeiro encontrado
    const aluno = alunos.find(aluno => aluno.id === id)

     if(cpfExiste){
        return res.status(409).json({
            erro:"CPF já existe"
        })
    }
    
    if(!aluno){
         return res.status(400).json({
            erro: "Aluno não encontrado"
        })
    }

    console.log(aluno)
    console.log("Aluno nome", aluno.nome)
    console.log("Aluno idade", aluno.idade)

    aluno.nome = nome;
    aluno.idade = idade;
    aluno.cpf = cpf;
    aluno.cep = cep;
    aluno.uf = uf;
    aluno.rua = rua;
    aluno.numero = numero;
    aluno.complemento = complemento;

    res.json({
        mensagem: "Aluno Atualizado com sucesso"
    })

    // console.log("Estamos atualizando o id:" + id )
    // console.log(`Nome ${nome} idade: ${idade}`)
})

app.get("/", (req,res) => {
    res.send("Olá mundo");
})


app.get("/nome", (req,res) => {
    res.json({
        messagem: "Olá mundo!",
        autor: "Vitor",
        data: new Date().toDateString()
    });
})

function validarCPF(cpf) {
   
    if(cpf.length !== 11 ){
        return false
    }

    let soma = 0;

    for( let i = 0; i < 9 ; i++){
        soma += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let resto = (soma * 10) % 11;
    if(resto === 10 || resto === 11) resto = 0

    if( resto !== parseInt(cpf.charAt(9))) return false

    soma = 0;

    for( let i = 0; i < 10 ; i++){
        soma += parseInt(cpf.charAt(i)) * (11 - i)
        // console.log(parseInt(cpf.charAt(i)) , (11 - i))
    }
   
    resto = (soma * 10) % 11;
    if(resto === 10 || resto === 11) resto = 0
    if( resto !== parseInt(cpf.charAt(10))) return false

    return true

}

const calcularIdade = function(dataNasc){
    const hoje = new Date();
    // console.log(hoje)
    const nascimento = new Date(dataNasc);
    // console.log(nascimento.getUTCFullYear())

    let idade = hoje.getFullYear() - nascimento.getFullYear();
   
    const mes = hoje.getMonth() - nascimento.getMonth();

    if(mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())){
        idade--
    }
    return idade

}

app.post("/validacfp", (req, res) =>{
    const {cpf, dataNascimento} =req.body
    console.log(cpf, dataNascimento)
    if(!cpf || !dataNascimento){
         return res.status(400).json({
            erro: "CPF e data de nascimento são obrigatórios"
        })
    }
    validarCPF(cpf) // true
    calcularIdade(dataNascimento) // 7


    let mensagemCPF =   validarCPF(cpf) === true ? "Válido" : "Inválido"
    let mensagemIdade =  calcularIdade(dataNascimento)
    console.log(cpf, dataNascimento, mensagemCPF)
    res.status(200).json({
        cpf: "CPF " + mensagemCPF,
        idade: "A idade é :"+ mensagemIdade
    })

})

app.delete("/alunos/:id", (req, res)=>{
    const id = parseInt(req.params.id);

    const indice = alunos.findIndex(a => a.id === id)

    if( indice === -1){
        return res.status(404).json({
            mensagem :"Aluno não encontrado"
        })
    }
    console.log(indice)

    alunos.splice(indice,1);

    res.status(204).json({
        mensagem: "Aluno deletado com sucesso!"
    })
   
})




app.listen(porta, () => console.log( `Servidor rodando http://localhost:${porta}/`));