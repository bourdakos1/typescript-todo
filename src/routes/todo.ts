import { v4 as uuid4 } from "uuid";
import { Router } from "express";

const router = Router();

interface Todo {
  id: string;
  message: string;
  complete: boolean;
}

let todo: Todo[] = [];

/**
 * GET /todo
 * @summary Get the TODO list.
 * @queryParam {boolean} [complete] - Filter by complete.
 * @response 200 - OK
 */
router.get("/todo", (req, res) => {
  const { complete } = req.query;

  // If no complete query parameter, return all todo.
  if (complete === undefined) {
    return res.json(todo);
  }

  // Filter todo based on completion.
  return res.json(todo.filter((item) => item.complete.toString() === complete));
});

/**
 * POST /todo
 * @summary Create a new TODO item.
 * @bodyDescription The TODO message.
 * @bodyContent {string} text/plain
 * @bodyRequired
 * @response 200 - OK
 */
router.post("/todo", (req, res) => {
  // Create a new todo.
  const newTodo = { id: uuid4(), message: req.body, complete: false };

  // Add todo to list.
  todo.push(newTodo);

  return res.json(newTodo);
});

/**
 * PUT /todo/{id}
 * @summary Update a TODO item.
 * @pathParam {string} id
 * @bodyContent {Todo} application/json
 * @bodyRequired
 * @response 200 - OK
 * @response 400 - Invalid ID supplied
 */
router.put("/todo/:id", (req, res) => {
  const { id } = req.params;

  // Find todo by id.
  const todoIndex = todo.findIndex((item) => item.id === id);

  // If found, edit it.
  if (todoIndex > -1) {
    const requestedTodo = todo[todoIndex];
    const modifiedTodo = {
      ...requestedTodo,
      ...req.body,
      id: requestedTodo.id, // don't let them overwrite id.
    };
    todo[todoIndex] = modifiedTodo;
    return res.json(modifiedTodo);
  }

  // Otherwise, return 400 error.
  return res.status(400).send("Invalid ID");
});

/**
 * DELETE /todo/{id}
 * @summary Delete a TODO item.
 * @pathParam {string} id
 * @response 200 - OK
 * @response 400 - Invalid ID supplied
 */
router.delete("/todo/:id", (req, res) => {
  const { id } = req.params;

  // Find todo by id.
  const todoIndex = todo.findIndex((item) => item.id === id);

  // If found, delete it.
  if (todoIndex > -1) {
    todo = todo.filter((item) => item.id !== id);
    return res.end();
  }

  // Otherwise, return 400 error.
  return res.status(400).send("Invalid ID");
});

/**
 * GET /todo/{id}
 * @pathParam {string} id
 * @summary Get a TODO item by id.
 * @response 200 - OK
 * @response 400 - Invalid ID supplied
 */
router.get("/todo/:id", (req, res) => {
  const { id } = req.params;

  // Find todo by id.
  const requestedTodo = todo.find((item) => item.id === id);
  if (requestedTodo) {
    return res.json(requestedTodo);
  }

  // Otherwise, return 400 error.
  return res.status(400).send("Invalid ID");
});

export default router;
