MatchScore päiväkirja:

27/10/2025: Aloitin projektin suunnittelun, rakensin projektinäkymän, 
johon yritin heti saada kaikki tarvittavat tiedostot. Yritin tehdä projektinäkymästä 
myös tarpeeksi ymmärrettävän. Heti alkuun tein home.tsx ja settings.tsx ja index.tsx
jossa on bottomNavigation. (Käytetty noin 2h)

30-31/10/2025: Aloitin Home.tsx teon, fetchasin football-data.org sivusta
tulevat matsit ja sain ne näkyviin etusivulle. Oli alussa ongelmia, koska
minun puhelin on Dark Mode, ja teksti oli automaattisesti musta, jonka takia en nähnyt
muutoksia joita tein, aiheutti vähän hämmennystä. Samalla oli myös ongelmia fetchaamisen
kanssa, koska en saanut näkyviin matseja vaan fetch palautti tyhjän listan.

02-03/11/2025: Yritin tehdä Home.tsx sivun hienommaksi, mutta en lukenut API dokumentaatiota
tarpeeksi hyvin, jolloin minulle tuli ongelmia vastaan. API ei toiminut koska minulla ei ollut
oikeuksia fetchata tiettyjä asioita joita halusin fetchata. Sain kuitenkin loggaamisella 
korjattua.

04/11/2025: Lisäsin results.tsx sivun, ja sain näkyviin matsejen lopputulokset. Oli melko
samanlaista niin kuin Home.tsx sivu.

07/11/2025: Tuli ongelmia vastaan, kun tein import { EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } from "@env";
minulle tuli error, joka aiheutti sen, että minun projekti ei aukenut enään. En ole vielä saanut korjattua
olen yrittänyt muutaman kerran.

15/11/2025: Sain korjattua ongelman, mutta käyttämällä tekoälyä, koska en löytänyt mistään tapaa korjata.
Tekoäly käski minua lisäämään env.d.ts tiedoston, ja sisälle declare module '@env' {
    export const EXPO_PUBLIC_FOOTBALL_DATA_API_KEY: string;
}, Tämä sitten korjasi koko projektin ja pääsin vihdoin jatkamaan.

16/11/2025: Lisäsin favorites.tsx tiedoston, jossa käytän ASyncStoragea. Ideana aluksi oli käyttää toista databasea, mutta
vähän tiukat kalenterin takia, tein tämän helpomman ja nopeamman tavan. Favorites.tsx page ei ole kuitenkaan
vielä valmis, en saa näkyviin matsit siellä vielä. Lisäsin myös home.tsx sivulle favorite star.

17/11/2025: Minulla on ollut vaikeuksia jatkaa projektia, koska minun API kutsuu jalkapallo ottelut, jotka ovat
vain joukkue jalkapalloa, mutta nyt viimeiset noin 10pv on ollut maajoukkue otteluita, joita ilmaisversio ei 
anna fetchata, joten en ole päässyt näkemään miltä minun results.tsx page näyttää kunnolla, enkä vielä tiedä
että toimiiko minun live.tsx page, viikonloppuna pitäisi näkyä kaikki, joten olen päättänyt tehdä standings.tsx 
tiedoston loppuun eli eri liigojen lohkot ja yritän saada home.tsx ja favorites.tsx sivut toimimaan ja kommunikoimaan
niiden välillä.

18/11/2025: Sain favorites.tsx ja home.tsx sivut toimimaan, mutta minulla on vieläkin ongelmia, koska välillä
matsi tulee näkyviin favorites.tsx sivulle, mutta välillä ei. Sitten minulla tuli myös toinen ongelma, että 
favorites.tsx sivussa lukee että ottelun tulos on null - null, joka näyttää ärsyttävältä.
Yritin lisätä kalenterin, jotta pääsisin näkemään enemmän otteluita ja jatkamaan results.tsx sivua, mutta 
en saanut sitä toimimaan jonkun takia. Päätin kuitenkin tehdä niin pitkälle, että ehtisin viikonloppuna tekemään
loppuun asti.

19/11/2025: Sain favorites.tsx ja home.tsx sivut toimimaan. Käytin tekoälyä tyylitykseen ja olen ihan iloinen miltä 
molemmat sivut näyttävät. Nyt odottelen viikonlopun otteluita jotta pääsisin näkemään, että toimiiko live.tsx sivu ja miltä
results.tsx sivu näyttää. Standings.tsx sivu on myös valmis, näkyy top 5 liigat ja mestarienliiga lohko.

