import { useState, useEffect, useCallback } from "react"; // Importamos useState y useEffect de React
import styles from "./TaskList.module.css"; // Archivo CSS Modules que crearemos
import api from "../services/api";

const TaskList = ({ onEdit, onDelete, currentUserId, isAdmin = false }) => {
  const [filter, setFilter] = useState("all"); // 'all' o 'mine'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedFilter, setCompletedFilter] = useState("all"); // 'all', 'completed' o 'pending'
  // Usamos useCallback para memorizar la función y evitar recreaciones innecesarias
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = filter === "mine" ? "/tasks?filter=mine" : "/tasks";
      const response = await api.get(endpoint);

      // Verificamos que la respuesta tenga datos y sean un array
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (err) {
      setError(err.message || "Error al cargar las tareas");
      console.error("Error fetching tasks:", err);
      setTasks([]); // Aseguramos que tasks sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Ahora depende de fetchTasks memorizado

  const handleFilterChange = (newFilter) => {
    if (newFilter === "all" && !isAdmin) return;
    setFilter(newFilter);
  };
  //Filtro seteado para tareas completadas o pendientes
  const handleCompletedFilterChange = (newFilter) => {
    setCompletedFilter(newFilter);
  };
  // Filtrado combinado
  const filteredTasks = tasks.filter((task) => {
    // Filtro por usuario (all/mine)
    const userFilter = filter === "mine" ? task.userId === currentUserId : true;

    // Filtro por estado de completitud
    const completionFilter =
      completedFilter === "all"
        ? true
        : completedFilter === "completed"
        ? task.completed
        : !task.completed;

    return userFilter && completionFilter;
  });

  // Renderizado condicional mejorado
  if (loading) {
    return (
      <div className={styles.taskList}>
        <div className={styles.loading}>Cargando tareas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.taskList}>
        <div className={styles.error}>
          {error}
          <button onClick={fetchTasks} className={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      <div className={styles.filterControls}>
        {isAdmin && (
          <button
            className={`${styles.filterButton} ${
              filter === "all" ? styles.activeFilter : ""
            }`}
            onClick={() => handleFilterChange("all")}
          >
            Todas las tareas
          </button>
        )}
        <button
          className={`${styles.filterButton} ${
            filter === "mine" ? styles.activeFilter : ""
          }`}
          onClick={() => handleFilterChange("mine")}
        >
          Mis tareas
        </button>
      </div>
      <div className={styles.filterGroup}>
        <button
          className={`${styles.filterButton} ${
            completedFilter === "all" ? styles.activeFilter : ""
          }`}
          onClick={() => handleCompletedFilterChange("all")}
        >
          Todas
        </button>
        <button
          className={`${styles.filterButton} ${
            completedFilter === "completed" ? styles.activeFilter : ""
          }`}
          onClick={() => handleCompletedFilterChange("completed")}
        >
          Completadas
        </button>
        <button
          className={`${styles.filterButton} ${
            completedFilter === "pending" ? styles.activeFilter : ""
          }`}
          onClick={() => handleCompletedFilterChange("pending")}
        >
          Pendientes
        </button>
      </div>
      {filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
            alt="No hay tareas"
            className={styles.emptyImage}
          />
          <p className={styles.emptyText}>
            {filter === "mine"
              ? "No tienes tareas asignadas"
              : "No hay tareas registradas"}
          </p>
        </div>
      ) : (
        <ul className={styles.taskItems}>
          {filteredTasks
            .filter((task) =>
              filter === "mine" ? task.userId === currentUserId : true
            )
            .map((task) => (
              <li
                key={task.id}
                className={`${styles.taskItem} ${
                  task.completed ? styles.completed : ""
                }`}
              >
                <div className={styles.taskContent}>
                  <div className={styles.taskStatus}>
                    <span
                      className={`${styles.statusIndicator} ${
                        task.completed ? styles.completedIndicator : ""
                      }`}
                    ></span>
                  </div>
                  <div className={styles.taskInfo}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>
                    {task.description && (
                      <p className={styles.taskDescription}>
                        {task.description}
                      </p>
                    )}
                    <div className={styles.taskMeta}>
                      <span
                        className={`${styles.taskStatusBadge} ${
                          task.completed
                            ? styles.completedBadge
                            : styles.pendingBadge
                        }`}
                      >
                        {task.completed ? "Completada" : "Pendiente"}
                      </span>
                      {filter === "all" && (
                        <span className={styles.taskUser}>
                          Asignada a:{" "}
                          {task.userName || `Usuario ${task.userId}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.taskActions}>
                  {(isAdmin || task.userId === currentUserId) && (
                    <button
                      onClick={() => onEdit(task)}
                      className={styles.editButton}
                    >
                      <svg className={styles.icon} viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  )}
                  {(isAdmin || task.userId === currentUserId) && (
                    <button
                      onClick={() => onDelete(task.id)}
                      className={styles.deleteButton}
                    >
                      <svg className={styles.icon} viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
