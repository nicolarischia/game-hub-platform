# 🎮 Relazione Tecnica – Progetto GAME HUB PLATFORM

## 📌 Informazioni Generali

**Titolo progetto:** GAME HUB PLATFORM  
**URL progetto:** [https://lovable.dev/projects/fbc272a6-e7c0-4466-8d8e-51742c3d2296](https://gamehubplatform.lovable.app/)

**GAME HUB PLATFORM** è una piattaforma web pensata per aggregare, sviluppare e distribuire giochi in modo collaborativo ed efficiente. Questo documento descrive le tecnologie utilizzate, le modalità di modifica del codice e le opzioni di deploy.

---

## 🛠️ Tecnologie Utilizzate

Il progetto si basa su uno stack tecnologico moderno e altamente performante:

- ⚡ **Vite** – Bundler veloce per progetti frontend.
- 🟦 **TypeScript** – Superset di JavaScript per tipizzazione statica.
- ⚛️ **React** – Libreria per la creazione di interfacce utente.
- 🧩 **shadcn/ui** – Collezione di componenti UI accessibili e stilizzati.
- 🎨 **Tailwind CSS** – Framework utility-first per la creazione di interfacce moderne.

---

## 🧑‍💻 Modalità di Modifica del Codice

È possibile modificare il codice sorgente della piattaforma in diversi modi:

### 1. ✨ Tramite la piattaforma **Lovable**

Accedi direttamente al progetto su [Lovable](https://gamehubplatform.lovable.app/) e utilizza la funzionalità di prompting per generare e modificare il codice.

✅ Le modifiche apportate saranno automaticamente salvate e committate nel repository.

---

### 2. 🧑‍💻 Utilizzo di un **IDE locale**

Per lavorare in locale, è necessario avere installati **Node.js** e **npm**. È consigliato l’uso di **nvm** per la gestione delle versioni ([guida](https://github.com/nvm-sh/nvm#installing-and-updating)).

#### 🔧 Istruzioni:

```bash
# Clona il repository Git del progetto
git clone <YOUR_GIT_URL>

# Accedi alla directory del progetto
cd <YOUR_PROJECT_NAME>

# Installa le dipendenze
npm i

# Avvia il server di sviluppo con hot reload
npm run dev
