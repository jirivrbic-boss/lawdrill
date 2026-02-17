# 🚨 KRITICKÁ OPRAVA - Permission Denied

## Problém

V konzoli vidíte:
- ✅ `getUserSets` funguje (načetlo 2 sady) - **list operace funguje**
- ❌ `getSet` selže s "permission-denied" - **get operace selže**

To znamená, že Security Rules v Firebase Console **nejsou správně nastavené** nebo **nejsou publikované**.

## ✅ ŘEŠENÍ - KROK ZA KROKEM

### KROK 1: Zkopírujte Security Rules

Otevřete soubor `firestore.rules` v tomto projektu a zkopírujte **CELÝ obsah** (všechny 58 řádků od začátku do konce).

### KROK 2: Otevřete Firebase Console

1. Jděte na: **https://console.firebase.google.com/**
2. Přihlaste se
3. Vyberte projekt: **lawdrill-ca709**

### KROK 3: Přejděte na Firestore Rules

1. V levém menu klikněte na **Firestore Database**
2. Klikněte na záložku **Rules** (nahoře)

### KROK 4: Vložte a publikujte Rules

1. **SMAŽTE** veškerý obsah v editoru Rules
2. **VLOŽTE** zkopírovaný obsah z `firestore.rules`
3. Klikněte na tlačítko **Publish** (modré tlačítko vpravo nahoře)
4. Počkejte na zprávu: **"Rules published successfully"**

### KROK 5: Ověřte v aplikaci

1. **Obnovte stránku** v prohlížeči (F5 nebo Cmd+R)
2. Zkuste kliknout na sadu
3. ✅ Mělo by to fungovat!

## 🔍 Ověření pomocí Rules Playground

Po publikování rules můžete ověřit, že fungují:

1. V Firebase Console → Firestore → Rules
2. Klikněte na **Rules Playground** (vpravo nahoře)
3. Nastavte:
   - **Location**: `sets/Cyku1c3RTzFZVzPkrtgG` (nebo ID vaší sady)
   - **Authenticated**: ✅ Ano
   - **User ID**: `YbXV2liqjqRhWTUyZAyhh2QJD8g1` (vaše User ID z konzole)
   - **Operation**: Read
4. Klikněte **Run**
5. ✅ Mělo by být: **"Simulated read allowed"**

Pokud je "denied", zkontrolujte:
- Že jste správně vložili Rules
- Že User ID se shoduje s ownerId v dokumentu

## 📋 Obsah firestore.rules (pro kontrolu)

Security Rules by měly obsahovat:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /sets/{setId} {
      allow read: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.ownerId == request.auth.uid;
      allow update: if isAuthenticated() 
                    && resource.data.ownerId == request.auth.uid
                    && request.resource.data.sourceBlocks == resource.data.sourceBlocks;
      allow delete: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
    }
    // ... další kolekce
  }
}
```

## ⚠️ DŮLEŽITÉ

Security Rules v souboru `firestore.rules` se **NEAKTUALIZUJÍ automaticky**. Musíte je vždy ručně zkopírovat do Firebase Console a publikovat!

Po každé změně v `firestore.rules` musíte:
1. Zkopírovat obsah
2. Vložit do Firebase Console
3. Kliknout **Publish**

## ❌ Pokud to stále nefunguje

1. **Zkontrolujte ownerId v dokumentu:**
   - Firebase Console → Firestore → Data → sets
   - Najděte sadu `Cyku1c3RTzFZVzPkrtgG`
   - Zkontrolujte pole `ownerId`
   - Mělo by obsahovat: `YbXV2liqjqRhWTUyZAyhh2QJD8g1`

2. **Zkontrolujte, že jste přihlášeni:**
   - V aplikaci byste měli vidět dashboard
   - Pokud ne, přihlaste se znovu

3. **Zkontrolujte konzoli:**
   - Otevřete Developer Console (F12)
   - Zkontrolujte, zda jsou další chyby
