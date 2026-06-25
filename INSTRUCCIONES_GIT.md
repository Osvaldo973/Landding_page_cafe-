# Guía para Subir 'Marsel y Patricia' a GitHub 🚀

Como ya tienes creado tu repositorio en GitHub, aquí tienes los pasos exactos y los comandos que debes ejecutar en la terminal (PowerShell, Git Bash o CMD) para sincronizar tu carpeta local `Marsel y Patricia` con tu repositorio remoto de GitHub.

---

## Paso 1: Abrir la terminal en la carpeta correcta
Asegúrate de que tu terminal esté posicionada exactamente dentro de la carpeta del proyecto.
En VS Code, puedes hacer esto haciendo clic derecho sobre la carpeta `Marsel y Patricia` y seleccionando **"Abrir en terminal integrado"** (Open in Integrated Terminal).

---

## Paso 2: Inicializar Git (Si aún no se ha hecho)
Si nunca has inicializado Git en esta carpeta, ejecuta:
```bash
git init
```
*Nota: Esto creará una carpeta oculta `.git` en tu proyecto.*

---

## Paso 3: Configurar tus credenciales de Git (Solo si es la primera vez)
Si es tu primer proyecto en esta computadora, dile a Git quién eres para que tus contribuciones lleven tu nombre en GitHub:
```bash
git config --global user.name "Osvaldo Baret"
git config --global user.email "tu-correo-de-github@ejemplo.com"
```

---

## Paso 4: Agregar y registrar todos los archivos
Agrega los archivos al área de preparación (gracias al archivo `.gitignore` que creamos, los archivos innecesarios de caché de Firebase y del sistema se omitirán automáticamente):
```bash
git add .
```

Luego, realiza el primer registro (commit):
```bash
git commit -m "feat: primer commit - estructura inicial del proyecto Marsel & Patricia"
```

---

## Paso 5: Renombrar la rama principal a `main`
GitHub utiliza `main` como la rama por defecto. Renombra tu rama local para evitar conflictos:
```bash
git branch -M main
```

---

## Paso 6: Vincular tu repositorio local con tu repositorio en GitHub
Copia la URL HTTPS de tu repositorio de GitHub que ya creaste (debería verse como `https://github.com/Osvaldo973/tu-repositorio.git`) y ejecútalo así:
```bash
git remote add origin https://github.com/Osvaldo973/TU-REPOSITORIO.git
```
*(Reemplaza `TU-REPOSITORIO` con el nombre real de tu repositorio en GitHub).*

> 💡 **Nota:** Si por error ya existía un origen vinculado, puedes solucionarlo/actualizarlo corriendo:
> `git remote set-url origin https://github.com/Osvaldo973/TU-REPOSITORIO.git`

---

## Paso 7: Subir tus archivos a GitHub
Finalmente, empuja los archivos a tu repositorio remoto:
```bash
git push -u origin main
```
*Si es la primera vez, el sistema te pedirá autenticarte con tu cuenta de GitHub a través del navegador. Acepta el acceso y ¡listo! Tu proyecto estará publicado.*

---

## 🛠️ Comandos útiles para verificar que todo esté bien:
* **Ver el estado de los archivos**: `git status` (debería decir que todo está limpio una vez hecho el push).
* **Ver a qué enlace de GitHub está conectado**: `git remote -v`.
* **Ver el historial de commits**: `git log --oneline`.
