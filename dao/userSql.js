/*
 * @Autor: alexlin
 * @Date: 2020-07-10 18:12:06
 * @Version: xxx.v1.0
 * @LastEditTime: 2020-07-11 11:13:25
 * @Description: sql语句
 */ 
module.exports = {
  insert: 'insert into user(name, password, phone, role, sex) VALUES(?,?,?,?,?)',
  queryUser:'select * from user where uid=?',
  queryUserName:'select * from user where name=?',
  update: 'update user set name=?, password=?, phone=?, role=?, sex=? where uid=?'
}
