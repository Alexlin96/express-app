var express = require('express');
var router = express.Router();

const userDao = require('../dao/userDao')
/* 用户 */

router.get('/', function(req, res, next) {
  res.json('测试用户接口连接成功');
});

// 注册用户
router.post('/addUser', async(req, res, next) => {
  try {
    let resData = await userDao.add(req, res, next)
    resData.password = '********'
    res.json({
      code: 200,
      msg: '成功',
      data: resData
    })
  } catch (err) {
    res.json({
      code: 500,
      msg: err,
      data: null
    })
  }
})

// 编辑用户
router.post('/editUser', async(req, res, next) => {
  try {
    let resData = await userDao.edit(req, res, next)
    resData.password = '********'
    res.json({
      code: 200,
      msg: '成功',
      data: resData
    })
  } catch (err) {
    res.json({
      code: 500,
      msg: err,
      data: null
    })
  }
})

// 登录
router.post('/login', async(req, res, next) => {
  try {
    let resData = await userDao.login(req, res, next)
    resData.password = '********'
    res.json({
      code: 200,
      msg: '成功',
      data: resData
    })
  } catch (err) {
    res.json({
      code: 500,
      msg: err,
      data: null
    })
  }
})

// 获取当前用户信息
router.get('/userInfo', async(req, res, next) => {
  try {
    let resData = await userDao.userInfo(req, res, next)
    resData.password = '********'
    res.json({
      code: 200,
      msg: '成功',
      data: resData
    })
  } catch (err) {
    res.json({
      code: 500,
      msg: err,
      data: null
    })
  }
})

// 退出登录
router.get('/logout', async(req, res, next) => {
  try {
    let resData = await userDao.logout(req, res, next)
    res.json({
      code: 200,
      msg: '成功',
      data: resData
    })
  } catch (err) {
    res.json({
      code: 500,
      msg: err,
      data: null
    })
  }
})

// 获取所有用户信息列表
router.get('/userList', async(req, res, next) => {
  try {
    let resData = await userDao.getUserList(req, res, next)
    res.json({
      code: 200,
      msg: '成功',
      data: resData
    })
  } catch (err) {
    res.json({
      code: 500,
      msg: err,
      data: null
    })
  }
})

// 删除用户
router.post('/delUser', async(req, res, next) => {
  try {
    let resData = await userDao.delete(req, res, next)
    res.json({
      code: resData.code,
      msg: resData.msg || '成功',
      data: resData.data
    })
  } catch (err) {
    res.json({
      code: 500,
      msg: err,
      data: null
    })
  }
})

router.get('/callback', function(req, res, next) {
  // res.json('测试用户接口连接成功');
  res.redirect('https://test-am.goatgames.com/#/account/toutiao')
})


module.exports = router;
