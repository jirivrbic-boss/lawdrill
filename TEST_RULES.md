# Testování Security Rules

## Problém: get operace selže, ale list funguje

To znamená, že Security Rules možná nejsou správně nastavené pro `get` operaci.

## ✅ Test v Rules Playground

1. Firebase Console → Firestore Database → Rules
2. Klikněte na **Rules Playground**
3. Nastavte:
   - **Location**: `sets/Cyku1c3RTzFZVzPkrtgG` (nebo ID vaší sady)
   - **Authenticated**: ✅ Ano
   - **User ID**: `YbXV2liqjqRhWTUyZAyhh2QJD8g1` (vaše User ID)
   - **Operation**: **Get** (ne Read!)
4. Klikněte **Run**
5. ✅ Mělo by být: **"Simulated get allowed"**

## 🔍 Ověření ownerId v dokumentu

1. Firebase Console → Firestore Database → Data
2. Kolekce `sets` → najděte sadu `Cyku1c3RTzFZVzPkrtgG`
3. Zkontrolujte pole `ownerId`
4. Mělo by obsahovat: `YbXV2liqjqRhWTUyZAyhh2QJD8g1`

Pokud se neshoduje, to je problém!

## 📝 Aktualizované Rules

Upravil jsem Rules tak, aby byly explicitnější pro `get` operaci:

```javascript
match /sets/{setId} {
  // Get operace - explicitní kontrola
  allow get: if request.auth != null && 
                resource.data.ownerId == request.auth.uid;
  // List operace - pro dotazy s where("ownerId", "==", uid)
  allow list: if request.auth != null;
  ...
}
```

**Důležité:** Po úpravě Rules je musíte znovu publikovat v Firebase Console!
