/**
 * Skript pro vytvoření demo/testovací sady
 * Spustit: npx tsx scripts/create-demo-set.ts
 * 
 * POZOR: Musíte být přihlášeni v aplikaci a zkopírovat své User ID
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQpDBYP89uTo7kzhiSLwLMV_onLls6-t0",
  authDomain: "lawdrill-ca709.firebaseapp.com",
  projectId: "lawdrill-ca709",
  storageBucket: "lawdrill-ca709.firebasestorage.app",
  messagingSenderId: "468691257796",
  appId: "1:468691257796:web:fb298dae8f52b01c323c91",
  measurementId: "G-X8GSVB7WTF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const demoText = `Správní rozhodnutí

Celé řízení můžeme rozdělit do několika stádií, která na sebe relativně navazují a jejich výsledkem je rozhodnutí ve věci, které je předmětem řízení, tzv. meritorní rozhodnutí. 

Výsledkem celého řízení, které chápeme jako správní proces, je rozhodnutí ve věci (věcech) neboli vydání individuálního správního aktu. Jedná se tedy o postup správních orgánů, jehož účelem je vydání rozhodnutí v určité konkrétní věci (věcech) pro určitou konkrétní osobu nebo osoby. 

Charakteristickým rysem SR je pak jeho autoritativnost a závaznost, které spolu úzce souvisí. SR jako správní akt je závazný nejen pro účastníky řízení, ale i pro samotný SO, který ho vydal. Dojde-li k vydání nesprávného SR, je SO povinen ho opravit, jakmile se o tom dozví. 

Dalším výrazným rysem je i jeho vynutitelnost, pokud je výrokem rozhodnutí stanovena určitá povinnost. 

SR představuje akt aplikace norem správního práva při výkonu VS. SŘ neposkytuje žádnou definici SR!!! 

POJEM SPRÁVNÍ ROZHODNUTÍ - jedná se o AKT vydaný SO jako výsledek správního řízení, jímž se v určité věci zakládají, mění nebo ruší práva nebo povinnosti jmenovitě určené osoby (konstitutivní akt) nebo jímž se v určité věci prohlašuje, že taková osoba práva nebo povinnosti má nebo nemá (deklaratorní akt). 

Jinak řečeno, správní rozhodnutí je rozhodnutím v konkrétní věci vůči konkrétním osobám. 

Požadavky na každé SR: 
- SR musí být v souladu s právními předpisy a mezinárodními smlouvami, které jsou součástí českého právního řádu, 
- SR mohou vydávat pouze takové orgány, které jsou k jejich vydávání kompetenční,
- SR musí vycházet ze skutkového stavu věci, o němž nejsou důvodné pochybnosti,
- SR musí obsahovat předepsané obsahové a formální náležitosti a musí být jasné a přesvědčivé nejen pro účastníky správního řízení, ale i pro ostatní orgány a další osoby.

FORMY SPRÁVNÍHO ROZHODNUTÍ:
a) meritorní rozhodnutí = individuální správní akt, kterým se rozhoduje v konkrétní věci vůči konkrétnímu adresátovi. SR vyvolává právně závazné důsledky pro FO a PO a stanovuje nebo potvrzuje konkrétní práva a povinnosti. Rozhodnutí ve věci, která je předmětem řízení. 
b) procesní správní rozhodnutí = kterým se upravuje vedení řízení, případně se zajišťuje jeho průběh a účel, zpravidla nazývané „usnesení". 

Usnesením rozhoduje správní orgán pouze v případech stanovených zákonem (zatímco ve všech ostatních případech rozhoduje rozhodnutím), například usnesením správní orgán rozhoduje: 
· § 56 ustanovení znalce,
· § 64 přerušení řízení,
· § 66 zastavení řízení, 
· § 16 ustanovení tlumočníka, 
· § 13 dožádání, 
· § 28 rozhodnutí v pochybnostech o tom, zda osoba je či není účastníkem řízení a další. 

Konečně usneseními jsou též: exekuční výzva (výzva povinného ke splnění nepeněžité povinnosti), exekuční příkaz (nařizuje správní orgán k vymožení nepeněžité povinnosti). 

Důležité je vědět, že správní řád stanoví pravidla, jakou formou rozhoduje správní orgán v konkrétních případech. 

ZÁKLADNÍ ČLENĚNÍ SPRÁVNÍCH ROZHODNUTÍ:
Z hlediska správního řízení lze správní rozhodnutí rozlišovat podle právních účinků na: 
a) konstitutivní správní rozhodnutí = jedná se o akty, které působí pro futuro a ex nunc, a které stanoví, že nadále má něco být. Například jde o rozhodnutí o udělení koncese, schválení, povolení, příkazy, stavební povolení apod. 
b) deklaratorní správní rozhodnutí = která zjišťují, že něco již bylo a zůstává i nadále právem. Například se jedná o různá vysvědčení, průkazy, osvědčení. Příkladem deklaratorního rozhodnutí je také listina o udělení státního občanství, podle zákona o státním občanství. 

DALŠÍ ČLENĚNÍ SR JE Z HLEDISKA PRÁVNÍ TEORIE:
a) správní rozhodnutí in personam = SR se vztahují na určitou osobu a jsou na určitou osobu vázány), 
b) správní rozhodnutí in rem = týkají se určité věci a prostřednictvím této věci jsou správní rozhodnutí závazná i pro právní nástupce takových osob.

ZVLÁŠTNÍ FORMY ROZHODNUTÍ:
A) PŘÍKAZ – jde o případy, kdy SO skutkové zjištění považuje za dostatečné, aniž by proběhlo řádné správní řízení v celém plném rozsahu. V poučení SO uvede, v jaké lhůtě lze podat odpor, od kterého dne se tato lhůta počítá a u kterého SO se odpor podává.  
B) DOKLAD – má charakter deklaratorního správního aktu (např. vydávání řidičských průkazů podle zákona o provozu na pozemních komunikacích či zbrojních průkazů podle zákona o zbraních. O vydání dokladu se učiní záznam do spisu a obsahuje náležitosti podle § 67 odst. 2 SŘ. 

NÁLEŽITOSTI SPRÁVNÍHO ROZHODNUTÍ:
Každé správní rozhodnutí (ať již má jakoukoliv formu) musí nutně mít řádné obsahové a formální náležitosti. 

Až na výjimky se správní rozhodnutí zásadně vydává v písemné formě. Výjimečně, kdy to zákon stanoví, se písemně nevyhotovuje ( § 151 či § 72 SŘ). Rovněž v případech, kdy správní orgán zcela vyhoví žádosti o přiznání práva – lze místo písemného vyhotovení rozhodnutí vydat DOKLAD, o čemž se vyhotoví záznam do spisu. 

OBSAHOVÉ NÁLEŽITOSTI:
- v § 68 SŘ se stanovuje obligatorně obsahové náležitosti: 
1) výroková část, 
2) odůvodnění, 
3) poučení účastníků.

1) VÝROKOVÁ ČÁST ROZHODNUTÍ – výrok je „jádrem" celého rozhodnutí a určuje účastníkům řízení konkrétní práva a povinnosti. Obsahuje: 
· jeden nebo více výroků,
· označení účastníků a jejich zástupců – u FO (jméno, příjmení, dat. narození, místo trv. pobytu), u PO (název a sídlo), 
· odkaz na právní ustanovení, podle kterého bylo rozhodováno,
· rozhodnutí o povinnosti nahradit náklady řízení, 
· pokud se ukládá účastníkovi řízení povinnost k plnění – stanoví SO ve výroku správního rozhodnutí též = přiměřenou lhůtu, 
· při ukládání sankce za správní delikt musí být ve výroku rozhodnutí obsažen popis skutku (místo, čas a způsob spáchání)
· POUZE VE VÝROKU SPRÁVNÍHO ROZHODNUTÍ LZE AUTORITATIVNĚ ZAKLÁDAT, MĚNIT, RUŠIT NEBO AUTORITATIVNĚ STVRZOVAT PRÁVA NEBO POVINNOSTI.
· POUZE VÝROK NABÝVÁ PRÁVNÍ MOCI A JE VYKONATELNÝ !!!! 

2) ODŮVODNĚNÍ – SO v odůvodnění vždy stručně, konkrétně, jasně a srozumitelně uvede:
· důvody výroku nebo výroků rozhodnutí,
· SO uvést, jak se vypořádal se všemi důkazy, návrhy a námitkami účastníků,
· jakými úvahami se řídil při výkladu právních předpisů,
· argumenty proč právě SO rozhodl, tak jak rozhodl a proč právě tímto způsobem, 
· úvahy, které vedly k uložení sankce v konkrétní výši (pokud SO ukládá sankci),
· odůvodnění nesmí vést k žádným pochybnostem !!!! 
· skutečnosti obsažené v odůvodnění SR slouží účastníkovi řízení k úvaze, zda SR napadnout opravnými prostředky !!! 
· odůvodnění rozhodnutí je jedním z prostředků, jimiž je zjišťována přesvědčivost přijatého rozhodnutí !!! 

3) POUČENÍ – poučení o opravném prostředku je poslední obligatorní částí rozhodnutí. Obsahuje údaj, zda je rozhodnutí konečné nebo zda lze proti němu podat odvolání (rozklad): 
· ke kterému konkrétnímu SO podat odvolání (rozklad), 
· v jaké lhůtě, a 
· od kterého dne se tato lhůta počítá, a
· u kterého SO se odvolání (rozklad) podává.
- POKUD ODVOLÁNÍ NEMÁ ODKLADNÝ ÚČINEK (SUSPENZIVNÍ), MUSÍ SE UVÉST I TATO SKUTEČNOST
- poučení se týká všech účastníků správního řízení. 

FORMÁLNÍ NÁLEŽITOSTI SPRÁVNÍHO ROZHODNUTÍ:
- písemné vyhotovení rozhodnutí musí obsahovat: 
· označení „rozhodnutí" nebo jiné označení stanovené zákonem (například usnesení, příkaz, exekuční výzva, exekuční příkaz),
· označení SO, který rozhodnutí vydal (úplný název),
· číslo jednací, 
· datum vyhotovení, 
· otisk úředního razítka, 
· jméno, příjmení, funkci nebo služební číslo a podpis oprávněné úřední osoby, 
· jména a příjmení (případně název) všech účastníků správního řízení, 
· podpis oprávněné úřední osoby je na stejnopisu možno nahradit doložkou „vlastní rukou" nebo zkratkou „v. r." u příjmení oprávněné úřední osoby, a doložkou „Za správnost vyhotovení:" s uvedením jména, příjmení a podpisu úřední osoby, která odpovídá za písemné vyhotovení rozhodnutí. 
- POKUD SE ÚČASTNÍK ŘÍZENÍ VZDÁ NÁROKU NA DORUČENÍ PÍSEMNÉHO VYHOTOVENÍ ROZHODNUTÍ – PÍSEMNÉ ROZHODNUTÍ SE ZAKLÁDÁ DO SPISU, ALE ÚČASTNÍKOVI SE NEZASÍLÁ

VADY SR:
Pro všechna SR včetně vadných platí tzv. PRESUMPCE SPRÁVNOSTI, tzn. že SR se považuje za bezvadné (vyvolává právní účinky), dokud není zákonem stanoveným způsobem shledáno neplatným (zrušeno). 

Vedle vadných rozhodnutí je třeba rozlišovat SR nicotná (nulitní), mluví se o absolutně zmatečných rozhodnutích, paktech, „procesních potratech" - jedná se o taková SR, jejichž vážné vady způsobují neexistenci od samého počátku, a proto se v jejich případě neuplatňuje presumpce správnosti (například rozhodnutí vydal SO, který nebyl vůbec příslušný nebo byla uložena taková povinnost, která je v rozporu se zákonem nebo ji nelze vůbec uskutečnit). Nicotnost se zjišťuje a prohlašuje kdykoliv z moci úřední, podnět mohou podat účastníci řízení. Prohlašuje SO nadřízený správnímu orgánu, který nicotné rozhodnutí vydal. 

Rozhodnutí, u které SO prohlásil nicotnost, má deklaratorní charakter a není proti němu přípustné odvolání. 

VLASTNOSTI SPRÁVNÍHO ROZHODNUTÍ:
Vlastnostmi SR jsou především: 
a) platnost 
b) právní moc
c) účinnost 
d) vykonatelnost 

ad a) platnost rozhodnutí znamená – SO projevil svoji vůli navenek, tedy je obsahem SR vázán (rozhodnutí bylo vyhlášeno (ústně prvnímu adresátovi) nebo jeho „stejnopis" byl doručen adresátovi do vlastních rukou). SR, které není platné, nemůže být pravomocné, ani účinné a ani vykonatelné !!!!! 

ad b) právní moc – Právní mocí rozumíme stav řízení, kdy je vydáno závazné a nezměnitelné rozhodnutí. Pravomocné rozhodnutí, které bylo oznámeno a proti němuž se nelze odvolat (podat rozklad). Je jím prvoinstanční rozhodnutí, proti němuž do 15 dnů od jeho oznámení nebylo podáno odvolání. 

Například: rozhodnutí bylo doručeno 1. 7. a patnáctidenní lhůta začíná 2. 7. a končí 16. 7. Právní moc rozhodnutí, pokud není podáno odvolání, nastává následující den, tj. 17.7. Odvolání může podat účastník řízení ještě poslední den lhůty, tj. podle tohoto případu dne 16.7., a tím způsobí, že rozhodnutí nenabude právní moci. 

Můžeme odlišovat materiální a formální právní moc. Formální právní moc je nezbytným předpokladem přezkumného řízení i obnovy řízení (viz řádné a mimořádné opravné prostředky).
Datum nabytí právní moci je třeba vyznačit do pravého horního rohu písemného vyhotovení rozhodnutí a do protokolu o projednávané věci.  

ad c) účinnost – SR již vyvolává zamyšlené právní důsledky navenek. Účinnost správního aktu může nastat právní mocí rozhodnutí. U některých rozhodnutí zaniká též smrtí nebo zánikem adresáta, u jiných zánikem věci, které se rozhodnutí týká. 

ad d) vykonatelnost – pokud SR ukládá plnění povinnosti, může být vynuceno státní mocí, je tedy vynutitelné, vymahatelné. Neukládá-li SR povinnost plnění, rozumí se obvykle vykonatelností jeho účinnost. 

Rozhodnutí je vykonatelné, jestliže se nelze proti němu odvolat nebo jestliže odvolání nemá odkladný účinek. Jeho vymahatelnost nastává současně s jeho právní mocí. 

DOLOŽKA PRÁVNÍ MOCI A DOLOŽKA VYKONATELNOSTI:
SO, který rozhodl v posledním stupni vyznačí na originále rozhodnutí, jenž je součástí spisu, právní moc nebo vykonatelnost rozhodnutí. Tato právní skutečnost se osvědčuje formou buď razítka, nebo rukopisné poznámky.  

Doložka obsahuje podpis toho, kdo ji činil, a datum, kde byla učiněna. 

Každý účastník řízení má právo požádat SO prvního stupně, aby mu na stejnopisu rozhodnutí, které mu bylo doručeno, vyznačil doložku právní moci a vykonatelnosti. 

LHŮTY PRO VYDÁNÍ ROZHODNUTÍ:
V jednoduchých věcech je SO povinen rozhodnout bez zbytečného odkladu (ve věcech bez provádění důkazů a rozsáhlého objasňování věci), jedná se o případy, kdy je možné rozhodnout na základě dokladů předložených účastníkem řízení. 

Nelze-li vydat rozhodnutí bezodkladně, je SO povinen vydat rozhodnutí ve věci do 30 dnů od zahájení řízení, nestanoví-li zvláštní předpis jinak. Jde o případy, kdy je nutné provedení dožádání, zpracování znaleckého posudku nebo doručení písemnosti do ciziny. 

Některé zvláštní právní předpisy pak mají odchylnou úpravu lhůt pro vydání rozhodnutí. 

Nevydá-li SO rozhodnutí ve stanovené lhůtě, lze usnesením lhůtu prodloužit max o 30 dnů (důvodem může být předvedení, nařízení ústního jednání). 

OZNÁMENÍ SPRÁVNÍHO ROZHODNUTÍ:
- doručením stejnopisu písemného vyhotovení rozhodnutí účastníkům řízení do vlastních rukou, 
- ústním vyhlášením (pokud se účastník vzdá nároku na doručení písemného vyhotovení),
- doručením na elektronickou adresu, 
- doručením veřejnou vyhláškou. 

Jestliže se nároku na doručení písemného vyhotovení rozhodnutí vzdají všichni účastníci řízení, správní úřad pouze učiní záznam do spisu. 

Účastníci řízení se mohou vzdát svého práva na oznamování všech rozhodnutí vydaných v řízení. 

OPRAVNÉ PROSTŘEDKY:
ŘÁDNÉ A MIMOŘÁDNÉ OPRAVNÉ PROSTŘEDKY 

ŘÁDNÉ = odvolání, rozklad a odpor. 
MIMOŘÁDNÉ = přezkumné řízení, obnova řízení a nové rozhodnutí 

Řádné opravné prostředky – přichází v úvahu v době dokud předmětné SR nenabylo právní moci. Jakmile SR právní moci již nabylo, nelze proti nim úspěšně řádné opravné prostředky uplatnit. 

Mimořádné opravné prostředky – přichází v úvahu zásadně proti SR již pravomocným!!! Prakticky proti takovým SR, které již nelze napadnout řádnými opravnými prostředky. 

Včas podané odvolání má zpravidla suspenzivní (odkladný) a současně i devolutivní účinek. Suspenzivní účinek znamená, že dokud není o odvolání rozhodnuto, nenabývá právní moci a také není vykonatelné. 

Devolutivní účinek znamená, že rozhodování o podaném odvolání se přesouvá z původního orgánu prvního stupně na orgán instančně nadřízený. Odvolání se podává u orgánu, který SR napadené odvoláním vydal. 

Správní řád umožňuje, aby za určitých podmínek o odvolání rozhodl sám SO, který napadené rozhodnutí vydal, aniž by ho postupoval odvolacímu orgánu, tj. příslušnému SO rozhodovat ve druhém stupni. Jde o příklad autoremedury. 

O rozkladu rozhoduje vedoucí vždy příslušného ústředního orgánu státní správy, tj. ministr, nebo vedoucí jiného ústředního správního úřadu, a to na základě návrhu jím ustanovené rozkladové komise. Rozkladová komise má nejméně 5 členů. 

Přezkumné řízení – zahajováno výlučně z moci úřední. Zpravidla se vztahuje k rozhodnutím pravomocným. Jedná se o případy, kdy lze důvodně pochybovat o tom, že rozhodnutí je v souladu s právními předpisy. Zahájení přezkumu z vlastního podnětu nebo z jiného podnětu (jiný SO nebo také účastník). Pokud by SO po zahájení přezkumného řízení zjistil, že právní předpis porušen nebyl, řízení usnesením zastaví, poznamená se do spisu a účastníci řízení se o něm vhodným způsobem vyrozumí. Proti tomuto usnesení se nelze odvolat.`;

async function createDemoSet() {
  console.log("🌱 Vytváření demo sady...");

  // POZOR: Musíte zadat UID existujícího uživatele
  const ownerId = process.env.DEMO_USER_ID || "";
  
  if (!ownerId) {
    console.error("❌ Chyba: Nastavte DEMO_USER_ID environment proměnnou");
    console.log("Příklad: DEMO_USER_ID=your-uid npx tsx scripts/create-demo-set.ts");
    console.log("\n📝 Jak najít své User ID:");
    console.log("1. Otevřete aplikaci v prohlížeči");
    console.log("2. Otevřete Developer Console (F12)");
    console.log("3. Zadejte: firebase.auth().currentUser?.uid");
    console.log("4. Zkopírujte UID a použijte ho jako DEMO_USER_ID");
    process.exit(1);
  }

  try {
    // Vytvoření demo sady
    const setId = await addDoc(collection(db, "sets"), {
      ownerId,
      title: "Správní rozhodnutí",
      subject: "Správní právo",
      tags: ["správní právo", "rozhodnutí", "správní řád"],
      sourceBlocks: [
        {
          id: "demo-block-1",
          sourceType: "user_text",
          rawText: demoText.trim(),
          locationHint: "Správní řád - Správní rozhodnutí",
          importedAt: Timestamp.now(),
        },
      ],
      sourceVersion: 1,
      stats: {
        totalQuestions: 0,
        totalAttempts: 0,
        averageScore: 0,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Vytvořena demo sada: ${setId.id}`);
    console.log(`📝 Nyní můžete v aplikaci vygenerovat otázky z této sady.`);
    console.log(`🔗 URL: https://lawdrill-git-main-jirivrbic-boss-projects.vercel.app/dashboard/sets/${setId.id}`);
    console.log("\n💡 Tip: Po vytvoření sady klikněte na ni v dashboardu a pak klikněte na 'Vytvořit sadu a vygenerovat otázky'");

  } catch (error: any) {
    console.error("❌ Chyba při vytváření sady:", error.message);
    if (error.code === "permission-denied") {
      console.error("\n⚠️ PERMISSION DENIED!");
      console.error("Zkontrolujte:");
      console.error("1. Že jsou Security Rules publikované v Firebase Console");
      console.error("2. Že DEMO_USER_ID odpovídá vašemu User ID");
      console.error("3. Že jste přihlášeni v aplikaci");
    }
    process.exit(1);
  }
}

createDemoSet();
