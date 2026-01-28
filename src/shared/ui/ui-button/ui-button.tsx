import styles from './ui-button.module.css';

interface UiButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export function UiButton({
  children,
  onClick,
  disabled = false,
}: UiButtonProps) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
