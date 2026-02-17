# Ověření Security Rules - Krok za krokem

## ✅ KROK 1: Zkopírujte Security Rules

Otevřete soubor `firestore.rules` v tomto projektu a zkopírujte **CELÝ obsah** (všechny 58 řádků).

## ✅ KROK 2: Otevřete Firebase Console

1. Jděte na: https://console.firebase.google.com/
2. Přihlaste se
3. Vyberte projekt: **lawdrill-ca709**

## ✅ KROK 3: Přejděte na Firestore Rules

1. V levém menu klikněte na **Firestore Database**
2. Klikněte na záložku **Rules** (nahoře v sekci Firestore Database)

## ✅ KROK 4: Vložte Security Rules

1. **SMAŽTE** veškerý obsah v editoru Rules
2. **VLOŽTE** zkopírovaný obsah z `firestore.rules`
3. Měli byste vidět něco jako:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /sets/{setId} {
      allow read: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
      ...
    }
  }
}
```

## ✅ KROK 5: Publikujte Rules

1. Klikněte na tlačítko **Publish** (vpravo nahoře, modré tlačítko)
2. Počkejte na zprávu: "Rules published successfully" nebo "Rules published"
3. ✅ Hotovo!

## ✅ KROK 6: Ověřte v aplikaci

1. Obnovte stránku v prohlížeči (F5 nebo Cmd+R)
2. Zkuste kliknout na sadu
3. ✅ Mělo by to fungovat bez chyby "permission-denied"

## 🔍 Ověření pomocí Rules Playground

1. V Firebase Console → Firestore → Rules
2. Klikněte na **Rules Playground** (vpravo nahoře)
3. Nastavte:
   - **Location**: `sets/Cyku1c3RTzFZVzPkrtgG` (nebo ID vaší sady)
   - **Authenticated**: ✅ Ano
   - **User ID**: `YbXV2liqjqRhWTUyZAyhh2QJD8g1` (vaše User ID)
   - **Operation**: Read
4. Klikněte **Run**
5. ✅ Mělo by být: **"Simulated read allowed"**
6. ❌ Pokud je "denied", zkontrolujte:
   - Že jste správně vložili Rules
   - Že User ID se shoduje s ownerId v dokumentu

## ❌ Pokud to stále nefunguje

1. **Zkontrolujte ownerId v dokumentu:**
   - Firebase Console → Firestore → Data → sets
   - Najděte vaši sadu
   - Zkontrolujte pole `ownerId`
   - Mělo by obsahovat vaše User ID

2. **Zkontrolujte, že jste přihlášeni:**
   - V aplikaci byste měli vidět dashboard
   - Pokud ne, přihlaste se znovu

3. **Zkontrolujte konzoli prohlížeče:**
   - Otevřete Developer Console (F12)
   - Zkontrolujte, zda jsou nějaké další chyby
