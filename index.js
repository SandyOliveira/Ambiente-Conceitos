const express = require ('express');
const server = express();

server.use(express.json());

//Query params = ?teste=1
/* server.get('/teste',(req, res)=> {
    const nome = req.query.nome;
    return res.json({ message: `Hello ${nome}` });
})
http://localhost:3000/teste?nome=Sandy 
*/
//Route params = /users/1
/* server.get('/users/:id',(req, res)=> {
    const id = req.params.id;
    return res.json({ message: `Buscando o usuário ${id}` });
})
http://localhost:3000/users/3
*/
//request body = {"name":"sandy", "email":"sandy@estudando.com"}

const users = ['Sandy', 'Aparecida', 'Oliveira'];
//middlewares
server.use((req, res, next)=>{
    console.time('Request');
    console.log(`Metodo: ${req.method}; URL: ${req.url}`);
    next();
    console.timeEnd('Request');
});

function checkUserExixts(req, res, next){
    if (!req.body.name){
        return res.status(400).json({ error:'User name is request'});
    }
    return next();
}
server.get('/users', (req, res)=>{
    return res.json(users);
})

function checkUserInArray(req, res, next){
   const user = users[req.params.index];
    if (!user){
        return res.status(400).json({error: 'User does not exists'});
     }

     req.user = user;

     return next();
}
server.get('/users/:index',checkUserInArray,(req, res)=> {
    return res.json(req.user);
})


server.post('/users',checkUserExixts, (req, res )=>{
    const { name } = req.body;
    users.push(name);
    
    return res.json(users);
});


server.put('/users/:index',checkUserExixts,checkUserInArray,(req,res)=>{
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;
    return res.json(users);
});


server.delete('/users/:index',checkUserInArray, (req, res)=>{
    const { index } = req.params;
    users.splice(index,1);
    return res.send();
});

server.listen(3000);