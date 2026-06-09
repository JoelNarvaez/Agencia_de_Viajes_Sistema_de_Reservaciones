import Button from "./components/common/Button";
import Input from "./components/common/Input";
import Loader from "./components/common/Loader";
import { useState } from "react";
import Modal from "./components/common/Modal";

function App() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prueba de Componentes</h1>

      <h2>Botones</h2>

      <Button
        text="Reservar Ahora"
        variant="primary"
      />

      <br />
      <br />

      <Button
        text="Guardar"
        variant="secondary"
      />

      <br />
      <br />

      <Button
        text="Eliminar"
        variant="danger"
      />

      <br />
      <br />
      <hr />
      <br />

      <h2>Inputs</h2>

      <Input
        label="Correo electrónico"
        placeholder="ejemplo@correo.com"
      />

      <Input
        label="Contraseña"
        type="password"
      />

      <Input
        label="Nombre"
        placeholder="Ingresa tu nombre"
        error="Este campo es obligatorio"
      />

      <hr />
      <h2>Loader</h2>

      <Loader />

      <hr />
<h2>Modal</h2>

<Button
  text="Abrir Modal"
  onClick={() => setOpenModal(true)}
/>

<Modal
  isOpen={openModal}
  title="Confirmación"
  onClose={() => setOpenModal(false)}
>
  <p>¿Deseas continuar?</p>
</Modal>
    </div>
  );
}

export default App;