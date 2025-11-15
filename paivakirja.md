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

