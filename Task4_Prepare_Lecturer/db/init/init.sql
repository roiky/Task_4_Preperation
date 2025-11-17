-- init.sql (Lectures Management) - using CREATE SCHEMA for parity with your old file
--TEST?

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- יצירת SCHEMA (שווה ערך ל-CREATE DATABASE ב-MySQL)
DROP SCHEMA IF EXISTS `lecturers_db`;
CREATE SCHEMA IF NOT EXISTS `lecturers_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `lecturers_db`;

-- טבלה: lecturers
CREATE TABLE IF NOT EXISTS `lecturers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skills_react` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skills_node` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skills_angular` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skills_dotnet` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skills_microservices` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skills_microfrontends` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skills_ai` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skills_docker` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `chk_skills_range` CHECK (
    skills_react BETWEEN 0 AND 10 AND
    skills_node BETWEEN 0 AND 10 AND
    skills_angular BETWEEN 0 AND 10 AND
    skills_dotnet BETWEEN 0 AND 10 AND
    skills_microservices BETWEEN 0 AND 10 AND
    skills_microfrontends BETWEEN 0 AND 10 AND
    skills_ai BETWEEN 0 AND 10 AND
    skills_docker BETWEEN 0 AND 10
  ),
  UNIQUE KEY `uq_lecturer_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- דוגמה לנתון התחלה
INSERT INTO `lecturers_db`.`lecturers` (`name`, `skills_react`, `skills_node`, `skills_angular`, `skills_dotnet`, `skills_microservices`, `skills_microfrontends`, `skills_ai`, `skills_docker`) VALUES ('test', 1, 2, 3, 4, 5, 6, 7, 8);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
