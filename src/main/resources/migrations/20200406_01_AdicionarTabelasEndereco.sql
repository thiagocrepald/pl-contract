
CREATE TABLE `COUNTRY` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(255) DEFAULT NULL,
  `ACRONYM` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE `STATE` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(255) DEFAULT NULL,
  `ACRONYM` VARCHAR(255) DEFAULT NULL,
  `ACTIVE` BIT(1) DEFAULT NULL,
  `COUNTRY_ID` BIGINT(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_STATE_COUNTRY_ID` (`COUNTRY_ID`),
  CONSTRAINT `FK_STATE_COUNTRY_ID` FOREIGN KEY (`COUNTRY_ID`) REFERENCES `COUNTRY` (`ID`)
);

CREATE TABLE `CITY` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(255) DEFAULT NULL,
  `ACTIVE` BIT(1) DEFAULT NULL,
  `STATE_ID` BIGINT(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_CITY_STATE_ID` (`STATE_ID`),
  CONSTRAINT `FK_CITY_STATE_ID` FOREIGN KEY (`STATE_ID`) REFERENCES `STATE` (`ID`)
);

CREATE TABLE `ADDRESS` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `STREET` VARCHAR(255) DEFAULT NULL,
  `NUMBER` VARCHAR(255) DEFAULT NULL,
  `ZIPCODE` VARCHAR(255) DEFAULT NULL,
  `DISTRICT` VARCHAR(255) DEFAULT NULL,
  `COMPLEMENT` VARCHAR(255) DEFAULT NULL,
  `CITY_ID` BIGINT(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_ADDRESS_CITY_ID` (`CITY_ID`),
  CONSTRAINT `FK_ADDRESS_CITY_ID` FOREIGN KEY (`CITY_ID`) REFERENCES `CITY` (`ID`)
);
