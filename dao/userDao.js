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
        connection.query(sql.queryUserName, param.name, (error, result) => {
          if (error) {
            reject('操作失败')
            return
          } else if (result.length === 0) {
            reject('该用户不存在')
            return
          } else {
            connection.query(sql.update, [param.password, param.phone, param.role, param.sex, param.name], (error, result) => {
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
}

module.exports = new userDao()