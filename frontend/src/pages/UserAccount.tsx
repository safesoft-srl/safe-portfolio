interface SectionProps {
  Datos: string;
  Biografia: string;
  Usuario: string;
  Descripcion: string;
  imagen?: string;
}

function Section({ Datos, Biografia,imagen }: SectionProps) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{Datos}</h2>

      <div style={styles.content}>
        {/* Imagen de perfil */}
        <div style={styles.imageContainer}>
          <img
            src={imagen}
            alt="Imagen de usuario"
            style={styles.image}
          />
          <button style={styles.editButton}>Editar</button>
        </div>

        {/* Formulario */}
        <div style={styles.form}>
          <label style={styles.label}>Nombre Completo *</label>
          <input
            type="text"
            placeholder="Ej. Juan Perez"
            style={styles.input}
          />

          <label style={styles.label}>Correo *</label>
          <input
            type="email"
            placeholder="Ej. user@example.com"
            style={styles.input}
          />

          <label style={styles.label}>Profesión *</label>
          <input
            type="text"
            placeholder="Ej. Desarrollador Full Stack"
            style={styles.input}
          />
        </div>
      </div>

      {/* Biografía */}
      <div>
        <label style={styles.label}>{Biografia} *</label>
        <textarea
          placeholder="Cuéntanos sobre ti, tu experiencia y tus intereses."
          style={styles.textarea}
        />
      </div>

      {/* Botones */}
      <div style={styles.buttons}>
        <button style={styles.saveButton}>Guardar Cambios</button>
        <button style={styles.cancelButton}>Cancelar</button>
      </div>
    </div>
  );
}

export default function UserAccount() {
  return (
    <div style={styles.page}>
      <Section
        Datos="Información Básica"
        Biografia="Biografía"
        Usuario="nombre de usuario"
        Descripcion="Descripción del Usuario"
        imagen="https://via.placeholder.com/150"
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    padding: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    width: "800px",
    color: "white",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  },
  title: {
    marginBottom: "20px",
  },
  content: {
    display: "flex",
    gap: "30px",
    marginBottom: "20px",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "#334155",
  },
  editButton: {
    marginTop: "10px",
    backgroundColor: "#3b82f6",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  form: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "14px",
    color: "#cbd5f5",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    marginTop: "5px",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
  },
};