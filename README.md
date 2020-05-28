# How to build a TypeScript server

## TL;DR
```
git clone https://github.com/bourdakos1/typescript-todo.git
yarn install
yarn start
```

## Setup Node and a package manager
If you don't already have Node installed the easiest way to get it is from the
[Node.js website](https://nodejs.org).

I personally use [nvm](https://github.com/nvm-sh/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows)).
It is the recommend way to install Node so you can easily switch between different versions.

In order to easily install things, you need a package manager. By default Node
comes with `npm`, but I prefer `yarn`. You can install yarn with:
```
npm install -g yarn
```

## Start a project

Create a folder with the name of your project. I named mine `typescript-todo`.

A Node.js project should have a `package.json`. This contains all the metadata for
your project like its name, homepage, license, etc. It also contains information
about the dependencies it requires, and allows you to include useful scripts to
be run for tasks like building, testing and linting.

We can create the `package.json` by hand or run `yarn init` to interactively 
generate it for us.

Either way, you should end up with a `package.json` that looks something like
this:
```json
{
  "name": "typescript-todo",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {}
}
```

If your project is open source, you might want to specify more metadata, like 
`license` and `repository`. Check out [choosealicense](https://choosealicense.com/)
for clear examples on what the different licenses mean and how to choose the right
one for your project:
```json
{
  "name": "typescript-todo",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/bourdakos1/typescript-todo.git",
  "author": "Nick <bourdakos1@gmail.com>",
  "license": "MIT",
  "scripts": {}
}
```

## Make sure Node is working
You can skip this section if you're confident your project has been set up
properly.

Add a file named `index.js`:
```js
console.log("hello world")
```

Then run:
```
node index.js
```

You should see `hello world` printed in the console.

## Moving to typescript
First, we need to install typescript as a dev dependency. A dev dependency is a
dependency we only need to use while developing our application. In this case,
once we compile the production version of our typescript server, we no longer 
need to use the typescript dependency.

Install typescript as a dev dependency by passing the `-D` flag:
```
yarn add -D typescript
```

Create a `tsconfig.json` file with the following options:
```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

**options**
- `compilerOptions.outDir`: Tells the typescript compiler where to dump our compiled code. In this case, it will create a folder named `dist` and place the compiled files there.

> **Note:** We will update this file again later with some important additional
> options.

Finally, rename `index.js` to `index.ts` in order to make it recognized as a
typescript file.

The javascript code that we wrote in `index.js` is valid typescript, so we don't
need to make any other modifications.

To compile our typescript, we will use `tsc` which is part of the `typescript`
package we install as a dev dependency. To use it, just run:
```
yarn tsc
```

You should see a `dist` folder generated with a single `index.js` file inside.
We can test that it worked, by running:
```
node dist/index.js
```

You should see `hello word` printed in the console like before.

yay our first typescript application 🎉

## Setting up a good development environment
In order to have a pleasent development experience, we want to set up things like
linting, code formatting, and automatic re-running.

### Linting
Linting is your extra set of eyes that never get tired. It will help you catch 
bugs early and shouldn't get in your way. It will notify you of things like trying
to use a variable that hasn't been defined or not using a variable that you did 
define. Linting is NOT there to yell at you for awkward spacing or for not using
trailing commas.

For linting we will be using a package called `eslint`.

### Code formatting
Code formatting is where we handle awkward spacing, missing semicolons and trailing 
commas. Code formatting doesn't yell at you, it just fixes it. Code formatting is
commonly set up so that anytime you save the file, it gets prettified. 

For code formatting we will be using a package called `prettier`.

### Automatic re-running
The goal of automatic re-running is that anytime you make a change to your code
the output reflects those changes. You shouldn't have to manually kill your server,
compile the typescript and then restart your everytime you make a change.

For automatic re-running we will be using a combination of `nodemon` and `ts-node`.

## Setup linting
To setup linting we need to install the following dev dependencies:
```
yarn add -D eslint @typescript-eslint/eslint-plugin eslint-plugin-openapi
```

**dependencies**
- `eslint`: Runs the linting.
- `@typescript-eslint/parser`: A parser that replaces the default eslint parser in order to support typescript.
- `@typescript-eslint/eslint-plugin`: A plugin with a set of eslint rules specific to typescript.
- `eslint-plugin-openapi`: A plugin with a set of eslint rules for OpenAPI (we will go over this more later).

We also need to create a file called `.eslintrc.json`:
```json
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:openapi/recommended"
  ],
  "rules": {
    "prefer-const": "off"
  }
}
```

**options**
- `root`: If `true`, eslint stops looking for `eslintrc` files in parent directories. It's good practice to have this set in the root of your project.
- `extends`: A list of eslint configs from which to extend. These configs have a recommended set of rules enabled. Additionally `@typescript-eslint` enables the custom parser we installed.
- `rules`: An optional list of additional rules to turn on/off.

> **Note:** We turned off `prefer-const` which is a [highly debated topic](https://overreacted.io/on-let-vs-const/). It requires you to
> declare a variable with `const` instead of `let` if it is never reassigned. Some 
> find this misleading for `objects` and `arrays`, because you can still mutate them
> even if they are `const`. For example:
> ```
> const array = []
> array.push("hello")
> array.push("world")
> ```
> 
> Some like to declare this with `let` to indicate that array is mutated:
> ```
> let array = []
> array.push("hello")
> array.push("world")
> ```

Optionally, in the scripts section of your `package.json`, add a linting script:
```json
{
 "scripts": {
   "lint": "eslint . --ext .ts"
 }
}
```

Create an `.eslintignore`:
```
node_modules
dist
```

## Setup code formatting
Setting up code formatting is a lot simplier, because `prettier` is highly opinionated.
Simply install it with:
```
yarn add -DE prettier
```

> **Note:** The `-E` flag ensures the exact version of prettier is installed.
> This is recommended, because prettier installs style updates as patch releases.

and add an empty `.prettierrc` to your project:
```json
{}
```

Optionally, in the scripts section of your `package.json`, add a code formattting script:
```json
{
 "scripts": {
   "pretty": "pettier . --write"
 }
}
```

## Setup vscode
I use (Visual Studio Code)[https://code.visualstudio.com/] for my code editter.
If you are also using vscode, I recommend the following extensions to improve your
linting and code formatting experience:

- (`esbenp.prettier-vscode`)[https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode]
- (`dbaeumer.vscode-eslint`)[https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint]

## Setup automatic re-running
For automatic re-running add the following dev dependencies:
```
yarn add -D ts-node nodemon
```

**dependencies**
- `ts-node`: Allows you to run typescript files.
- `nodemon`: Re-runs code whenever it changes.

Add a `start` script to the scripts section of your `package.json`:
```json
{
 "scripts": {
   "start": "nodemon --watch src -e ts,yml --exec ts-node src/app.ts"
 }
}
```

**start script breakdown**
- `nodemon`
  - `--watch src`: Watch the source folder for changes.
  - `-e ts,yml`: Only re-run when `typscript` and `yaml` files change.
  - `--exec ts-node src/app.ts`: The command to run when changes happen.

## Setup the project
You might have noticed in the previous step that we told nodemon to watch the
`src` folder. It's a good practice to have a folder that separates your source
code from the long list of configuration files.

You can delete the `index.ts` file if you created one. We are now going to create
a new folder called `src` and add an empty file named `app.ts`. Your folder structure
should look something like this:

```
 📂 typescript-todo
 ├── 📂 src
 │   └── 📄 app.ts
 ├── 📄 .eslintignore
 ├── 📄 .eslintrc.json
 ├── 📄 .prettierrc
 ├── 📄 package.json
 └── 📄 tsconfig.json
```

Install the following dependencies that we will use for the project:
```
yarn add express openapi-comment-parser swagger-ui-express uuid
```

**dependencies**
- `express`: A minimal web framework for node.
- `swagger-ui-express`: A tool to serve OpenAPI documentation for our API.
- `openapi-comment-parser`: OpenAPI specification generation from doc comments.
- `uuid`: Generate universally unique IDs.

Since we are using typescript, we also need to install types for packages that
weren't written in typescript:
```
yarn add -D @types/express @types/swagger-ui-express @types/uuid
```

How do you know which packages need to have types installed?
- typescript will yell at you and tell you which ones to install.

## Update the typescript config
Update your `tsconfig.json` as follows:
```json
{
  "compilerOptions": {
    "strict": true, 
    "module": "commonjs",
    "target": "es2018",
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": [
    "src/**/*"
  ]
}
```

**options**
- `compilerOptions.strict`: Enables a wide range of type checking behavior that results in stronger guarantees of program correctness.
- `compilerOptions.module`: You very likely want `"CommonJS"`.
- `compilerOptions.target`: Recommended targets based on the Node version:
  - Node 8 = ES2017
  - Node 10 = ES2018
  - Node 12 = ES2019
- `compilerOptions.esModuleInterop`: Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports.
- `include`: An array of filenames or patterns to include in the program. These filenames are resolved relative to the directory containing the `tsconfig.json` file.

## Coding time!
Add the following to `app.ts`. You might be thinking, this is just javascript...
It is! But now we have stronger typing (we'll see some of the benefits of typescript in a bit).
```ts
// Import our packages
import express from "express";
import swaggerUi from "swagger-ui-express";
import openapi from "openapi-comment-parser";

// Choose a 4 digit number for our port. With 3000, we can see out server
// running at: http://localhost:3000
const PORT = 3000;

// Initialize express.
const app = express();

// Setup comment parsing to generate our documentation.
// The `{ cwd: __dirname }` option, tells OpenAPI comment parser to start by
// looking in this this `src` directory for comments. Hardcoding directories in
// Node can cause issues when running the project from another directory, it's
// best practice to use `__dirname` as a base.
const spec = openapi({ cwd: __dirname });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// The following comment is used to generate documentation:
/**
 * GET /hello
 * @summary Get a hello world message
 * @response 200 - OK
 */
// Set up a "/hello" route that sends a `hello world` message.
app.get("/hello", (req, res) => {
  // Try changing the following to:
  // req.send("hello world")
  // You should get a linting error. One of the benefits of typescript!
  // Typescript let's us know `req` doesn't have a method called `send`
  res.send("hello world")
});

// Listen on port 3000.
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
```

Then create a yaml file, this file could be named anything, I called mine `todo-app.yml`
you could also call it `metadata.yml`. This file sets up basic info, like the name
of our app and which version of OpenAPI to use:
```yaml
openapi: 3.0.3
info:
  title: Todo App
  version: 1.0.0
```

Run `yarn start` to start your server:
```
yarn start
```

Try going to http://localhost:3000/hello in your browser. You should see a 
`hello world` message displayed.

You can also try going to http://localhost:3000/api-docs/ to see our generated
documentation so far. The `try it out` feature can be super helpful for debuging
your API without having to build a real frontend, especial for non `GET` requests
like `POST`, `PUT` or `DELETE`.

## Creating a router
It's normally a good practice to create a router to separate your routes. We will
create a router for our `/todo` route.

Go ahead and replace our `app.ts` file with the following:
```ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import openapi from "openapi-comment-parser";

// Import our `todoRouter`.
import todoRouter from "./routes/todo";

const PORT = 3000;

const app = express();

// Add body parsers for application/json and text/plain content-types.
app.use(express.json());
app.use(express.text());

const spec = openapi({ cwd: __dirname });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// Send any requests for "/todo" to our `todoRouter`.
app.use("/todo", todoRouter);

// Send a 404 error if the page can not be found.
app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
```

Create a directory called `routes` and add a file for our router called `todo.ts`.
You `src` folder should look something like this:
```
 📂 src
 ├── 📂 routes
 │   └── 📄 todo.ts
 ├── 📄 app.ts
 └── 📄 metadata.yml
```

Add the following to `todo.ts`:
```ts
import { v4 as uuid4 } from "uuid";
import { Router } from "express";

const router = Router();

// We finally have some unique typescript code:
// This defines an interface called `Todo` that has 3 required fields: 
// `id` a string, `message` a string, and `complete` a boolean.
interface Todo {
  id: string;
  message: string;
  complete: boolean;
}

// Initialize an array of `Todo`s. Typescript will yell at us if we try to
// append something to this array that isn't a valid `Todo`.
let todo: Todo[] = [];

/**
 * GET /todo
 * @summary Get the TODO list.
 * @queryParam {boolean} [complete] - Filter by complete.
 * @response 200 - OK
 */
router.get("/", (req, res) => {
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
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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
router.get("/:id", (req, res) => {
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
```

Create a file in `routes` called `components.yml` or `todo.yml`. This file is used
by OpenAPI comment parser to create a schema called `Todo` with 2 fields: `message` and `complete`.
This `Todo` schema is used as a `@bodyContent` for the `PUT` request when modifying a todo item:
```yaml
components:
  schemas:
    Todo:
      type: object
      properties:
        message:
          type: string
        complete:
          type: boolean
```

If you haven't killed your server yet, refresh http://localhost:3000/api-docs/.
Otherwise run:
```
yarn start
```

Then open http://localhost:3000/api-docs/ in your browser. You should see something
like this:

![openapi](/assets/openapi.png)

Try it out by getting a list of `Todo`s, creating a new one, updating it and deleting it.

## Production build
When deploying our API in production, we don't want to use `typescript` and `ts-node` we just
want to use `node` and regular `javascript`.

We can add a `build` script to our `package.json` that builds the javascript version of
our server:
```json
{
  "scripts": {
    "clean": "rimraf dist",
    "compile": "tsc",
    "copy": "copyfiles -u 1 src/**/*.yml dist",
    "build": "run-s clean compile copy"
  }
}
```

The build is split into three steps: `clean`, `compile`, `copy`.
- `clean`: Delete the old `dist` folder.
- `compile`: Compile the typescript to javascript and export it to the `dist` folder.
- `copy`: The `yaml` files don't get exported to `dist` using `tsc` so we need to copy them over as well.
  - `copyfiles`: `-u 1` removes the top-level directory when copying files, so we don't end up with a `src` folder in our `dist` folder.

We have a couple dev dependencies that need to be installed to run these scripts:
```
yarn add -D rimraf copyfiles npm-run-all
```

**dependencies**
- `rimraf`: Recursively remove a directory, the crossplatform version of `rm -rf`
- `copyfiles`: Copy files from one place to another.
- `npm-run-all`: Run multiple npm commands in sequence or parallel.

You should now be able to build your project by running:
```
yarn build
```

Once built you can run the build like a normal node app:
```
node dist/app.js
```
