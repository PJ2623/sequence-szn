import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  bgColor: string;
  borderColor: string;
}

export function Modal({ open, onClose, children, bgColor, borderColor }: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: 20,
          padding: 24,
          maxWidth: 360,
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
