var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
var cors = require('cors');
var expressJWT = require('express-jwt');

var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// 对http请求体进行解析
app.post('*', bodyParser.urlencoded({ extended: true }),
  function (req, res, next) {
    next();
  }
);

// 跨域请求处理 写在注册路由前面
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 输出请求日志到log目录
var fs = require('fs')
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/request.log'),{ flags: 'a', encoding: 'utf8' })
app.use(logger('combined', { stream: accessLogStream }));

// 异常错误处理 避免导致程序错误立即退出
var domain = require('domain');
app.use(function (req, res, next) {
  var reqDomain = domain.create()
  reqDomain.on('err', function (err) {
    res.status(err.status || 500);
    console.log('捕获到错误：'+ err.message)
  })
  reqDomain.run(next);
})

// token验证  authorization: Bearer +token
app.use(expressJWT({
  secret: require('./conf/common').SECRET_KEY,
  algorithms: ['HS256']
}).unless({
  // 除了这些地址其他的需要验证 '/user/editUser' /^\/static\/.*/
  path: ['/user/login', '/user/addUser', '/user', '/user/editUser', '/toutiaoPermission/callback']
}))

// 路由注册
app.use('/user', usersRouter);
app.use('/api', apiRouter)
app.use('/toutiaoPermission', usersRouter);


// 捕获404错误
app.use(function(req, res, next) {
  next(createError(404));
});

// 捕获错误
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 校验 token 失败时的处理
  if (err.name === 'UnauthorizedError') {
    res.json({
      code:401,
      msg: 'token失效',
      data: null
    })
    console.log('invalid token...');
  }

  res.status(err.status || 500);
});

// 3005端口启动服务
app.listen(3005, () => console.log('Successfully! express app listening on port 3005...'));
