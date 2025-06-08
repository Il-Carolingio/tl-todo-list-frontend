import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate(); //Hook para navegacion

  const handleCancel = () => {
    setEditingTask(null); // Esto cambiará initialData a null
  };
  // Obtener tareas al cargar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  //Funcion para manejar el logout
  const handleLogout = () => {
    logout(); //Llama a la funcion
    navigate("/login"); //Redirecciona a la pagina de login
  };

  // Manejar creación/actualización
  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, taskData);
      } else {
        await api.post("/tasks", taskData);
      }
      fetchTasks(); // Refrescar lista
      setEditingTask(null); // Resetear formulario
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Manejar edición
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  // Manejar eliminación
  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1>Bienvenido, {user?.name}</h1>
          <p className={styles.welcomeMessage}>
            Administra tus tareas de manera eficiente
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleLogout}
            className={styles.logoutButtonPrimary}
            title="Cerrar sesión"
          >
            <svg className={styles.logoutIcon} viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className={styles.dashboardContent}>
        <div className={`${styles.taskFormContainer} ${styles.card}`}>
          <div className={styles.cardHeader}>
            <h2>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</h2>
          </div>
          <div className={styles.cardBody}>
            <TaskForm onSubmit={handleSubmit} initialData={editingTask} onCancel={handleCancel} />
          </div>
        </div>

        <div className={`${styles.taskListContainer} ${styles.card}`}>
          <div className={styles.cardHeader}>
            <h2>Mis Tareas</h2>
            <span className={styles.taskCount}>{tasks.length} tareas</span>
          </div>
          <div className={styles.cardBody}>
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={user.id} // Pasa el ID del usuario actual
              isAdmin='admin'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
