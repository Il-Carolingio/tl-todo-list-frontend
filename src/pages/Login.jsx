import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Login.module.css';
import taskImage from '../assets/task-login.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // ¡Estado añadido!
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/'); // Redirige al dashboard
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginIllustration}>
          {/* Imagen de respaldo si task-login.png no existe */}
          <img 
            src={taskImage || "https://cdn-icons-png.flaticon.com/512/3281/3281289.png"} 
            alt="Gestión de tareas" 
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/3281/3281289.png";
            }}
          />
          <h1>Organiza tus tareas eficientemente</h1>
          <p>La mejor herramienta para gestionar tus actividades diarias</p>
        </div>

        <div className={styles.loginFormContainer}>
          <div className={styles.loginFormHeader}>
            <h2>Iniciar Sesión</h2>
            <p>Accede a tu panel de gestión de tareas</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Ingresar
            </button>

            <div className={styles.loginFooter}>
              <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
              <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;