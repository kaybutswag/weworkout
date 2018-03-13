CREATE DATABASE kinnections_users;

-- CREATE TABLE authentication(
-- 	id INT NOT NULL auto_increment,
--     email VARCHAR(100) NOT NULL,
--     password VARCHAR(20) NOT NULL,
--     PRIMARY KEY (id)
-- );

-- CREATE TABLE user_info(
-- 	id INT NOT NULL,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     latitutde INT (20),
--     longitude INT (20),
--     gender VARCHAR(20),
--     age INT (4),
--     img BLOB(200) DEFAULT 'dummy.jpg',
--     primary_location VARCHAR(100),
--     weightlift BOOLEAN,
--     run BOOLEAN,
--     walk BOOLEAN,
--     swim BOOLEAN,
--     surf BOOLEAN,
--     bike BOOLEAN,
--     yoga BOOLEAN,
--     pilates BOOLEAN,
--     cardio BOOLEAN,
--     dance BOOLEAN,
--     rock BOOLEAN,
--     gymnastics BOOLEAN,
--     bowl BOOLEAN,
--     rowing BOOLEAN, 
-- 	tennis BOOLEAN,
--     baseball BOOLEAN,
--     basketball BOOLEAN,
--     football BOOLEAN,
--     soccer BOOLEAN,
--     rugby BOOLEAN,
--     volleyball BOOLEAN,
--     golf BOOLEAN,
--     hockey BOOLEAN,
--     ice BOOLEAN,
--     skateboard BOOLEAN,
--     max_press INT (10),
--     max_squat INT (10),
--     max_deadlift INT (10),
--     miles INT (10),
--     bio VARCHAR (300),
--     PRIMARY KEY (id)
-- );

-- -- I think we need to create tables dynamically for each user with records of matches
-- DROP PROCEDURE IF EXISTS createLogTable;
-- DELIMITER //
-- CREATE PROCEDURE createLogTable(tblName VARCHAR(255))
-- BEGIN
--     SET @tableName = tblName;
--     SET @q = CONCAT('
--         CREATE TABLE IF NOT EXISTS `' , @tableName, '` (
--             `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
--             `something` VARCHAR(10) NOT NULL,
--             `somedate` DATETIME NOT NULL,
--             PRIMARY KEY (`id`)
--         ) ENGINE=MyISAM DEFAULT CHARSET=utf8
--     ');
--     PREPARE stmt FROM @q;
--     EXECUTE stmt;
--     DEALLOCATE PREPARE stmt;
--     -- and you're done. Table is created.
--     -- process it here if you like (INSERT etc)
-- END;


-- -- copied from suggestions on chatboxes
-- SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

-- CREATE SCHEMA IF NOT EXISTS `chats` DEFAULT CHARACTER SET utf8 COLLATE default collation ;

-- -- -----------------------------------------------------
-- -- Table `chats`.`chat`
-- -- -----------------------------------------------------
-- CREATE  TABLE IF NOT EXISTS `chats`.`chat` (
--   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
--   PRIMARY KEY (`id`) )
-- ENGINE = InnoDB;


-- -- -----------------------------------------------------
-- -- Table `chats`.`chat_user`
-- -- -----------------------------------------------------
-- CREATE  TABLE IF NOT EXISTS `chats`.`chat_user` (
--   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
--   `handle` VARCHAR(45) NOT NULL ,
--   PRIMARY KEY (`id`) )
-- ENGINE = InnoDB;


-- -- -----------------------------------------------------
-- -- Table `chats`.`chat_line`
-- -- -----------------------------------------------------
-- CREATE  TABLE IF NOT EXISTS `chats`.`chat_line` (
--   `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
--   `chat_id` INT UNSIGNED NOT NULL ,
--   `user_id` INT UNSIGNED NOT NULL ,
--   `line_text` TEXT NOT NULL ,
--   `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
--   PRIMARY KEY (`id`) ,
--   INDEX `fk_chat_line_chat` (`chat_id` ASC) ,
--   INDEX `fk_chat_line_chat_user1` (`user_id` ASC) ,
--   CONSTRAINT `fk_chat_line_chat`
--     FOREIGN KEY (`chat_id` )
--     REFERENCES `chats`.`chat` (`id` )
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION,
--   CONSTRAINT `fk_chat_line_chat_user1`
--     FOREIGN KEY (`user_id` )
--     REFERENCES `chats`.`chat_user` (`id` )
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;



-- SET SQL_MODE=@OLD_SQL_MODE;
-- SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;