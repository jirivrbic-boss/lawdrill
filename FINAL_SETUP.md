# Finální Setup - Aby vše fungovalo pro všechny uživatele

## 🚨 KRITICKÉ: Security Rules musí být publikované v Firebase Console

### Krok 1: Zkopírujte Security Rules

1. Otevřete soubor `firestore.rules` v projektu
2. **Zkopírujte CELÝ obsah** (všechny řádky)

### Krok 2: Publikujte v Firebase Console

1. Otevřete: https://console.firebase.google.com/
2. Projekt: **lawdrill-ca709**
3. **Firestore Database** → **Rules**
4. **SMAŽTE** veškerý obsah
5. **VLOŽTE** zkopírovaný obsah z `firestore.rules`
6. Klikněte **Publish**
7. Počkejte na "Rules published successfully"

### Krok 3: Ověřte

1. Otevřete aplikaci: https://lawdrill-git-main-jirivrbic-boss-projects.vercel.app
2. Zaregistrujte se nebo se přihlaste
3. ✅ Mělo by fungovat!

## 📝 Pro kámoše (uživatele)

**Stačí poslat:**
- URL: https://lawdrill-git-main-jirivrbic-boss-projects.vercel.app
- Text: "Zaregistruj se a můžeš začít používat!"

**Nepotřebují:**
- ❌ Rules Playground (to je jen pro vývojáře)
- ❌ Firebase Console přístup
- ❌ Instalaci čehokoliv
- ❌ Technické znalosti

## 🎯 Testovací sada

Pokud chcete vytvořit testovací sadu s textem o správních rozhodnutích:

1. V aplikaci se přihlaste
2. Otevřete Developer Console (F12)
3. Zadejte: `firebase.auth().currentUser?.uid`
4. Zkopírujte UID
5. Spusťte:
   ```bash
   DEMO_USER_ID=vaše-uid npx tsx scripts/create-demo-set.ts
   ```
6. V aplikaci klikněte na vytvořenou sadu
7. Otázky se vygenerují automaticky při prvním otevření

## ✅ Co funguje po správném nastavení

- ✅ Registrace nových uživatelů
- ✅ Přihlášení
- ✅ Vytváření sad
- ✅ Generování otázek
- ✅ Všechny 4 módy procvičování
- ✅ Statistiky a progress tracking

## ❌ Pokud to stále nefunguje

1. **Zkontrolujte Security Rules:**
   - Firebase Console → Firestore → Rules
   - Měly by být vidět pravidla z `firestore.rules`
   - Pokud ne, zkopírujte je znovu a publikujte

2. **Zkontrolujte Authentication:**
   - Firebase Console → Authentication → Sign-in method
   - Email/Password musí být **Enabled**

3. **Zkontrolujte Firestore:**
   - Firebase Console → Firestore Database → Data
   - Měly by se vytvářet dokumenty při registraci

4. **Zkontrolujte konzoli prohlížeče:**
   - Otevřete Developer Console (F12)
   - Zkontrolujte chyby
   - Pokud vidíte "permission-denied", Security Rules nejsou správně nastavené

## 📞 Pro podporu

Pokud problém přetrvává, zkontrolujte:
- `CRITICAL_FIX.md` - rychlá oprava
- `DEBUG_SECURITY_RULES.md` - diagnostika
- `TEST_RULES.md` - testování Rules
