# Debug Security Rules - Permission Denied

## Problém

V konzoli vidíte:
- "Načteno sad: -1" (nebo jiné divné číslo)
- "FirebaseError: permission-denied" při načítání sady
- "Sada načtena, ownerId: ..." (což znamená, že se sada nakonec načetla)

## Možné příčiny

### 1. Security Rules nejsou aktualizované v Firebase Console

**Řešení:**
1. Otevřete `firestore.rules` v projektu
2. Zkopírujte CELÝ obsah
3. Firebase Console → Firestore Database → Rules
4. Vložte obsah a klikněte **Publish**

### 2. OwnerId se neshoduje

**Ověření:**
1. V Developer Console zadejte:
   ```javascript
   firebase.auth().currentUser.uid
   ```
   Zapište si toto UID

2. V Firebase Console:
   - Firestore Database → Data → kolekce `sets`
   - Najděte vaši sadu
   - Zkontrolujte pole `ownerId`
   - Mělo by se shodovat s UID z kroku 1

### 3. Security Rules mají špatnou syntaxi

**Ověření v Firebase Console:**
1. Firestore Database → Rules
2. Klikněte na "Rules Playground" (vpravo nahoře)
3. Vyberte:
   - **Location**: `sets/{setId}`
   - **Authenticated**: Ano
   - **User ID**: vaše UID
   - **Operation**: Read
4. Klikněte "Run"
5. ✅ Mělo by být: "Simulated read allowed"

### 4. Dokument nemá správně nastavený ownerId

**Ověření:**
1. Firebase Console → Firestore Database → Data
2. Najděte kolekci `sets` → vaši sadu
3. Zkontrolujte, že pole `ownerId` existuje a obsahuje vaše UID
4. Pokud neexistuje nebo je špatné:
   - Dokument musí být smazán a vytvořen znovu
   - Nebo můžete ručně upravit v Firebase Console (dočasně pro test)

## Testovací kroky

### Krok 1: Ověřte Security Rules
```bash
# V Firebase Console → Firestore → Rules
# Měly by být vidět tyto pravidla:

match /sets/{setId} {
  allow read: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
  allow create: if isAuthenticated() && request.resource.data.ownerId == request.auth.uid;
  ...
}
```

### Krok 2: Ověřte, že jste přihlášeni
V Developer Console:
```javascript
// Zkontrolujte Firebase Auth
import { auth } from './lib/firebase/config';
console.log('Current user:', auth?.currentUser?.uid);
```

### Krok 3: Ověřte ownerId v dokumentu
V Firebase Console → Firestore → Data → sets → vaše sada
- Pole `ownerId` musí existovat
- Musí obsahovat vaše UID

### Krok 4: Testujte Rules Playground
Firebase Console → Firestore → Rules → Rules Playground
- Simulujte read operaci
- Mělo by být "allowed"

## Rychlá oprava

Pokud nic z výše uvedeného nepomůže:

1. **Dočasně povolte read pro všechny** (POUZE PRO TEST):
```javascript
match /sets/{setId} {
  allow read: if request.auth != null;
  // ... zbytek pravidel
}
```

2. **Otestujte, zda to funguje**

3. **Pokud funguje, vraťte původní pravidla a zkontrolujte ownerId**

## Kontaktní informace

Pokud problém přetrvává, zkontrolujte:
- Firebase Console → Firestore → Usage → zda nejsou nějaké chyby
- Developer Console → Network tab → zda jsou requesty správné
- Firebase Console → Authentication → Users → zda je váš účet aktivní
