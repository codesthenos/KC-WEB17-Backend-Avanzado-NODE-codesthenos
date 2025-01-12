# [FIRST-NPM-PACKAGE](https://github.com/codesthenos/FIRST-NPM-PACKAGE)

# [TEST-FIRST-NPM-PACKAGE](https://github.com/codesthenos/TEST-FIRST-NPM-PACKAGE)

# MICROSERVICIO DE CREACION DE THUMBNAILS

El microservicio en princpio lo implemente usando cote, pero he creado otro igual usando rabbitMQ y es el que he dejado funcionando, aunque cambiar usar ese por el de cote es muy facil, en los create y update product de la app y la api, al final de la funcion, decomentamos el uso de cote y comentamos el de rabbit y lo mismo con los imports

# Práctica del modulo Desarrollo backend avanzado con NODE impartido por Javier Miguel [**@jamg44**](https://github.com/jamg44) en KeepCoding

La práctica consiste en partiendo de la practica anterior, implementar los siguientes extras:

1. Internacionalización
2. Imagen en vez de url, un archivo con upload
3. API REST
4. OPCIONAL | Servicio de creacion de thumbnails en segundo plano
5. OPCIONAL | BONUS TRACK

## Internacionalización

Idiomas disponibles: INGLES y ESPAÑOL con selector en la home

No se internacionaliza la API REST

## Subir archivo con upload

En la creacion del producto, en vez de meter la imagen con input text usamos el upload

## API REST

Todos los endpoints de la API comienzan en `/api`
GET --> `/api/products` `/api/products/:productId`
POST --> `/api/products` `/api/login`
PUT --> `/api/products/:productId`
DELETE --> `/api/products/:productId`

Documentacion usando redoc o swagger o parecido

## OPTIONAL

Servicio de thumbnails y crear modulo publico de npm
