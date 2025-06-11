import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import Modal from "../components/Modal.jsx";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    show: false,
    message: "",
    type: "info",
    onConfirm: null,
    confirmText: "Aceptar",
    showCancel: true,
  });
  const navigate = useNavigate(); //Hook para navegacion

  const showModal = (config) => {
    setModal({
      show: true,
      type: "info",
      showCancel: true,
      ...config,
    });
  };

  const hideModal = () => {
    setModal((prev) => ({ ...prev, show: false }));
  };

  const handleCancel = () => {
    setEditingTask(null); // Esto cambiará initialData a null
  };
  // Obtener tareas al cargar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
        console.log("Esto es lo que se esta editando", editingTask);
        await api.put(`/tasks/${editingTask.id}`, taskData);

        await fetchTasks(); // Refrescar lista
        showModal({
          message: "Los cambios se guardaron correctamente",
          type: "success",
          showCancel: false,
          onConfirm: hideModal,
        });
      } else {
        await api.post("/tasks", taskData);
        await fetchTasks(); // Refrescar lista
      }
      setEditingTask(null); // Resetear formulario solo si se estaba editando
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
    showModal({
      message: "¿Estás seguro de eliminar esta tarea?",
      type: "error",
      confirmText: "Eliminar",
      onConfirm: async () => {
        try {
          await api.delete(`/tasks/${taskId}`);
          fetchTasks();
          showModal({
            message: "Los cambios se guardaron correctamente",
            type: "success",
            showCancel: false,
            onConfirm: hideModal,
          });
        } catch (error) {
          showModal({
            message: error.message,
            type: "error",
            showCancel: false,
            onConfirm: hideModal,
          });
        }
      },
    });
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
            <TaskForm
              onSubmit={handleSubmit}
              initialData={editingTask}
              onCancel={handleCancel}
            />
          </div>
        </div>

        <div className={`${styles.taskListContainer} ${styles.card}`}>
          <div className={styles.cardHeader}>
            <h2>Mis Tareas</h2>
            {!isLoading && ( // <-- Mostrar contador solo cuando no está cargando
              <span className={styles.taskCount}>{tasks.length} tareas</span>
            )}
          </div>
          <div className={styles.cardBody}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Cargando tareas...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <p>Error: {error}</p>
                <button onClick={fetchTasks} className={styles.retryButton}>
                  Reintentar
                </button>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserId={user.id} // Pasa el ID del usuario actual
                isAdmin="admin"
              />
            )}
          </div>
          {modal.show && (
            <Modal
              message={modal.message}
              type={modal.type}
              onClose={hideModal}
              onConfirm={modal.onConfirm || hideModal}
              confirmText={modal.confirmText}
              showCancel={modal.showCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
