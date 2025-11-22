# Guía de Desarrollo - Profit App

Esta guía te ayudará a entender dónde encontrar cada cosa y cómo hacer cambios en la aplicación.

## Estructura del Proyecto

```
Profit/
├── backend/                 # Código del servidor (Python/FastAPI)
│   ├── main.py             # Endpoints de la API (rutas)
│   ├── models.py           # Modelos de datos (estructura de tablas)
│   └── database.py         # Conexión a Supabase y consultas SQL
│
├── frontend/               # Código de la interfaz (React/Vite)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables (Formularios, Listas)
│   │   ├── App.jsx         # Componente principal y navegación
│   │   └── api.js          # Configuración de conexión al backend
│   └── tailwind.config.js  # Configuración de estilos y colores
```

## ¿Dónde cambio qué?

### 1. Base de Datos y Datos
Si quieres cambiar qué datos se guardan (ej: cambiar "NIO" por "Córdobas"):
- **Backend**: Edita `backend/models.py`. Aquí se define qué datos acepta el servidor.
- **Base de Datos**: Si agregas nuevos campos, necesitarás ejecutar SQL en Supabase.

### 2. Lógica de Negocio
Si quieres cambiar cómo se procesan los datos (ej: validaciones, cálculos):
- **Backend**: Edita `backend/main.py` (para la API) o `backend/database.py` (para consultas).

### 3. Interfaz Visual (Frontend)
- **Colores y Estilos**: `frontend/src/index.css` o `frontend/tailwind.config.js`.
- **Formularios**: 
  - Transacciones: `frontend/src/components/TransactionForm.jsx`
  - Metas: `frontend/src/components/GoalForm.jsx`
- **Listas y Tablas**: `frontend/src/components/TransactionList.jsx`
- **Gráficos**: `frontend/src/components/Dashboard.jsx`

### 4. Conexión API
- Si cambias la URL del backend o la configuración de conexión: `frontend/src/api.js`.

## Flujo de Trabajo Recomendado

1. **Haz el cambio localmente**: Edita los archivos en tu PC.
2. **Prueba**: Ejecuta `run_webapp.bat` para ver si funciona.
3. **Despliega**:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
   Vercel y Render se actualizarán automáticamente.

## Solución de Problemas Comunes

- **Error 500**: Revisa los logs en Render. Generalmente es un error de código en Python.
- **Error 404 en API**: Verifica `frontend/src/api.js` y que el backend esté corriendo.
- **Cambios no se ven**: Asegúrate de haber hecho `git push` y espera unos minutos.
