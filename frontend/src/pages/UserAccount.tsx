interface SectionProps {
  Datos: string;
  Biografia: string;
  Usuario: string;
  Descripcion: string;
  correo: string
  imagen?: string;
}

function Section({ Usuario, Descripcion, Biografia,correo, imagen }: SectionProps) {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        
        {/* Imagen izquierda */}
        <div style={styles.imageWrapper}>
          <img src={imagen} alt="Usuario" style={styles.image} />
        </div>

        {/* Texto derecha */}
        <div style={styles.textContainer}>
          <span style={styles.smallText}>Hey, I'm</span>

          <h1 style={styles.name}>{Usuario}</h1>

          <h2 style={styles.profession}>
             {Descripcion}
           </h2>
          <h3 style={styles.email}>
           Email: {correo}
           </h3>
          <p style={styles.bio}>{Biografia}</p>
        </div>
      </div>
    </div>
  );
}

export default function UserAccount() {
  return (
    <div style={styles.page}>
      <Section
        Usuario="Nombre de persona"
        Descripcion="Profesion"
        Biografia="Descripcion de la biografia"
        correo="direccion de correo electronico"
        imagen="Imagen del perfil"
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  container: {
    width: "1000px",
    backgroundColor: "#1e293b",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 0 30px rgba(0,0,0,0.5)",
  },

  content: {
    display: "flex",
    alignItems: "center",
    gap: "50px",
  },

  imageWrapper: {
    width: "350px",
    height: "350px",
    borderRadius: "40px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #06b6d4, #22c55e)",
    padding: "5px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "35px",
  },

  textContainer: {
    flex: 1,
    color: "white",
  },

  smallText: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  name: {
    fontSize: "28px",
    margin: "5px 0",
  },

  profession: {
    fontSize: "48px",
    fontWeight: "bold",
    lineHeight: "1.2",
  },

  highlight: {
    color: "#27e46d",
  },

  bio: {
    marginTop: "20px",
    color: "#cbd5e1",
    lineHeight: "1.6",
    maxWidth: "500px",
  },
  email: {
    marginTop: "20px",
    color: "#cbd5e1",
    lineHeight: "1.6",
    maxWidth: "500px",
  },
};