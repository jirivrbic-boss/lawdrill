# Průvodce Rules Playground - Jak vyplnit

## 🎯 Cíl: Otestovat, zda můžete načíst svou sadu

## ✅ Krok za krokem:

### 1. **Path/to/resource** (Cesta k dokumentu)

Vyplňte:
```
sets/Cyku1c3RTzFZVzPkrtgG
```

**Nebo:**
- Pokud chcete testovat jinou sadu, použijte její ID
- Formát: `sets/{ID_VAŠÍ_SADY}`
- ID sady najdete v URL když kliknete na sadu: `/dashboard/sets/{ID}`

### 2. **Authenticated** (Přihlášení)

✅ **Zapněte** (toggle musí být ON/modrý)

### 3. **Firebase UID** (Vaše User ID)

Vyplňte:
```
YbXV2liqjqRhWTUyZAyhh2QJD8g1
```

**Kde najít své User ID:**
- V aplikaci: Developer Console → zadejte: `firebase.auth().currentUser?.uid`
- Nebo: Firebase Console → Authentication → Users → váš e-mail → UID

### 4. **Simulation type** (Typ operace)

Vyberte: **`get`** (pro testování načtení sady)

**Další možnosti:**
- `get` - načtení dokumentu (testujeme toto)
- `create` - vytvoření dokumentu
- `update` - aktualizace dokumentu
- `delete` - smazání dokumentu

### 5. **Ostatní pole**

- **Provider**: Můžete nechat `google.com` nebo změnit na `password` (pro email/password auth)
- **Email**: Můžete vyplnit váš e-mail (volitelné)
- **Email verified**: Můžete zaškrtnout (volitelné)
- **Name, Phone**: Můžete nechat prázdné
- **Authentication payload**: Můžete nechat tak, jak je (automaticky se vyplní z výše uvedených polí)

### 6. **Spusťte test**

Klikněte na modré tlačítko **Run**

## ✅ Očekávaný výsledek:

Po kliknutí na **Run** byste měli vidět:

✅ **"Simulated get allowed"** (zelená) - znamená, že Rules fungují správně!

❌ **"Simulated get denied"** (červená) - znamená, že Rules nefungují správně

## 🔍 Pokud je výsledek "denied":

1. **Zkontrolujte Firebase UID:**
   - Musí se shodovat s `ownerId` v dokumentu sady
   - Firebase Console → Firestore → Data → sets → vaše sada → pole `ownerId`

2. **Zkontrolujte path:**
   - Musí být správně: `sets/{ID_SADY}` (bez lomítek na začátku)

3. **Zkontrolujte Rules:**
   - Ujistěte se, že Rules jsou publikované (tlačítko Publish bylo kliknuto)

## 📝 Příklad kompletního vyplnění:

```
Path/to/resource: sets/Cyku1c3RTzFZVzPkrtgG
Authenticated: ✅ ON
Firebase UID: YbXV2liqjqRhWTUyZAyhh2QJD8g1
Simulation type: get
Provider: password (nebo google.com)
Email: váš@email.com (volitelné)
```

Pak klikněte **Run**!

## 🎯 Testování různých operací:

### Test GET (načtení):
- Simulation type: `get`
- Path: `sets/Cyku1c3RTzFZVzPkrtgG`
- Authenticated: ON
- Firebase UID: `YbXV2liqjqRhWTUyZAyhh2QJD8g1`
- ✅ Mělo by být: "allowed"

### Test CREATE (vytvoření):
- Simulation type: `create`
- Path: `sets/test123`
- Authenticated: ON
- Firebase UID: `YbXV2liqjqRhWTUyZAyhh2QJD8g1`
- ✅ Mělo by být: "allowed" (pokud v `request.resource.data.ownerId` bude vaše UID)

### Test UPDATE (aktualizace):
- Simulation type: `update`
- Path: `sets/Cyku1c3RTzFZVzPkrtgG`
- Authenticated: ON
- Firebase UID: `YbXV2liqjqRhWTUyZAyhh2QJD8g1`
- ✅ Mělo by být: "allowed"

## 💡 Tip:

Pokud Rules Playground ukáže "allowed", ale aplikace stále nefunguje:
1. Obnovte stránku v aplikaci (F5)
2. Zkontrolujte konzoli prohlížeče pro další chyby
3. Zkontrolujte, že jste přihlášeni v aplikaci
