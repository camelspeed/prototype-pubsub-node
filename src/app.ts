import * as createError from 'http-errors';
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Pub-Sub-App running on http://localhost:${port}`))

export { app };
