import type { ReactNode } from 'react';

type AppHeaderProps = {
  showBack: boolean;
  title: ReactNode;
  backLabel?: ReactNode;
  backIcon?: ReactNode;
  onBack: () => void;
  brand: ReactNode;
};

export function AppHeader({
  showBack,
  title,
  backLabel = '戻る',
  backIcon,
  onBack,
  brand,
}: AppHeaderProps) {
  return (
    <div className="hdr">
      <div className="hdr-in">
        {showBack ? (
          <>
            <button className="back-btn" onClick={onBack}>
              {backIcon} {backLabel}
            </button>
            <div className="hdr-t">{title}</div>
            <div style={{ width: 60 }} />
          </>
        ) : (
          brand
        )}
      </div>
    </div>
  );
}
