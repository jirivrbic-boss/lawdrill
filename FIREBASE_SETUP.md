# Nastavení Firebase Security Rules

## Důležité: Aktualizace Security Rules v Firebase Console

Security Rules v souboru `firestore.rules` se **NEAKTUALIZUJÍ automaticky**. Musíte je ručně zkopírovat do Firebase Console.

## Postup:

1. **Otevřete Firebase Console**
   - Jděte na https://console.firebase.google.com/
   - Vyberte projekt `lawdrill-ca709`

2. **Přejděte na Firestore Database**
   - V levém menu klikněte na **Firestore Database**
   - Klikněte na záložku **Rules** (nahoře)

3. **Zkopírujte Security Rules**
   - Otevřete soubor `firestore.rules` z tohoto projektu
   - Zkopírujte **celý obsah** souboru
   - Vložte do editoru v Firebase Console (nahraďte stávající obsah)

4. **Publikujte změny**
   - Klikněte na tlačítko **Publish** (vpravo nahoře)
   - Počkejte na potvrzení, že byly rules aktualizovány

## Ověření:

Po aktualizaci rules by měla aplikace fungovat správně:
- ✅ Uživatelé mohou vytvářet své vlastní sady
- ✅ Uživatelé mohou číst pouze své vlastní sady
- ✅ Uživatelé nemohou přistupovat k sadám jiných uživatelů

## Řešení problémů:

### Chyba: "Missing or insufficient permissions"

**Možné příčiny:**
1. Security Rules nebyly aktualizovány v Firebase Console
2. Uživatel není přihlášený
3. `ownerId` v dokumentu neodpovídá `request.auth.uid`

**Řešení:**
1. Zkontrolujte, že jste aktualizovali Security Rules v Firebase Console
2. Zkontrolujte v konzoli prohlížeče, zda je uživatel přihlášený
3. Zkontrolujte, že při vytváření dokumentu se správně nastavuje `ownerId: user.uid`

### Testování Rules:

Můžete použít Firebase Console → Firestore Database → Rules → Rules Playground pro testování různých scénářů.
