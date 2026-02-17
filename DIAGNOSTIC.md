# Diagnostika - Proč nefunguje načítání sady

## 🔍 Analýza problému

V konzoli vidím:
- ✅ `getUserSets` funguje (načetlo 2 sady)
- ❌ `getSet` selže s "permission-denied"

To znamená, že:
- **List operace** (dotaz na kolekci) funguje ✅
- **Get operace** (načtení jednotlivého dokumentu) selže ❌

## 🎯 Možné příčiny

### 1. Security Rules nejsou aktualizované v Firebase Console

**Nejpravděpodobnější příčina!**

Security Rules v souboru `firestore.rules` se **NEAKTUALIZUJÍ automaticky**. Musíte je ručně zkopírovat do Firebase Console.

**Řešení:**
1. Otevřete `firestore.rules` v projektu
2. Zkopírujte **CELÝ obsah**
3. Firebase Console → Firestore Database → Rules
4. Vložte obsah a klikněte **Publish**

### 2. OwnerId se neshoduje

**Ověření:**
1. V Developer Console zadejte:
   ```javascript
   // Zkontrolujte aktuálního uživatele
   console.log('User ID:', firebase.auth().currentUser?.uid);
   ```

2. V Firebase Console:
   - Firestore Database → Data → kolekce `sets`
   - Najděte sadu `Cyku1c3RTzFZVzPkrtgG`
   - Zkontrolujte pole `ownerId`
   - Mělo by se shodovat s User ID z kroku 1

### 3. Security Rules mají špatnou syntaxi

**Testování v Firebase Console:**
1. Firestore Database → Rules → **Rules Playground**
2. Nastavte:
   - **Location**: `sets/Cyku1c3RTzFZVzPkrtgG`
   - **Authenticated**: Ano
   - **User ID**: `YbXV2liqjqRhWTUyZAyhh2QJD8g1`
   - **Operation**: Read
3. Klikněte **Run**
4. ✅ Mělo by být: "Simulated read allowed"
5. ❌ Pokud je "denied", Security Rules jsou špatně

## 🔧 Rychlá oprava

### Krok 1: Zkontrolujte Security Rules v Firebase Console

Otevřete Firebase Console a zkontrolujte, že Rules obsahují:

```javascript
match /sets/{setId} {
  allow read: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
  allow create: if isAuthenticated() && request.resource.data.ownerId == request.auth.uid;
  ...
}
```

### Krok 2: Ověřte ownerId v dokumentu

V Firebase Console → Firestore → Data → sets → vaše sada:
- Pole `ownerId` musí existovat
- Musí obsahovat: `YbXV2liqjqRhWTUyZAyhh2QJD8g1`

### Krok 3: Testujte v Rules Playground

Použijte Rules Playground pro simulaci read operace.

## 📝 Debug kód pro testování

Vložte do Developer Console:

```javascript
// Test načtení sady
import { getSet } from './lib/firebase/collections';
import { auth } from './lib/firebase/config';

console.log('Current user:', auth?.currentUser?.uid);

// Zkuste načíst sadu
getSet('Cyku1c3RTzFZVzPkrtgG')
  .then(set => {
    console.log('✅ Sada načtena:', set);
    console.log('OwnerId:', set.ownerId);
  })
  .catch(error => {
    console.error('❌ Chyba:', error.code, error.message);
  });
```

## 🚨 Kritické: Aktualizujte Security Rules TEĎ

1. **Zkopírujte obsah `firestore.rules`**
2. **Vložte do Firebase Console → Firestore → Rules**
3. **Klikněte Publish**
4. **Obnovte stránku v prohlížeči**

Po této opravě by mělo vše fungovat!
