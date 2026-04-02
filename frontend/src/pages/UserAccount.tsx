
interface SectionProps {
  Datos: string;
  Biografia: string;
  Usuario: string;
  Descripcion: string;
  imagen?: string;

}

function Section({ Datos, Biografia, Usuario, Descripcion,imagen }: SectionProps) {
  return (
    <div>
      <h2>{Datos}</h2>
      <h2>{Biografia}</h2>
      <p>{Usuario}</p>
      <p>{Descripcion}</p>
      {/* Imagen */}
      {imagen && (
        <img
          src={imagen}
          alt="Imagen de usuario"
          width="150"
        />
      )}
    </div>
  );
}

export default function UserAccount() {
  return (
    <div>
      <Section
        Datos="Datos del Usuario"
        Biografia="Biografía del Usuario"
        Usuario="nombre de usuario: "
        Descripcion="Descripción del Usuario: "
        imagen="https://via.placeholder.com/150"

      />
    </div>
  );
}