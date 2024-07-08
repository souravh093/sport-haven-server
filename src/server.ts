import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

// start server and connect with mongodb
async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`Sport Haven is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// handle unhandledRejection and uncaughtException
process.on('unhandledRejection', (err) => {
  console.log(`unaHandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
