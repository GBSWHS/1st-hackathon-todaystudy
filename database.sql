create user byte@localhost;
create schema byte;

grant all on byte.* to byte@localhost;

create table byte.users (
  `id` varchar(12) not null primary key,
  `name` varchar(255) not null,
  `roomcode` char(10) not null,
  `passwd` char(64) not null,
  `salt` char(10) not null,
  `point` int(11) default 0 not null,
  `isTeacher` boolean default 0 not null
);

create table byte.rooms (
  `code` char(10) not null primary key
);

create table byte.homeworks (
  title text not null,
  content longtext not null,
  finished_at timestamp not null,
  created_at timestamp default CURRENT_TIMESTAMP not null,
  roomcode char(10) not null
);

create table byte.board (
  id int auto_increment primary key,
  title text not null,
  roomcode char(10) not null,
  content longtext not null,
  created_at timestamp default CURRENT_TIMESTAMP not null.
  author varchar(12) not null,
  `name` varchar(255) not null,
);

create table byte.comments (
  id int auto_increment primary key,
  author varchar(12) not null,
  `name` varchar(255) not null,
  isOwnerOnly boolean not null default 0,
  content longtext not null,
  boardId int not null,
  isPointed boolean not null default 0
);

create table byte.files (
  title text not null,
  content text not null,
  roomcode char(10) not null,
  `filename` text not null
);
