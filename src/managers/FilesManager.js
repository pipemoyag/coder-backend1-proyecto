import fs from "fs/promises";

export const readFile = async (path) => {
  try {
    const data = await fs.readFile(path, "utf-8"); // si existe, devuelve un string. si no, salta al catch
    // Caso: archivo existe pero está vacío (trim elimina espacios al inicio y al final)
    if (data.trim() === "") {
      return []; // tira lista vacía (ok)
    }

    return JSON.parse(data);
  } catch (error) {
    // Caso: archivo no existe
    if (error.code === "ENOENT") {
      return []; // tira lista vacía (ok)
    }

    // Cualquier otro error sí es relevante
    throw error;
  }
};

export const writeFile = async (path, data) => {
  const JSONdata = JSON.stringify(data, null, 2); // null: No filtrar por propiedades ni nada; 2: Define la indentacion del JSON resultante

  await fs.writeFile(path, JSONdata);
};
