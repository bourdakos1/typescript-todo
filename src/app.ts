import express from "express";
import swaggerUi from "swagger-ui-express";
import openapi from "openapi-comment-parser";
import todoRouter from "./routes/todo";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.text());

const spec = openapi({ cwd: __dirname });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(todoRouter);

// Catch 404s.
app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
