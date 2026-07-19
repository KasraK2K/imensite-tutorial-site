import { createServer } from 'node:http';

import express, { type ErrorRequestHandler } from 'express';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import passport from 'passport';
import { Server as SocketServer } from 'socket.io';

import { config, publicDirectory, viewsDirectory } from './config.js';
import data from './data/data.json' with { type: 'json' };
import User from './models/user.js';
import dashboardRouter from './routes/dashboard/dashboard.js';
import publicRouter from './routes/public/public.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer);

app.set('port', config.port);
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', viewsDirectory);
app.locals.data = data;
app.locals.siteName = 'ایمن سایت';

app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: config.sessionSecret,
  store: MongoStore.create({ mongoUrl: config.mongoUri }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((request, response, next) => {
  response.locals.currentUser = request.user;
  next();
});
app.use(methodOverride((request) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    const bodyWithMethod = request.body as Record<string, unknown>;
    const method = bodyWithMethod._method;
    delete bodyWithMethod._method;
    return typeof method === 'string' ? method : '';
  }
  return '';
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id: string, done) => {
  void User.findById(id).exec().then((user) => done(null, user ?? false), done);
});

io.on('connection', (socket) => {
  socket.on('chat message', (message: unknown) => {
    if (typeof message === 'string' && message.trim()) {
      socket.broadcast.emit('chat message', message.trim().slice(0, 2000));
    }
  });
});

app.use('/dashboard', dashboardRouter);
app.use('/', publicRouter);
app.get('/api', (_request, response) => response.json(data));

app.use((_request, response) => {
  response.status(404).send('صفحه پیدا نشد.');
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  if (response.headersSent) return;
  const caughtError: unknown = error;
  if (typeof caughtError === 'object' && caughtError !== null && 'code' in caughtError && caughtError.code === 11000) {
    response.status(409).send('مقدار تکراری است؛ لطفا نام یا نامک دیگری انتخاب کنید.');
    return;
  }
  if (typeof caughtError === 'object' && caughtError !== null && 'name' in caughtError && caughtError.name === 'CastError') {
    response.status(400).send('شناسه ارسال‌شده معتبر نیست.');
    return;
  }
  response.status(500).send('خطایی در سرور رخ داد.');
};
app.use(errorHandler);

async function start(): Promise<void> {
  await mongoose.connect(config.mongoUri);
  httpServer.listen(config.port, () => {
    console.log(`server is running at http://localhost:${config.port}/`);
  });
}

async function shutdown(signal: string): Promise<void> {
  console.log(`${signal} received; shutting down.`);
  await io.close();
  httpServer.close();
  await mongoose.disconnect();
  process.exit(0);
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

void start().catch((error: unknown) => {
  console.error('Unable to start the server:', error);
  process.exitCode = 1;
});

export { app, httpServer };
