import { startServer } from "./src/server";

const app = startServer();

app.listen(3001, () => {
  console.info(`Listening on port 3001`);
});
