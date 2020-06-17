const express = require("express");
const cors = require("cors");

const { uuid,isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


const repositories = [];

function validadeProjectId(req, res, next){
  const { id } = req.params;

  if(!isUuid(id)){
      return res.status(400).json({error: 'Invalid Project ID'});
  }
  
   next();

}

app.use('/repositories/:id', validadeProjectId)



app.get("/repositories", (request, response) => {
  const {title, url, techs, likes} = request.query;

  

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs, likes} =  request.body
 

  const repository = { id: uuid(), title, url, techs, likes:0};

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs, likes} =  request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id) //percorrer o array para encontrar projeto que tem o id que a gente recebeu como parâmetro

    if(repositoryIndex <0){
        return response.status(400).json({Error: "Repository not found"})
    }

    const repository ={    //colocando as informações do projeto atualizado dentro do objeto project
      id,
      title,
      url,
      techs,
      likes:0
  }

  repositories[repositoryIndex] = repository

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
    const {id} = request.params

    const repositoryIndex = repositories.findIndex(repository => repository.id === id) //percorrer o array para encontrar projeto que tem o id que a gente recebeu como parâmetro

    if(repositoryIndex <0){
        return response.status(400).json({Error: "repository not found"})
    }

    repositories.splice(repositoryIndex, 1)
    
    return response.status(204).send(); 
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params
    const repository = repositories.find(repository => repository.id == id) //percorrer o array para encontrar projeto que tem o id que a gente recebeu como parâmetro

    if(!repository){
        return response.status(400).json({error: "Repository not found"})
    }

    repository.likes += 1

    return response.json(repository)
});


module.exports = app;
