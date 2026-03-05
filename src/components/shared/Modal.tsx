import type { ReactNode } from 'react';
import './shared.css';

export function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>
  );
}
