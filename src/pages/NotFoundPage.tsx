import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <span>404</span>
        <h1>Pagina non trovata</h1>
        <p>La pagina richiesta non esiste o non è disponibile.</p>
        <Link className="button button--primary" to="/">
          <ArrowLeft size={18} />
          Torna alla dashboard
        </Link>
      </div>
    </main>
  );
}
