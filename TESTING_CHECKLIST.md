# Testovací Checklist - LawDrill

## ✅ Krok 1: Ověření Firebase Setup

### 1.1 Firebase Console - Security Rules
- [ ] Otevřete Firebase Console: https://console.firebase.google.com/
- [ ] Vyberte projekt: `lawdrill-ca709`
- [ ] Přejděte na: **Firestore Database** → **Rules**
- [ ] Zkopírujte obsah souboru `firestore.rules` z tohoto projektu
- [ ] Vložte do editoru v Firebase Console
- [ ] Klikněte na **Publish**
- [ ] Ověřte, že se rules úspěšně publikovaly (žádné chyby)

### 1.2 Firebase Console - Authentication
- [ ] Přejděte na: **Authentication** → **Sign-in method**
- [ ] Ověřte, že **Email/Password** je povoleno (Enabled)
- [ ] Pokud není, klikněte na **Email/Password** → **Enable** → **Save**

### 1.3 Firebase Console - Authorized Domains (volitelné pro OAuth)
- [ ] Přejděte na: **Authentication** → **Settings** → **Authorized domains**
- [ ] Ověřte, že je tam doména: `lawdrill-git-main-jirivrbic-boss-projects.vercel.app`
- [ ] Pokud není, přidejte ji kliknutím na **Add domain**

---

## ✅ Krok 2: Testování Autentizace

### 2.1 Registrace nového uživatele
- [ ] Otevřete aplikaci: `lawdrill-git-main-jirivrbic-boss-projects.vercel.app`
- [ ] Klikněte na **Registrovat se**
- [ ] Vyplňte e-mail a heslo (min. 6 znaků)
- [ ] Klikněte na **Registrovat se**
- [ ] ✅ **Očekávaný výsledek**: Přesměrování na `/dashboard` bez chyb
- [ ] Otevřete Developer Console (F12 nebo Cmd+Option+I)
- [ ] ✅ **Ověřte v konzoli**: Žádné chyby typu "permission-denied" nebo "toDate is not a function"

### 2.2 Přihlášení existujícího uživatele
- [ ] Odhlaste se (pokud jste přihlášeni)
- [ ] Klikněte na **Přihlásit se**
- [ ] Zadejte e-mail a heslo
- [ ] Klikněte na **Přihlásit se**
- [ ] ✅ **Očekávaný výsledek**: Přesměrování na `/dashboard` bez chyb

---

## ✅ Krok 3: Testování Dashboardu

### 3.1 Načítání sad
- [ ] Po přihlášení byste měli vidět dashboard
- [ ] ✅ **Očekávaný výsledek**: Stránka se načte, zobrazí se buď:
  - Seznam existujících sad (pokud nějaké máte)
  - Nebo zpráva "Zatím nemáte žádné sady"
- [ ] Otevřete Developer Console
- [ ] ✅ **Ověřte v konzoli**: Žádné chyby typu "permission-denied"
- [ ] Pokud vidíte chybu "permission-denied", vraťte se ke kroku 1.1

---

## ✅ Krok 4: Testování Vytváření Sady

### 4.1 Vytvoření sady s vlastním textem
- [ ] Na dashboardu klikněte na **+ Vytvořit novou sadu**
- [ ] Vyplňte formulář:
  - **Název sady**: "Test Sada"
  - **Předmět**: "Test"
  - **Štítky**: "test, demo"
  - **Zdroj**: Vyberte "Vložit text"
  - **Text**: Vložte alespoň 50 znaků textu (např. "Toto je testovací text pro vytvoření sady. Obsahuje více než padesát znaků, aby bylo možné vygenerovat otázky.")
- [ ] Klikněte na **Vytvořit sadu a vygenerovat otázky**
- [ ] ✅ **Očekávaný výsledek**: 
  - Stránka se přesměruje na `/dashboard/sets/[id]`
  - Zobrazí se detail sady s názvem "Test Sada"
  - Zobrazí se počet vygenerovaných otázek
- [ ] Otevřete Developer Console
- [ ] ✅ **Ověřte v konzoli**: Žádné chyby typu "permission-denied" nebo "undefined"
- [ ] Pokud vidíte chybu "Missing or insufficient permissions", vraťte se ke kroku 1.1

### 4.2 Vytvoření sady s importem ze ZakonyProLidi.cz
- [ ] Vytvořte novou sadu
- [ ] Vyberte **Import ze ZakonyProLidi.cz**
- [ ] Vložte URL (např. nějaký zákon z zakonyprolidi.cz)
- [ ] Klikněte na **Importovat**
- [ ] ✅ **Očekávaný výsledek**: Text se načte do textového pole
- [ ] Dokončete vytvoření sady
- [ ] ✅ **Očekávaný výsledek**: Sada se vytvoří stejně jako v kroku 4.1

---

## ✅ Krok 5: Testování Detailu Sady

### 5.1 Zobrazení detailu sady
- [ ] Na dashboardu klikněte na existující sadu
- [ ] ✅ **Očekávaný výsledek**: 
  - Zobrazí se detail sady s názvem, předmětem, štítky
  - Zobrazí se statistiky (počet otázek, pokusů, průměrné skóre)
  - Zobrazí se zdrojové texty
  - Zobrazí se 4 karty pro módy procvičování
