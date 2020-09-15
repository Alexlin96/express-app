create table if not exists user(
  uid int(11) auto_increment,
  name varchar(16) unique,
  password varchar(16),
  phone varchar(11),
  role varchar(10),
  sex varchar(16),
  primary key(`uid`)
) default charset = utf8;

commit;

