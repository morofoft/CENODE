import os

# Carpeta raíz de tu proyecto
RUTA_PROYECTO = "./"  # cámbiala si es necesario

# Extensiones que quieres incluir
EXTENSIONES = [".html", ".css", ".js"]

# Archivo de salida
OUTPUT = "codigo_unido.txt"


def unir_archivos():
    with open(OUTPUT, "w", encoding="utf-8") as salida:

        for root, dirs, files in os.walk(RUTA_PROYECTO):
            for file in files:

                if any(file.endswith(ext) for ext in EXTENSIONES):

                    ruta_completa = os.path.join(root, file)

                    salida.write("\n" + "="*60 + "\n")
                    salida.write(f"📄 ARCHIVO: {ruta_completa}\n")
                    salida.write("="*60 + "\n\n")

                    try:
                        with open(ruta_completa, "r", encoding="utf-8") as f:
                            contenido = f.read()
                            salida.write(contenido + "\n\n")
                    except Exception as e:
                        salida.write(f"❌ Error leyendo archivo: {e}\n")


if __name__ == "__main__":
    unir_archivos()
    print(f"✅ Archivo generado: {OUTPUT}")