- [ ] Otevřete Developer Console
- [ ] ✅ **Ověřte v konzoli**: Žádné chyby

### 5.2 Přehled otázek
- [ ] Na detailu sady scrollujte dolů
- [ ] ✅ **Očekávaný výsledek**: Zobrazí se seznam všech otázek s jejich typy a texty

---

## ✅ Krok 6: Testování Procvičování

### 6.1 Quiz mód
- [ ] Na detailu sady klikněte na kartu **Quiz**
- [ ] ✅ **Očekávaný výsledek**: 
  - Otevře se stránka procvičování
  - Zobrazí se první otázka s možnostmi A/B/C/D
  - Zobrazí se progress bar
- [ ] Vyberte odpověď
- [ ] Klikněte na **Další**
- [ ] Projděte všechny otázky
- [ ] Po poslední otázce klikněte na **Dokončit**
- [ ] ✅ **Očekávaný výsledek**: 
  - Zobrazí se výsledky s procentuálním skóre
  - Zobrazí se přehled všech otázek s označením správných/špatných odpovědí

### 6.2 Doplňovačka mód
- [ ] Vraťte se na detail sady
- [ ] Klikněte na kartu **Doplňovačka**
- [ ] ✅ **Očekávaný výsledek**: 
  - Zobrazí se otázka s vynechaným slovem (______)
  - Zobrazí se textové pole pro odpověď
- [ ] Vyplňte odpověď a dokončete procvičování

### 6.3 Pravda/Nepravda mód
- [ ] Vraťte se na detail sady
- [ ] Klikněte na kartu **Pravda/Nepravda**
- [ ] ✅ **Očekávaný výsledek**: 
  - Zobrazí se tvrzení
  - Zobrazí se dvě tlačítka: "Pravda" a "Nepravda"
- [ ] Vyberte odpověď a dokončete procvičování

### 6.4 Flashcards mód
- [ ] Vraťte se na detail sady
- [ ] Klikněte na kartu **Flashcards**
- [ ] ✅ **Očekávaný výsledek**: 
  - Zobrazí se otázka/pojem
  - Zobrazí se tlačítko "Zobrazit odpověď"
- [ ] Klikněte na "Zobrazit odpověď"
- [ ] ✅ **Očekávaný výsledek**: Zobrazí se odpověď

---

## ✅ Krok 7: Testování Nápovědy a Zdrojů

### 7.1 AI Nápověda
- [ ] Během procvičování klikněte na tlačítko **💡 Zobrazit nápovědu (AI)**
- [ ] ✅ **Očekávaný výsledek**: 
  - Zobrazí se žluté pole s AI vysvětlením
  - Tlačítko se změní na "💡 Nápověda zobrazena"

### 7.2 Zobrazení zdroje
- [ ] Během procvičování klikněte na tlačítko **📄 Zobrazit zdroj**
- [ ] ✅ **Očekávaný výsledek**: 
  - Zobrazí se alert/popup s přesným citátem ze zdroje
  - Zobrazí se locationHint (např. paragraf)

---

## ✅ Krok 8: Testování Statistik

### 8.1 Aktualizace statistik po procvičování
- [ ] Dokončete procvičování v libovolném módu
- [ ] Vraťte se na dashboard
- [ ] Klikněte na sadu, kterou jste právě procvičovali
- [ ] ✅ **Očekávaný výsledek**: 
  - Statistiky se aktualizovaly (počet pokusů se zvýšil)
  - Průměrné skóre se aktualizovalo

---

## 🔍 Řešení Problémů

### Chyba: "Missing or insufficient permissions"
**Řešení:**
1. Vraťte se ke kroku 1.1
2. Ověřte, že Security Rules jsou správně publikované v Firebase Console
3. Ověřte, že jste přihlášeni (zkontrolujte v konzoli, zda je `user` nastaven)

### Chyba: "toDate is not a function"
**Řešení:**
- Tato chyba by měla být opravena v nejnovější verzi kódu
- Ověřte, že máte nejnovější deploy na Vercel

### Chyba: "No document to update"
**Řešení:**
- Tato chyba by měla být opravena (používáme `setDoc` místo `updateDoc`)
- Ověřte, že máte nejnovější deploy na Vercel

### Aplikace se neustále načítá ("Načítání...")
**Řešení:**
1. Otevřete Developer Console
2. Zkontrolujte chyby v konzoli
3. Pokud vidíte chyby, postupujte podle řešení výše
4. Zkontrolujte, zda je uživatel přihlášený (v konzoli zadejte: `localStorage` nebo zkontrolujte Network tab)

---

## 📝 Poznámky k Testování

- Všechny kroky testujte v **produkčním prostředí** (Vercel deploy)
- Používejte **Developer Console** pro sledování chyb
- Pokud nějaký krok selže, zapište si přesnou chybovou zprávu z konzole
- Testujte s **různými uživateli** (vytvořte více testovacích účtů)
