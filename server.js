import express from 'express';
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Array em memória para armazenar os dados (simulando um banco de dados)
let items = [];
let alunos = [
    { cod: 1, name: "Ermeson", media: 7.0 },
    { cod: 2, name: "Julio", media: 3.7 },
    { cod: 3, name: "Saulo", media: 2.2 },
    { cod: 4, name: "Manoel", media: 4.0 },
    { cod: 5, name: "Daleska", media: 2.6 }
];
let nextId = 1;

app.get('/alunos', (req, res) => {
    res.json({
        message:"Listagem de alunos em json",
        alunos: alunos
    });
});

app.get('/alunos/:cod', (req, res) => {
    const cod = parseInt(req.params.cod);
    const aluno = alunos.find(a => a.cod === cod);
    
    if (!aluno) {
        return res.status(404).json({ message: 'Cade o aluno?' });
    }
    
    res.json({
        message: `media do aluno ${aluno.name} é ${aluno.media}`
    });
});

// GET - Buscar um item específico por ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);
    
    if (!item) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    res.json(item);
});

// POST - Criar um novo item
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Nome é obrigatório' });
    }
    
    const newItem = {
        id: nextId++,
        name,
        description: description || '',
        createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT - Atualizar um item existente
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    
    const itemIndex = items.findIndex(i => i.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    if (name) items[itemIndex].name = name;
    if (description !== undefined) items[itemIndex].description = description;
    items[itemIndex].updatedAt = new Date().toISOString();
    
    res.json(items[itemIndex]);
});

// DELETE - Deletar um item
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    const deletedItem = items.splice(itemIndex, 1)[0];
    res.json({ message: 'Item deletado com sucesso', item: deletedItem });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({ 
        message: 'API CRUD com Express',
        endpoints: {
            'GET /items': 'Listar todos os itens',
            'GET /items/:id': 'Buscar item por ID',
            'POST /items': 'Criar novo item',
            'PUT /items/:id': 'Atualizar item',
            'DELETE /items/:id': 'Deletar item'
        }
    });
});

app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000`);
});