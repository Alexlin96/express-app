const mysql = require('mysql')
const conf = require('../conf/db')
const sql = require('./userSql')
const jsonWebToken = require('jsonwebtoken');

// 连接池连接数据库
const pool = mysql.createPool(conf.mysql)

class userDao {
  add(req, res, next) {
    return new Promise(async (resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject('操作失败')
          return
        }
        let param = req.body
        connection.query(sql.queryUserName, param.name, (error, result) => {
          if (error) {
            reject('操作失败')
            return
          } else if (result.length !== 0) {
            reject('该用户已经注册过')
            return
          } else {
            connection.query(sql.insert, [param.name, param.password, param.phone, param.role, param.sex], (error, result) => {
              if (error) {
                reject('操作失败')
                return
              } else {
                resolve(param)
              }
              connection.release();
            })
          }
        })
      })
    })
  }
  edit(req, res, next) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject('操作失败')
          return
        }
        let param = req.body
        connection.query(sql.queryUser, param.uid, (error, result) => {
          if (error) {
            reject('操作失败')
            return
          } else if (result.length === 0) {
            reject('该用户不存在')
            return
          } else {
            connection.query(sql.update, [param.name,param.password, param.phone, param.role, param.sex, param.uid], (error, result) => {
              if (error) {
                reject('操作失败')
                return
              } else {
                resolve(param)
              }
            })
          }
          connection.release();
        })
      })
    })
  }
  login(req, res, next) {
    return new Promise((resolve, reject)=> {
      const {name, password} = req.body
      pool.getConnection((err, connection) => {
        if (err) {
          reject('操作失败')
        }
        connection.query(sql.queryUserName, name, (error, result) => {
          if (error) {
            reject('操作失败')
          } else if (result.length === 0) {
            reject('该用户不存在')
          } else {
            if (result[0].password === password) {
              const resData = {
                token: jsonWebToken.sign({
                  ...result[0]
                }, require('../conf/common').SECRET_KEY, {
                  expiresIn: '4h',
                }),
                ...result[0]
              }
              resolve(resData)
            } else {
              reject('密码错误')
            }
          }
        })
      })
    })
  }
  delete(req, res, next) {
    return new Promise((resolve, reject) => {
      const token = req.headers.authorization.replace('Bearer ', '')
      jsonWebToken.verify(token, require('../conf/common').SECRET_KEY, function (err, data) { // 解析token
        if (data.role === 'admin') {
          pool.getConnection((err, connection) => {
            if (err) {
              reject('操作失败')
            }
            connection.query(sql.deleteUser, data.uid, (error, result) => {
              if (error) {
                reject('操作失败')
              } else {
                resolve({
                  code: 200,
                  msg: '删除成功',
                  data: null
                })
              }
            })
          })
        } else {
          resolve({
            code: 403,
            msg: '无权限删除该账号',
            data: null
          })
        }
      })
    })
  }
  userInfo(req, res, next) {
    return new Promise((resolve, reject) => {
      const token = req.headers.authorization.replace('Bearer ', '')
      jsonWebToken.verify(token, require('../conf/common').SECRET_KEY, function (err, data) { // 解析token
        if (!err){ //解析成功
          resolve(data)
        } else {
          reject('token 无效')
        }
      })
    })
  }
  logout(req, res, next) {
    return new Promise((resolve, reject) => {
      const token = req.headers.authorization.replace('Bearer ', '')
      jsonWebToken.verify(token, require('../conf/common').SECRET_KEY, function (err, data) { // 解析token
        resolve('退出登录成功')
      })
    })
  }
  getUserList(req, res, next) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject('操作失败')
          return
        }
        connection.query(sql.queryUserList, (error, result) => {
          if (error) {
            reject('操作失败')
            return
          } else {
            resolve(result)
          }
          connection.release();
        })
      })
    })
  }
}

module.exports = new userDao()