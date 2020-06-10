import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import { indexRouter } from './routes/index';
import { usersRouter } from './routes/users';
import { historyRouter } from './routes/history';
import { dataProductRouter } from './routes/dataProducts';

const port = 3000;
const app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/history', historyRouter);
app.use('/dataproducts', dataProductRouter);

app.listen(port, () => console.log(`Pub-Sub-App running on http://localhost:${port}`))

export { app };
