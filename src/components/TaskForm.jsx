import { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  //Estado inicial del formulario
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    completed: initialData?.completed || false
  });

  // Si hay datos iniciales (edición), cargarlos
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        completed: initialData.completed,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      // Resetear solo si es nueva tarea
      setFormData({ title: '', description: '', completed: false });
    }
  };
  // funcion para cancelar
  const handleCancel = () =>{
    setFormData({ title: '', description: '', completed: false }); onCancel?.();
   
  };

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.formLabel}>Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={styles.formInput}
          required
          placeholder="Ingrese el título de la tarea"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.formLabel}>Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.formTextarea}
          placeholder="Describa la tarea..."
          rows="4"
        />
      </div>
      
      <div className={`${styles.formGroup} ${styles.checkboxContainer}`}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className={styles.formCheckbox}
          />
          <span className={styles.checkmark}></span>
          Tarea completada
        </label>
      </div>
      
      <div className={styles.formButtons}>
        <button type="submit" className={styles.submitButton}>
          {initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
        </button>
        
        {initialData && (
          <button 
            type="button" 
            onClick={handleCancel} 
            className={styles.cancelButton}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
);
};

export default TaskForm;