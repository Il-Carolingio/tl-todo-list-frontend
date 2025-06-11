import styles from './Modal.module.css';

const Modal = ({ 
  message, 
  type = 'info', 
  onClose, 
  onConfirm, 
  confirmText = 'Aceptar',
  showCancel = true 
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles[type]}`}>
        <button 
          onClick={onClose} 
          className={styles.closeButton}
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        
        <div className={styles.modalContent}>
          <p>{message}</p>
          
          <div className={styles.modalActions}>
            {showCancel && (
              <button 
                onClick={onClose} 
                className={styles.cancelButton}
              >
                Cancelar
              </button>
            )}
            <button 
              onClick={onConfirm} 
              className={styles.confirmButton}
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;