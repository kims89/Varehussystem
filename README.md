# Varehussystem
Enkel varehussystem med produktoppslag og sporingsmuligheter. Dette er utelukkende et hobbyprosjekt.

## Formål
1. Lage et system hvor man enkelt kan legge inn varer ved hjelp av API til Prisjakt i en mongodb.
1. Holder oversikt over alle utleverte varer
1. La brukere følge med hvor varen befinner seg ved hjelp av enkel sporingsside.

## Bruk
1. [Last ned](https://github.com/kims89/Varehussystem/archive/master.zip) Varehussystemet.
1. Installer [MongoDB](https://docs.mongodb.com/manual/installation/) (Eventuelt bruk ekstern mongodb som f.eks. Skytjenester osv) og [Node](https://nodejs.org/en/download)
1. Legg til alle konfigurasjoner i config/adminInfo.js og eventuelt config/mail.js (Om du skal benytte SMTP)
1. Kjør først "npm install" deretter "node app" i katalogen hvor app.js befinner seg og gå til [Localhost:8080](http://localhost:8080/). Husk og endre adminInfo.js om et domene skal benyttes.

Lykke til!

## Skjermbilde
![image](https://raw.githubusercontent.com/kims89/Varehussystem/master/Screenshots/Screenshot%20at%20sep.%2016%2016-32-06.png)
![image](https://raw.githubusercontent.com/kims89/Varehussystem/master/Screenshots/Screenshot%20at%20sep.%2016%2016-35-34.png)
![image](https://raw.githubusercontent.com/kims89/Varehussystem/master/Screenshots/Screenshot%20at%20sep.%2016%2016-33-21.png)
![image](https://raw.githubusercontent.com/kims89/Varehussystem/master/Screenshots/Screenshot%20at%20sep.%2016%2016-34-14.png)
![image](https://raw.githubusercontent.com/kims89/Varehussystem/master/Screenshots/Screenshot%20at%20sep.%2016%2016-34-30.png)
![image](https://raw.githubusercontent.com/kims89/Varehussystem/master/Screenshots/Screenshot%20at%20sep.%2016%2016-34-53.png)

## Oppdatering
1. 7. juni 2019: Oppdatert alle tillegg bortsett fra Mongodb. Oppdatert grensesnittet litt.
1. 31. August 2019: Pusset opp litt funksjonalitet. Lagt til mulighet å sette opp spesielle datautstyrsnr til utlevert produkt. Er også lagt til en konfigurasjonsside.
