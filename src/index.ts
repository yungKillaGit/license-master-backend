import app from './app';
import { configuration } from './config';

app.get('/', () => ({ ok: true }));

app.listen({ port: configuration.APP_PORT, host: configuration.APP_HOST }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
