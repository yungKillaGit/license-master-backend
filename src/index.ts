import { app } from './app';
import { configuration } from './config';

app.listen({ port: configuration.APP_PORT, host: configuration.APP_HOST }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Swagger UI at http://${configuration.APP_HOST}:${configuration.APP_PORT}/documentation`);
});
