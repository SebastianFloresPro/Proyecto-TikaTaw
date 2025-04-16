CREATE DATABASE tiki;

CREATE TABLE Usuario(
    ID int NOT NULL,
    Nombre varchar(255),
    Edad int,
    Telefono varchar(255),
    Correo varchar (255),
    Clave varchar(255),
    PRIMARY KEY(ID)
);

INSERT INTO usuario(id, nombre, edad, telefono, correo, clave)
VALUES(01,'Sandra', 21, '956487812', 'Sandra02@usuario.com', 'Sandra!!148');

INSERT INTO usuario(id, nombre, edad, telefono, correo, clave)
VALUES(02,'Rafael', 34, '958412336', 'Rafael025@usuario.com', 'Rafa!!27')



CREATE TABLE Mascota(
    ID int NOT NULL,
    Nombre varchar(255),
    Tamano float,
    Especie varchar(255),
    Edad int,
    Genero varchar(255),
    PRIMARY KEY(ID)
);

INSERT INTO MASCOTA(ID, NOMBRE, TAMANO, ESPECIE, EDAD, GENERO)
VALUES(01,'Soren', 32.47,'Perro', 4, 'Macho');

INSERT INTO MASCOTA(ID, NOMBRE, TAMANO, ESPECIE, EDAD, GENERO)
VALUES(02,'Moxy', 17.2,'Gato', 2, 'Hembra');



CREATE TABLE Soli_Adopt(
    ID int,
    MASCOTAID int,
    ADOPTANTEID int,
    FECHA DATE,
    ESTADO varchar(255),
    PRIMARY KEY(ID),
    FOREIGN KEY(MASCOTAID) REFERENCES MASCOTA(ID),
    FOREIGN KEY(ADOPTANTEID) REFERENCES USUARIO(ID)
    )

INSERT INTO SOLI_ADOPT(ID, MASCOTAID, ADOPTANTEID, FECHA, ESTADO)
VALUES(1,1,2,DATE '2024-07-21', 'Aceptado');


INSERT INTO SOLI_ADOPT(ID, MASCOTAID, ADOPTANTEID, FECHA, ESTADO)
VALUES(2,1,1,DATE '2024-07-21', 'Rechazado');