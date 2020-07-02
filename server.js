const express = require("express");
const server = express();
server.use(express.json());

let users = [
    {
        id: 1, // hint: use the shortid npm package to generate it
        name: "Jane Doe", // String, required
        bio: "Not Tarzan's Wife, another Jane",  // String, required
    },
    {
        id: 2, // hint: use the shortid npm package to generate it
        name: " Doe", // String, required
        bio: " another Jane",  // String, required
    }
]

server.post('/api/users', (req, res) =>{
    let user = req.body
    if(!user.name || !user.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }else{
        try{
            const incrementId = users.length + 1
            user = {
                id: incrementId,
                ...user,
            }
            users.push(user)
            res.status(201).json(users);
        }catch{
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
        }
    }
})

server.get('/api/users', (req, res) =>{
    try{
        if(users){
            res.status(200).json(users)
        }
    }catch{
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
})

server.get('/api/users/:id', (req, res) =>{
    const id = Number(req.params.id)
    const findUserById = users.find( user => user.id === id)
    if(!findUserById){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else if(findUserById){
        res.status(200).json(findUserById)
    } else {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
})

server.delete('/api/users/:id', (req, res) =>{
    const id = Number(req.params.id)
    const findUserById = users.find( user => user.id === id)
    if(!findUserById){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else if(findUserById){
        users = users.filter( user => user.id !== id)
        res.status(200).json({message: "The user is removed", data: users})
    } else{
        res.status(500).json({ errorMessage: "The user could not be removed" })
    }
})

server.put('/api/users/:id', (req, res) =>{
    const id = Number(req.params.id)
    const user = req.body
    let findUserById = users.find( user => user.id === id)

    if (!findUserById){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }else if(findUserById && user.name && user.bio){
        findUserById = {
            ...findUserById,
            name: user.name,
            bio: user.bio,
        }
        users = users.map( user =>{
            if(user.id === id){
                return findUserById
            }
            return user
        })
        res.status(200).json(users)
    } else if (!user.name || !user.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else{
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    }
})

const port = 8000
server.listen(port, () =>console.log(`\n == API running on port${port} == \n`));