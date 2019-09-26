var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/* 配置应用session */
app.use(session({
  secret:'blog',
    cookie: { maxAge:1000*60*24*30 },
    resave: false,
    saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 设置项目使用ejs模版引擎
app.set('view engine', 'ejs');
// 使用日志记录中间件
app.use(logger('dev'));

// 将body解析成json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 使用cookie解析中间件
app.use(cookieParser());

// 使用express默认的static中间件设置静态资源文件夹位置
app.use(express.static(path.join(__dirname, 'public')));

// 使用路由index
app.use('/', indexRouter);
// 使用路由users
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.render('404');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3002, () => {
  console.log('listenting port 3001');
});

module.exports = app;
