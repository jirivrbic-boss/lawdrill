# Rychlá Oprava - Permission Denied Chyba

## ⚠️ KRITICKÉ: Aktualizujte Security Rules v Firebase Console

Chyba "permission-denied" znamená, že Security Rules v Firebase Console **nejsou aktualizované** nebo **nejsou správně nastavené**.

## ✅ KROK 1: Zkopírujte Security Rules

1. Otevřete soubor `firestore.rules` v tomto projektu
2. **Zkopírujte CELÝ obsah** (všechny řádky od začátku do konce)

## ✅ KROK 2: Vložte do Firebase Console

1. Otevřete: https://console.firebase.google.com/
2. Vyberte projekt: **lawdrill-ca709**
3. V levém menu klikněte na: **Firestore Database**
4. Klikněte na záložku: **Rules** (nahoře)
5. **SMAŽTE** veškerý obsah v editoru
6. **VLOŽTE** zkopírovaný obsah z `firestore.rules`
7. Klikněte na tlačítko: **Publish** (vpravo nahoře)
8. Počkejte na potvrzení: "Rules published successfully"

## ✅ KROK 3: Ověřte v Aplikaci

1. Obnovte stránku v prohlížeči (F5 nebo Cmd+R)
2. Zkuste znovu načíst sadu
3. ✅ Mělo by to fungovat bez chyby "permission-denied"

## 🔍 Ověření, že Rules jsou správně nastavené

Po publikování rules by měly být vidět tyto pravidla:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /sets/{setId} {
      allow read: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.ownerId == request.auth.uid;
      ...
    }
  }
}
```

## ❌ Pokud to stále nefunguje:

1. **Zkontrolujte, že jste přihlášeni:**
   - V Developer Console zadejte: `localStorage`
   - Měli byste vidět Firebase auth token

2. **Zkontrolujte ownerId v dokumentu:**
   - Firebase Console → Firestore Database → Data
   - Najděte kolekci `sets` → najděte vaši sadu
   - Zkontrolujte, že pole `ownerId` obsahuje vaše User ID
   - User ID najdete v: Authentication → Users → váš e-mail → UID

3. **Zkontrolujte, že User ID se shoduje:**
   - V aplikaci: Developer Console → zadejte: `firebase.auth().currentUser.uid`
   - V Firebase Console: Authentication → Users → váš UID
   - Měly by být stejné!

## 📝 Poznámka

Security Rules v souboru `firestore.rules` se **NEAKTUALIZUJÍ automaticky**. Musíte je vždy ručně zkopírovat do Firebase Console a publikovat.
