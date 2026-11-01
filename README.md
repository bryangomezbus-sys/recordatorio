# MeloAir

Aplicación web adaptable e instalable en celulares (PWA) para registrar aires acondicionados, programar mantenimientos y consultar recordatorios e historial. Utiliza Supabase para autenticación y almacenamiento multiusuario.

## Funciones

- Registro, edición, búsqueda y eliminación de equipos.
- Registro y edición de mantenimientos.
- Frecuencias automáticas de 1, 3, 6 o 12 meses, o selección manual de fecha.
- Panel con equipos, mantenimientos próximos, atrasados y realizados.
- Centro de recordatorios e historial exportable a CSV.
- Confirmación dentro de MeloAir antes de eliminar equipos o mantenimientos.
- Interfaz adaptable a escritorio y celular; instalación como PWA.
- Notificaciones del sistema identificadas como **MeloAir**, emitidas por el service worker.

## Tecnologías

- HTML, CSS y JavaScript.
- Supabase JS v2 (Auth y PostgREST).
- Supabase PostgreSQL con Row Level Security (RLS).
- PWA: Web App Manifest y Service Worker.

## Requisitos

- Proyecto Supabase.
- Navegador moderno.
- Servir la aplicación por HTTPS (o `localhost` durante desarrollo). Service workers y notificaciones no funcionan correctamente al abrir `index.html` directamente como archivo.

## Configuración de Supabase

1. En Supabase, abre **SQL Editor** y ejecuta el contenido de `supabase/schema.sql`.
2. Abre **Project Settings → API** y copia la Project URL y la clave pública `anon`/`publishable`.
3. Edita `js/config.js` y reemplaza los valores de ejemplo:

```js
window.MELOAIR_CONFIG = {
  SUPABASE_URL: "https://TU-PROYECTO.supabase.co",
  SUPABASE_ANON_KEY: "TU_CLAVE_PUBLICA"
};
```

4. No pongas una clave `service_role` en el navegador. La clave pública está pensada para el cliente y las tablas usan RLS.
5. En Supabase Auth, configura las URL permitidas (Site URL y Redirect URLs) para el dominio donde publiques MeloAir.

## Ejecutar en local

Desde la carpeta del proyecto, inicia un servidor estático. Por ejemplo, con Python:

```bash
python -m http.server 8080
```

Abre `http://localhost:8080`. Para acceso desde otros dispositivos o producción, publica la carpeta en un hosting HTTPS.

## Aplicación móvil

MeloAir se entrega como PWA instalable, no como APK/IPA nativo. Usa la misma cuenta y base de datos desde web y celular.

- **Android:** abre la URL HTTPS de MeloAir en Chrome y selecciona **Instalar aplicación** o **Añadir a pantalla de inicio**.
- **iPhone/iPad:** abre la URL en Safari, pulsa **Compartir → Añadir a pantalla de inicio**.
- Inicia sesión con la misma cuenta para ver los mismos equipos y mantenimientos.

## Notificaciones

Pulsa **Activar notificaciones de MeloAir** desde el centro de recordatorios y acepta el permiso del sistema. Las notificaciones locales se presentan con el nombre e icono de MeloAir mediante el service worker. El permiso se solicita para la aplicación web instalada y el aviso aparece en el sistema operativo.

**Importante:** esta entrega muestra avisos cuando la aplicación está abierta y detecta recordatorios próximos o vencidos. Para enviar notificaciones push programadas cuando la aplicación está cerrada, hace falta configurar un servicio push con claves VAPID y una función de servidor (por ejemplo, Supabase Edge Functions + tarea programada). El listener `push` del service worker ya está preparado para recibir esos mensajes, pero las claves y el envío remoto no se pueden activar sin credenciales del proyecto.

## Seguridad y datos

- Cada fila pertenece al usuario autenticado (`user_id`).
- RLS limita lectura, inserción, actualización y eliminación al propietario.
- El borrado de un equipo puede borrar sus mantenimientos relacionados por la regla `ON DELETE CASCADE`; MeloAir solicita confirmación antes.
- No compartas tu clave privada `service_role`.

## Estructura

```text
MeloAir/
├── index.html
├── manifest.webmanifest
├── sw.js
├── README.md
├── MANUAL_USUARIO.pdf
├── css/styles.css
├── js/app.js
├── js/config.js
├── icons/
└── supabase/schema.sql
```
