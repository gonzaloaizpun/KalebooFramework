-- MySQL dump 10.13  Distrib 5.7.25, for Linux (x86_64)
--
-- Host: localhost    Database: kaleboo
-- ------------------------------------------------------
-- Server version	5.7.25-0ubuntu0.16.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attributes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (1,'fullname'),(2,'avatar'),(3,'email'),(4,'password'),(5,'address'),(6,'zipcode'),(7,'phone');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `measurements`
--

DROP TABLE IF EXISTS `measurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `measurements` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_metric` int(10) unsigned NOT NULL,
  `id_unit` int(10) unsigned NOT NULL,
  `amount` decimal(16,4) unsigned NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `measurements`
--

LOCK TABLES `measurements` WRITE;
/*!40000 ALTER TABLE `measurements` DISABLE KEYS */;
INSERT INTO `measurements` VALUES (1,1,1,37.1200,'2019-04-18 21:53:01'),(2,1,1,36.2400,'2019-04-18 21:53:01'),(3,1,1,38.7100,'2019-04-18 21:53:01'),(4,1,1,35.2900,'2019-04-18 21:53:01'),(5,1,1,38.8100,'2019-04-18 21:53:01'),(6,1,1,37.4100,'2019-04-18 21:53:01'),(7,1,1,36.5600,'2019-04-18 21:53:01'),(8,1,1,37.0500,'2019-04-18 21:53:01');
/*!40000 ALTER TABLE `measurements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metrics`
--

DROP TABLE IF EXISTS `metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metrics` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metrics`
--

LOCK TABLES `metrics` WRITE;
/*!40000 ALTER TABLE `metrics` DISABLE KEYS */;
INSERT INTO `metrics` VALUES (1,'humidity'),(2,'temperature'),(3,'precipitations'),(4,'voltage');
/*!40000 ALTER TABLE `metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization_attributes`
--

DROP TABLE IF EXISTS `organization_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization_attributes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_organization` int(10) unsigned NOT NULL,
  `id_attribute` int(10) unsigned NOT NULL,
  `description` varchar(256) NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_organization` (`id_organization`),
  KEY `id_attribute` (`id_attribute`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_attributes`
--

LOCK TABLES `organization_attributes` WRITE;
/*!40000 ALTER TABLE `organization_attributes` DISABLE KEYS */;
INSERT INTO `organization_attributes` VALUES (1,1,1,'Acme Corporation',1,'2019-04-18 21:53:01',NULL),(2,1,5,'20833 Stevens Creek Blvd, Cupertino, CA 95014, USA',1,'2019-04-18 21:53:01',NULL),(3,1,7,'+1 (408) 996-1010',1,'2019-04-18 21:53:01',NULL),(4,2,1,'Globex Corporation',1,'2019-04-18 21:53:01',NULL),(5,2,5,'20955 Alves Dr, Cupertino, CA 95014, USA',1,'2019-04-18 21:53:01',NULL),(6,2,7,'+1 (408) 725-3707',1,'2019-04-18 21:53:01',NULL),(7,3,1,'Soylent Corp',1,'2019-04-18 21:53:01',NULL),(8,3,5,'20999 Stevens Creek Fwy, Cupertino, CA 95014, USA',1,'2019-04-18 21:53:01',NULL),(9,3,7,'+1 (408) 257-6884',1,'2019-04-18 21:53:01',NULL);
/*!40000 ALTER TABLE `organization_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization_products`
--

DROP TABLE IF EXISTS `organization_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_organization` int(10) unsigned NOT NULL,
  `id_product` int(10) unsigned NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_organization.id_product` (`id_organization`,`id_product`),
  KEY `id_product` (`id_product`),
  KEY `id_organization` (`id_organization`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_products`
--

LOCK TABLES `organization_products` WRITE;
/*!40000 ALTER TABLE `organization_products` DISABLE KEYS */;
INSERT INTO `organization_products` VALUES (1,1,1,1,'2019-04-18 21:53:01',NULL),(2,1,2,1,'2019-04-18 21:53:01',NULL),(3,1,3,1,'2019-04-18 21:53:01',NULL),(4,2,1,1,'2019-04-18 21:53:01',NULL),(5,2,2,1,'2019-04-18 21:53:01',NULL),(6,3,1,1,'2019-04-18 21:53:01',NULL),(7,3,3,1,'2019-04-18 21:53:01',NULL);
/*!40000 ALTER TABLE `organization_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization_users`
--

DROP TABLE IF EXISTS `organization_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_organization` int(10) unsigned NOT NULL,
  `id_user` int(10) unsigned NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_organization.id_user` (`id_organization`,`id_user`),
  KEY `id_organization` (`id_organization`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_users`
--

LOCK TABLES `organization_users` WRITE;
/*!40000 ALTER TABLE `organization_users` DISABLE KEYS */;
INSERT INTO `organization_users` VALUES (1,1,1,1,'2019-04-18 21:53:01',NULL),(2,1,2,1,'2019-04-18 21:53:01',NULL),(3,1,3,1,'2019-04-18 21:53:01',NULL),(4,2,4,1,'2019-04-18 21:53:01',NULL),(5,2,5,1,'2019-04-18 21:53:01',NULL),(6,3,6,1,'2019-04-18 21:53:01',NULL),(7,3,7,1,'2019-04-18 21:53:01',NULL);
/*!40000 ALTER TABLE `organization_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organizations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,1,'2019-04-18 21:53:01',NULL),(2,1,'2019-04-18 21:53:01',NULL),(3,1,'2019-04-18 21:53:01',NULL);
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` tinyint(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'owner'),(2,'admin'),(3,'editor'),(4,'readonly');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` tinyint(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Weather Station'),(2,'Smart Bulb'),(3,'Smart Lock'),(4,'Humidity Spear'),(5,'Accelerometer');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `units` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  `unit` varchar(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'percentage','%'),(2,'celsius','Cº'),(3,'millivolt','mV');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_attributes`
--

DROP TABLE IF EXISTS `user_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_attributes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(10) unsigned NOT NULL,
  `id_attribute` int(10) unsigned NOT NULL,
  `description` varchar(256) NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_attribute` (`id_attribute`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_attributes`
--

LOCK TABLES `user_attributes` WRITE;
/*!40000 ALTER TABLE `user_attributes` DISABLE KEYS */;
INSERT INTO `user_attributes` VALUES (1,1,1,'John Doe',1,'2019-04-18 21:53:01',NULL),(2,1,3,'john.doe@gmail.com',1,'2019-04-18 21:53:01',NULL),(3,1,4,'9959a1c23dcc98a7b3ca78dfd777d7ad',1,'2019-04-18 21:53:01',NULL),(4,2,1,'Mario Speedwagon',1,'2019-04-18 21:53:01',NULL),(5,2,3,'mario.speedwagon@gmail.com',1,'2019-04-18 21:53:01',NULL),(6,2,4,'fbbaad48686fa8f3a6e1d0c92b301da9',1,'2019-04-18 21:53:01',NULL),(7,3,1,'Anna Sthesia',1,'2019-04-18 21:53:01',NULL),(8,3,3,'anna.sthesia@gmail.com',1,'2019-04-18 21:53:01',NULL),(9,3,4,'433572aec18e8f74f4ddd2ba72b69144',1,'2019-04-18 21:53:01',NULL),(10,3,1,'Paul Molive',1,'2019-04-18 21:53:01',NULL),(11,3,3,'paul.molive@gmail.com',1,'2019-04-18 21:53:01',NULL),(12,3,4,'c4e3013d6faa2ebaf904a76140e7050e',1,'2019-04-18 21:53:01',NULL),(13,3,1,'Anna Mull',1,'2019-04-18 21:53:01',NULL),(14,3,3,'anna.mull@gmail.com',1,'2019-04-18 21:53:01',NULL),(15,3,4,'039ac5d5fb2ff5039e57a158a6080bed',1,'2019-04-18 21:53:01',NULL),(16,3,1,'Gail Forcewind',1,'2019-04-18 21:53:01',NULL),(17,3,3,'gail.forcewind@gmail.com',1,'2019-04-18 21:53:01',NULL),(18,3,4,'513a0fc87d6aa8625cc2b6b09a85563e',1,'2019-04-18 21:53:01',NULL),(19,3,1,'Paige Turner',1,'2019-04-18 21:53:01',NULL),(20,3,3,'paige.turner@gmail.com',1,'2019-04-18 21:53:01',NULL),(21,3,4,'b5bef18676056fea7f2e4b727bf8b91f',1,'2019-04-18 21:53:01',NULL),(22,3,1,'Bob Frapples',1,'2019-04-18 21:53:01',NULL),(23,3,3,'bob.frapples@gmail.com',1,'2019-04-18 21:53:01',NULL),(24,3,4,'4d1a3a7de62d988b6a0f00748c54c375',1,'2019-04-18 21:53:01',NULL);
/*!40000 ALTER TABLE `user_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(10) unsigned NOT NULL,
  `id_permission` int(10) unsigned NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_user.id_permission` (`id_user`,`id_permission`),
  KEY `id_user` (`id_user`),
  KEY `id_permission` (`id_permission`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES (1,1,1,1,'2019-04-18 21:53:01',NULL),(2,2,2,1,'2019-04-18 21:53:01',NULL),(3,3,3,1,'2019-04-18 21:53:01',NULL),(4,4,1,1,'2019-04-18 21:53:01',NULL),(5,5,3,1,'2019-04-18 21:53:01',NULL),(6,6,1,1,'2019-04-18 21:53:01',NULL),(7,7,3,1,'2019-04-18 21:53:01',NULL);
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'2019-04-18 21:53:01',NULL),(2,1,'2019-04-18 21:53:01',NULL),(3,1,'2019-04-18 21:53:01',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-18 21:54:26
