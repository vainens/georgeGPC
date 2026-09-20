# georgeGPC

Un prototipo di interfaccia chat originale e responsive per **georgeGPC**. Il repository genera **quattro download distinti**, uno per piattaforma:

| File da scaricare | Dove si apre |
| --- | --- |
| `georgeGPC-web.zip` | Qualsiasi browser moderno; estrai lo ZIP e apri `index.html`, oppure pubblica la cartella estratta su un hosting web. |
| `georgeGPC-windows-setup.exe` | Windows 10/11; fai doppio clic e completa l'installazione. |
| `georgeGPC-linux-x86_64.AppImage` | Linux 64-bit; rendilo eseguibile (`chmod +x ...AppImage`) e fai doppio clic. |
| `georgeGPC-android.apk` | Android; trasferiscilo sul telefono, aprilo e consenti l'installazione da questa sorgente quando Android lo chiede. |

> Windows, Linux e Android richiedono una compilazione nativa: non è possibile rinominare un file web per ottenerli. Il workflow incluso crea esattamente questi quattro file scaricabili.

## Come scaricare i quattro file

1. Carica questo progetto su GitHub e apri la scheda **Actions**.
2. Seleziona **Build release files** nella colonna sinistra.
3. Premi **Run workflow** e attendi il completamento dei quattro job.
4. Apri l'esecuzione completata e, in fondo alla pagina, scarica i quattro **Artifacts**: `georgeGPC-web`, `georgeGPC-windows`, `georgeGPC-linux` e `georgeGPC-android`.
5. Estrai ciascun artifact: conterrà il file indicato nella tabella. Per una release pubblica permanente, crea un tag che inizia con `v` (per esempio `v0.1.0`); il workflow parte automaticamente.

## Aprire il progetto sul tuo computer

Serve [Node.js](https://nodejs.org/) 22 o superiore.

```bash
npm install
npm run dev
```

Apri nel browser l'indirizzo mostrato dal terminale, di norma `http://localhost:5173`.

### Comandi per ogni piattaforma

```bash
# crea la cartella web ottimizzata
npm run build

# apre l'app desktop in sviluppo
npm run desktop

# crea il file di installazione Windows (eseguirlo su Windows)
npm run package:windows

# crea AppImage Linux (eseguirlo su Linux)
npm run package:linux

# inizializza il progetto Android una sola volta, poi compila l'APK
npm run android:prepare
npm run android:apk
```

I file desktop vengono generati nella cartella `release/`. L'APK viene generato in `android/app/build/outputs/apk/release/`. Per Android sono necessari Android Studio, Android SDK e Java 21; il workflow GitHub prepara automaticamente questo ambiente.

## Funzioni incluse nel prototipo

- Area chat desktop/mobile, cronologia e prompt iniziali.
- Profili `gpc-1-lite`, `gpc-1-flash` e `gpc-1.5 preview`.
- Risposte locali simulate e interruttore per la modalità ironica.
- Preferenze per lingua, privacy e provider esterno, con interfaccia di accesso/registrazione.

## Nota per la produzione

Questo è un frontend dimostrativo: non include un provider AI reale, backend di autenticazione, database o credenziali amministratore nel codice. Un'app pubblica deve usare identità lato server, password hash, rate limiting, verifica email e segreti gestiti tramite variabili d'ambiente. Le API key dei modelli non devono mai essere incluse nel browser o nell'APK.
