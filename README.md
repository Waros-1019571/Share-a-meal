## Naam
De naam van dit project is Share-a-Meal.
## Beschrijving
Dit is de opdracht voor programmeren 4 waar UC-201 tot en met UC-206 zijn uitgewerkt van de Share-a-Meal casus.
## Requirements
Voor deze applicatie is nodig:
- Node.JS 16
- MySQL
## Installatie
1. Installeer de dependencies met het commando 'npm i'
2. Deploy het databasescript 'share-a-meal.sql' naar de MySQL-database die gebruikt wordt
3. Voer in het bestand '.env' de volgende properties in voor de MySQL-database: "DB_HOST", "DB_PORT", "DB_USER", "DB_DATABASE" en "DB_PASSWORD"
4. Voer in het bestand '.env' de property "PORT" in om de port van de applicatie te bepalen, port forward deze om de applicatie beschikbaar te maken op het internet
5. Run de applicatie met het commando 'node index.js'
6. De applicatie is aan te roepen door middel van de Postman collection die in de repository zit
## Testen
1. Installeer de dependencies met het commando 'npm i'
2. Deploy het databasescript 'share-a-meal.sql' naar de MySQL-database die gebruikt wordt om te testen; dit is een andere database dan gebruikt wordt tijdens de installatie, sinds de database voor het testen steeds opgeruimd wordt na iedere unittest; deze moet de naam 'test' hebben!
3. Voer in het bestand '.env' de volgende properties in voor de MySQL-database: "DB_HOST", "DB_PORT", "DB_USER" en "DB_PASSWORD"
4. Run de tests met het commando 'npm run test'
## Deployment
Bij een push op de branch 'master' worden de unittests uitgevoerd en de applicatie gedeployd.
De applicatie is te vinden op [Railway](http://share-a-meal-waros-production.up.railway.app).
Deze is aan te roepen door middel van de Postman collection die in de repository zit, waarbij 'localhost:1337' vervangen moet worden met 'share-a-meal-waros-production.up.railway.app'.
