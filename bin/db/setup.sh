###
 # @Autor: alexlin
 # @Date: 2020-07-10 16:05:46
 # @Version: xxx.v1.0
 # @LastEditTime: 2020-07-10 16:06:34
 # @Description: sql启动脚本 (用git运行)
### 
#!/bin/bash
mysql -uroot -p114422 --default-character-set=utf8 <<EOF
drop database if exists wxRoom;
create database wxRoom character set utf8;
use wxRoom;
source init.sql;
EOF
cmd /k