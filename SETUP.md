# Návod k nastavení LawDrill

## Krok 1: Instalace závislostí

```bash
npm install
```

## Krok 2: Firebase Setup

### 2.1 Vytvoření Firebase projektu

1. Jděte na [Firebase Console](https://console.firebase.google.com/)
2. Klikněte na "Add project"
3. Zadejte název projektu (např. "lawdrill")
4. Pokračujte podle instrukcí

### 2.2 Povolení Authentication

1. V Firebase Console přejděte na **Authentication**
2. Klikněte na **Get Started**
3. V záložce **Sign-in method** povolte **Email/Password**
4. Uložte změny

### 2.3 Vytvoření Firestore databáze

1. V Firebase Console přejděte na **Firestore Database**
2. Klikněte na **Create database**
3. Vyberte **Start in test mode** (security rules nahrajeme později)
4. Vyberte umístění (např. `europe-west`)
5. Klikněte na **Enable**

### 2.4 Nastavení Security Rules

1. V Firestore Database klikněte na záložku **Rules**
2. Zkopírujte obsah souboru `firestore.rules` z tohoto projektu
3. Vložte do editoru v Firebase Console
4. Klikněte na **Publish**

### 2.5 Získání Firebase konfigurace

Firebase konfigurace je již vložena v `lib/firebase/config.ts`. Pokud potřebujete změnit projekt:

1. V Firebase Console přejděte na **Project Settings** (⚙️)
2. Přejděte na záložku **General**
3. V sekci **Your apps** klikněte na ikonu webu (</>)
4. Zkopírujte konfiguraci a vložte do `lib/firebase/config.ts`

## Krok 3: Spuštění aplikace

```bash
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000)

## Krok 4: První použití

1. Otevřete [http://localhost:3000](http://localhost:3000)
2. Klikněte na **Registrovat se**
3. Vytvořte účet (e-mail + heslo)
4. Po přihlášení uvidíte dashboard
5. Klikněte na **Vytvořit novou sadu**
6. Vložte text nebo importujte ze ZakonyProLidi.cz
7. Klikněte na **Vytvořit sadu a vygenerovat otázky**
8. Počkejte na vygenerování otázek
9. Vyberte mód procvičování a začněte procvičovat!

## Volitelné: Seed demo dat

Pokud chcete vytvořit demo sadu pro testování:

1. Zaregistrujte se v aplikaci
2. Získejte své User ID z Firebase Console (Authentication → Users)
3. Spusťte:

```bash
DEMO_USER_ID=your-user-id npx tsx scripts/seed.ts
```

## Řešení problémů

### Chyba: "Permission denied" při čtení/zápisu do Firestore

- Zkontrolujte, že jsou správně nastavené Security Rules v Firebase Console
- Ujistěte se, že jste přihlášeni v aplikaci

### Chyba při importu ze ZakonyProLidi.cz

- Zkontrolujte, že URL je platná a obsahuje "zakonyprolidi.cz"
- Pokud import selže, můžete vložit text ručně

### Otázky se negenerují

- Zkontrolujte konzoli prohlížeče pro chyby
- Ujistěte se, že text je dostatečně dlouhý (min. 50 znaků)
- Zkontrolujte, že máte oprávnění k zápisu do Firestore

## Produkční nasazení

Pro produkční nasazení:

1. Vytvořte produkční Firebase projekt
2. Aktualizujte Firebase konfiguraci
3. Nastavte Security Rules pro produkci
4. Build aplikace: `npm run build`
5. Deploy na Vercel/Netlify nebo jinou platformu
