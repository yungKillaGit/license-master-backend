import app from './app';
import { configuration } from './config';

app.listen({ port: configuration.APP_PORT }, () => {
  console.log(`Server is running on http://localhost:${configuration.APP_PORT}`);
});

app.get('/', () => ({ ok: true }));
