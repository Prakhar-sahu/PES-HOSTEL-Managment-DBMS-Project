-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: hostel
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `reg_no` varchar(20) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`reg_no`,`date`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`reg_no`) REFERENCES `student` (`reg_no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocks` (
  `block_id` varchar(15) NOT NULL,
  `block_name` char(25) DEFAULT NULL,
  `locate` varchar(50) DEFAULT NULL,
  `description` char(50) DEFAULT NULL,
  `status` char(50) DEFAULT NULL,
  PRIMARY KEY (`block_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `complaint`
--

DROP TABLE IF EXISTS `complaint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint` (
  `complaint_id` int NOT NULL AUTO_INCREMENT,
  `complaint_date` date NOT NULL,
  `resolve_date` date DEFAULT NULL,
  `status` enum('pending','resolved') DEFAULT 'pending',
  `type` enum('electricity','carpenter','other') NOT NULL,
  `description` text NOT NULL,
  `picture` longblob,
  `staff_id` varchar(20) DEFAULT NULL,
  `student_ref_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`complaint_id`),
  KEY `staff_id` (`staff_id`),
  KEY `student_ref_no` (`student_ref_no`),
  CONSTRAINT `complaint_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  CONSTRAINT `complaint_ibfk_2` FOREIGN KEY (`student_ref_no`) REFERENCES `student` (`reg_no`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` varchar(15) NOT NULL,
  `course_name` char(30) NOT NULL,
  `year_no` int DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `localguardian`
--

DROP TABLE IF EXISTS `localguardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localguardian` (
  `guardian_name` char(30) NOT NULL,
  `reg_no` varchar(20) NOT NULL,
  `gender` char(1) DEFAULT NULL,
  `relation` char(20) DEFAULT NULL,
  `email_id` varchar(40) DEFAULT NULL,
  `address` varchar(75) DEFAULT NULL,
  `ph_no` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`guardian_name`,`reg_no`),
  KEY `guardian1` (`reg_no`),
  CONSTRAINT `guardian1` FOREIGN KEY (`reg_no`) REFERENCES `student` (`reg_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outing`
--

DROP TABLE IF EXISTS `outing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outing` (
  `gatepass_id` int NOT NULL AUTO_INCREMENT,
  `outing_type` char(15) NOT NULL,
  `purpose` char(30) NOT NULL,
  `out_date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expectedin_date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualin_date_time` timestamp NULL DEFAULT NULL,
  `current_status` char(20) NOT NULL DEFAULT 'Requested',
  `reg_no` varchar(20) DEFAULT NULL,
  `staff_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`gatepass_id`),
  KEY `outing1` (`reg_no`),
  KEY `outing2` (`staff_id`),
  CONSTRAINT `outing1` FOREIGN KEY (`reg_no`) REFERENCES `student` (`reg_no`),
  CONSTRAINT `outing2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `room_no` varchar(10) NOT NULL,
  `status` char(50) DEFAULT NULL,
  `block_id` varchar(15) NOT NULL,
  `beds_no` int NOT NULL,
  PRIMARY KEY (`room_no`,`block_id`,`beds_no`),
  UNIQUE KEY `unique_room_bed` (`room_no`,`block_id`,`beds_no`),
  KEY `room1` (`block_id`),
  CONSTRAINT `room1` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`block_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `staff_id` varchar(20) NOT NULL,
  `staff_name` char(40) NOT NULL,
  `gender` char(1) NOT NULL,
  `dob` date DEFAULT NULL,
  `email_id` varchar(40) DEFAULT NULL,
  `staff_role` char(20) DEFAULT NULL,
  `salary` int DEFAULT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `staff_block`
--

DROP TABLE IF EXISTS `staff_block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_block` (
  `staff_id` varchar(20) NOT NULL,
  `block_id` varchar(15) NOT NULL,
  PRIMARY KEY (`staff_id`,`block_id`),
  KEY `staffblock2` (`block_id`),
  CONSTRAINT `staffblock1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  CONSTRAINT `staffblock2` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`block_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `reg_no` varchar(20) NOT NULL,
  `room_no` varchar(10) NOT NULL,
  `block_id` varchar(15) NOT NULL,
  `stud_name` char(40) NOT NULL,
  `gender` char(1) NOT NULL,
  `dob` date DEFAULT NULL,
  `blood_group` char(3) DEFAULT NULL,
  `email_id` varchar(40) DEFAULT NULL,
  `address` varchar(75) DEFAULT NULL,
  `father_name` char(40) DEFAULT NULL,
  `mother_name` char(40) DEFAULT NULL,
  `parent_email` varchar(40) DEFAULT NULL,
  `course_id` varchar(15) DEFAULT NULL,
  `bed_no` enum('1','2','3') DEFAULT NULL,
  PRIMARY KEY (`reg_no`),
  KEY `st_fk1` (`block_id`),
  KEY `st_fk2` (`course_id`),
  CONSTRAINT `st_fk1` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`block_id`),
  CONSTRAINT `st_fk2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StudentBackupTrigger` AFTER INSERT ON `student` FOR EACH ROW BEGIN
    INSERT INTO student_backup
    SELECT *,
           NOW() AS insertion_date
    FROM student
    WHERE reg_no = NEW.reg_no;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_room_after_student_deletion` AFTER DELETE ON `student` FOR EACH ROW BEGIN
    UPDATE room 
    SET status = 'empty' 
    WHERE block_id = OLD.block_id 
    AND room_no = OLD.room_no 
    AND beds_no = OLD.bed_no;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `student_backup`
--

DROP TABLE IF EXISTS `student_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_backup` (
  `reg_no` varchar(20) NOT NULL,
  `room_no` varchar(10) NOT NULL,
  `block_id` varchar(15) NOT NULL,
  `stud_name` char(40) NOT NULL,
  `gender` char(1) NOT NULL,
  `dob` date DEFAULT NULL,
  `blood_group` char(3) DEFAULT NULL,
  `email_id` varchar(40) DEFAULT NULL,
  `address` varchar(75) DEFAULT NULL,
  `father_name` char(40) DEFAULT NULL,
  `mother_name` char(40) DEFAULT NULL,
  `parent_email` varchar(40) DEFAULT NULL,
  `course_id` varchar(15) DEFAULT NULL,
  `bed_no` enum('1','2','3') DEFAULT NULL,
  `insertion_date` datetime NOT NULL,
  PRIMARY KEY (`reg_no`,`insertion_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_ph`
--

DROP TABLE IF EXISTS `student_ph`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_ph` (
  `ph_no` varchar(10) NOT NULL,
  `reg_no` varchar(20) NOT NULL,
  PRIMARY KEY (`ph_no`,`reg_no`),
  KEY `studentph1` (`reg_no`),
  CONSTRAINT `studentph1` FOREIGN KEY (`reg_no`) REFERENCES `student` (`reg_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `staff_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_staff_id` (`staff_id`),
  CONSTRAINT `fk_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usersstud`
--

DROP TABLE IF EXISTS `usersstud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersstud` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reg_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `reg_no` (`reg_no`),
  CONSTRAINT `usersstud_ibfk_1` FOREIGN KEY (`reg_no`) REFERENCES `student` (`reg_no`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'hostel'
--
/*!50003 DROP FUNCTION IF EXISTS `GetStudentCountByGender` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetStudentCountByGender`(genderr CHAR(1)) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE student_count INT;

    SELECT COUNT(*) INTO student_count
    FROM student
    WHERE gender = genderr;

    RETURN student_count;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `IsRoomOccupied` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `IsRoomOccupied`(roomm_no VARCHAR(10), blockk_id VARCHAR(15)) RETURNS tinyint(1)
    NO SQL
    DETERMINISTIC
BEGIN
    DECLARE is_occupied BOOLEAN;

    SELECT COUNT(*) INTO is_occupied
    FROM student
    WHERE room_no = roomm_no AND block_id = blockk_id;

    RETURN is_occupied > 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GenerateMonthlyAttendanceReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerateMonthlyAttendanceReport`(IN year INT, IN month INT)
BEGIN
    
    DECLARE start_date DATE;
    DECLARE end_date DATE;
    
    SET start_date = DATE(CONCAT(year, '-', LPAD(month, 2, '0'), '-01'));
    SET end_date = LAST_DAY(start_date);
    
    
    SELECT
        s.reg_no,
        s.stud_name,
        a.date AS absent_date
    FROM
        student s
    LEFT JOIN
        attendance a
    ON
        s.reg_no = a.reg_no
    WHERE
        YEAR(a.date) = year
        AND MONTH(a.date) = month
    ORDER BY
        s.reg_no, a.date;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GenerateWeeklyAttendanceReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerateWeeklyAttendanceReport`(IN year INT, IN week_number INT)
BEGIN
    
    SELECT
        s.reg_no,
        s.stud_name,
        a.date AS absent_date
    FROM
        student s
    LEFT JOIN
        attendance a
    ON
        s.reg_no = a.reg_no
    WHERE
        YEAR(a.date) = year
        AND WEEK(a.date, 1) = week_number
    ORDER BY
        s.reg_no, a.date;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPhoneNumbersByRegNo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPhoneNumbersByRegNo`(IN p_regNo VARCHAR(20))
BEGIN
    SELECT ph_no FROM student_ph WHERE reg_no = p_regNo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetRoomsByStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRoomsByStatus`(
    IN check_block_id VARCHAR(15),
    IN check_status CHAR(50)
)
BEGIN
    
    CREATE TEMPORARY TABLE IF NOT EXISTS RoomsByStatus (
        room_no VARCHAR(10),
        block_id VARCHAR(15),
        status CHAR(50)
    );

    
    IF check_block_id IS NOT NULL AND check_status IS NOT NULL THEN
        INSERT INTO RoomsByStatus (room_no, block_id, status)
        SELECT
            r.room_no,
            r.block_id,
            r.status
        FROM
            room r
        WHERE
            r.block_id = check_block_id
            AND r.status = check_status;
    ELSEIF check_block_id IS NOT NULL THEN
        INSERT INTO RoomsByStatus (room_no, block_id, status)
        SELECT
            r.room_no,
            r.block_id,
            r.status
        FROM
            room r
        WHERE
            r.block_id = check_block_id;
    ELSEIF check_status IS NOT NULL THEN
        INSERT INTO RoomsByStatus (room_no, block_id, status)
        SELECT
            r.room_no,
            r.block_id,
            r.status
        FROM
            room r
        WHERE
            r.status = check_status;
    ELSE
        
        INSERT INTO RoomsByStatus (room_no, block_id, status)
        SELECT
            r.room_no,
            r.block_id,
            r.status
        FROM
            room r;
    END IF;

    
    SELECT
        room_no,
        block_id,
        status
    FROM
        RoomsByStatus;

    
    DROP TEMPORARY TABLE IF EXISTS RoomsByStatus;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-30  0:25:21
