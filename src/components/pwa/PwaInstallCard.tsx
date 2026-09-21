import {
  CheckCircle2,
  Download,
  ExternalLink,
  MonitorSmartphone,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export function PwaInstallCard() {
  const { canInstall, install, isInstalled, isIos, isSecureContext, isSupported } = usePwaInstall();
  const [isInstalling, setIsInstalling] = useState(false);

  async function handleInstall() {
    setIsInstalling(true);

    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  }

  return (
    <article className="content-card pwa-install-card">
      <div className="pwa-install-card__heading">
        <div className="pwa-install-card__icon" aria-hidden="true">
          <MonitorSmartphone size={24} />
        </div>
        <div>
          <span className="content-card__label">App sul telefono</span>
          <h2>VLB3 Remote come app</h2>
          <p>
            Installa il portale sulla schermata Home e aprilo in modalità standalone, senza
            dover cercare ogni volta il sito nel browser.
          </p>
        </div>
      </div>

      <div className="pwa-install-card__features">
        <div>
          <CheckCircle2 size={17} />
          <span>Accesso rapido dalla schermata Home</span>
        </div>
        <div>
          <ShieldCheck size={17} />
          <span>Nessuna cache aggressiva dei dati realtime</span>
        </div>
      </div>

      {isInstalled ? (
        <div className="pwa-install-state pwa-install-state--success">
          <CheckCircle2 size={19} />
          <div>
            <strong>App installata</strong>
            <span>Stai usando VLB3 Remote in modalità app.</span>
          </div>
        </div>
      ) : !isSecureContext ? (
        <div className="pwa-install-state">
          <ShieldCheck size={19} />
          <div>
            <strong>HTTPS richiesto</strong>
            <span>
              L'installazione PWA viene abilitata quando il portale è pubblicato in HTTPS.
              Su localhost i browser consentono comunque il test in sviluppo.
            </span>
          </div>
        </div>
      ) : canInstall ? (
        <button
          className="button button--primary pwa-install-button"
          disabled={isInstalling}
          onClick={() => void handleInstall()}
          type="button"
        >
          <Download size={18} />
          {isInstalling ? 'Installazione...' : 'Installa app'}
        </button>
      ) : isIos ? (
        <div className="pwa-install-state">
          <Share2 size={19} />
          <div>
            <strong>Installa su iPhone o iPad</strong>
            <span>
              Apri il menu Condividi di Safari e scegli “Aggiungi alla schermata Home”.
            </span>
          </div>
        </div>
      ) : isSupported ? (
        <div className="pwa-install-state">
          <ExternalLink size={19} />
          <div>
            <strong>Installazione dal browser</strong>
            <span>
              Se il pulsante automatico non compare, usa il menu del browser e scegli
              “Installa app” o “Aggiungi alla schermata Home”.
            </span>
          </div>
        </div>
      ) : (
        <div className="pwa-install-state">
          <ExternalLink size={19} />
          <div>
            <strong>Browser non compatibile</strong>
            <span>Puoi continuare a usare normalmente il portale dal browser.</span>
          </div>
        </div>
      )}
    </article>
  );
}
