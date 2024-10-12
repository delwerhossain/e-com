import { Server } from 'http';
import { app } from './app';
import config from './app/config';
import mongoose from 'mongoose';

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

// handle uncaught exception
process.on('uncaughtException', err => {
  console.log('uncaughtException =>', err);
  process.exit(1);
});

// handle unhandled promise rejection
process.on('unhandledRejection', err => {
  console.log('unhandledRejection =>', err);
  server.close(() => {
    process.exit(1);
  });
});

main();
