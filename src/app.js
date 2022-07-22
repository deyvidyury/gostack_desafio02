const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let repoIndex = repositories.findIndex((r) => r.id === id);

  if (repoIndex < 0) {
    return response.status(400).send();
  }

  repositories[repoIndex] = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  return response.send(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((r) => r.id === id);

  if (repoIndex < 0) {
    return response.sendStatus(400);
  }

  repositories.splice(repoIndex, 1);

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  let repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  let repo = repositories[repositoryIndex];
  repo.likes += 1;
  repositories[repositoryIndex] = repo;

  return response.json({ likes: repo.likes });
});

module.exports = app;
