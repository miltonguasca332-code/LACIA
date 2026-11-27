# Lacia Puntocom — sitio web

Sitio web estático de Lacia Puntocom, preparado para publicarse en **GitHub Pages**. Está construido con HTML, CSS y JavaScript sin frameworks, bases de datos ni servicios de pago.

## 1. Estructura del proyecto

```text
lacia-puntocom/
├── index.html                 # Página principal y contenido
├── 404.html                   # Página para direcciones no encontradas
├── robots.txt
├── .nojekyll
├── css/
│   └── styles.css             # Diseño adaptable, colores y animaciones
├── js/
│   └── main.js                # Menú, galería y formulario de cotización
├── images/
│   ├── portada/
│   ├── mousepads/
│   ├── stickers/
│   ├── medallas/
│   ├── distintivos/
│   ├── estampado-textil/
│   ├── placas-trofeos/
│   └── cintas-carne/
└── favicon/
```

## 2. Cómo probar la página en tu computador

1. Descarga y descomprime el ZIP.
2. Abre la carpeta `lacia-puntocom`.
3. Haz doble clic en `index.html` para abrirlo en tu navegador.
4. Prueba el menú, los enlaces, el formulario y la vista móvil.
5. Para probar el envío final del formulario, completa los pasos y acepta el consentimiento. Se abrirá WhatsApp con el mensaje preparado; **el usuario todavía debe revisarlo y enviarlo**.

La fuente Poppins se carga desde Google Fonts. Si no hay conexión a internet, el navegador utilizará una fuente alternativa.

## 3. Publicar en GitHub Pages

1. Inicia sesión en GitHub y crea un repositorio público llamado `lacia-puntocom` (o utiliza el repositorio que ya tengas).
2. Entra al repositorio y selecciona **Add file → Upload files**.
3. Sube el contenido que está dentro de la carpeta `lacia-puntocom` de este ZIP. `index.html` debe quedar en la raíz del repositorio, no dentro de otra carpeta adicional.
4. Escribe un mensaje de confirmación, por ejemplo `Actualiza sitio web`, y selecciona **Commit changes**.
5. Abre **Settings → Pages**.
6. En **Build and deployment**, selecciona **Deploy from a branch**.
7. Selecciona la rama `main` y la carpeta `/ (root)`. Guarda los cambios.
8. Espera a que GitHub Pages publique el sitio. La dirección aparecerá en la misma sección de Pages.

Cada vez que actualices los archivos y confirmes los cambios en GitHub, Pages volverá a publicar el sitio.

## 4. Fotografías que debes agregar

Las imágenes del proyecto original no venían incluidas en el ZIP: las carpetas estaban vacías. Por eso la página muestra espacios de fotografía pendiente y no presenta imágenes inventadas como si fueran trabajos reales.

Agrega fotografías reales en las rutas siguientes. Respeta los nombres y las extensiones para que aparezcan automáticamente:

| Fotografía | Ruta y nombre esperado |
|---|---|
| Foto principal del taller o productos | `images/portada/foto-taller.webp` |
| Foto del proceso, equipo o espacio de trabajo | `images/portada/foto-proceso.webp` |
| Mousepads | `images/mousepads/mousepads-01.webp` |
| Stickers | `images/stickers/stickers-01.webp` |
| Medallas | `images/medallas/medallas-01.webp` |
| Estampillas y distintivos | `images/distintivos/distintivos-01.webp` |
| Estampado textil | `images/estampado-textil/estampado-01.webp` |
| Placas y trofeos | `images/placas-trofeos/placas-trofeos-01.webp` |
| Cintas para carné | `images/cintas-carne/cintas-carne-01.webp` |

La galería reutiliza algunas de las fotografías de categorías. Para agregar más imágenes a la galería, duplica un bloque `<button class="gallery-item ...">` en la sección `id="galeria"` de `index.html` y cambia la ruta, el texto alternativo y los datos `data-gallery-*`.

**Recomendaciones para las fotografías:**
- Utiliza fotografías propias de los productos o del negocio, con buena iluminación.
- Prefiere formato WebP o JPG optimizado. Si usas JPG, cambia también la extensión `.webp` por `.jpg` en la ruta correspondiente de `index.html`.
- Usa nombres cortos, en minúsculas y sin espacios.
- No reemplaces fotografías por imágenes de referencia que puedan confundirse con trabajos reales de Lacia Puntocom.
- Conserva una copia de las fotografías originales.

## 5. Formulario de cotización

El formulario tiene cuatro pasos:

1. Datos de contacto: nombre y teléfono/WhatsApp son obligatorios; correo y empresa son opcionales.
2. Selección de categoría.
3. Campos de detalle que cambian según la categoría elegida. Son opcionales para que el cliente pueda cotizar aunque no conozca todos los aspectos técnicos.
4. Resumen y consentimiento para el uso de los datos.

Al finalizar, se genera un mensaje organizado y se abre WhatsApp para el número **+57 316 285 4493**. El formulario no guarda datos, no envía información a un servidor y no confirma una cotización automáticamente.

## 6. Información del negocio incluida

- WhatsApp: +57 316 285 4493
- Instagram: https://www.instagram.com/laciapuntocom/
- Facebook: https://web.facebook.com/Laciaestampados/
- TikTok: https://www.tiktok.com/@laciapuntocom/
- Dirección: Laciapuntocom, Cl. 10 #27-05 Local 201A, Los Mártires, Bogotá, Cundinamarca, Colombia.

El mapa utiliza una búsqueda de Google Maps con la dirección suministrada. Conviene verificar que el pin corresponda exactamente al local antes de publicar.

## 7. Información pendiente de confirmar

Antes de considerar el sitio definitivo, confirma con la empresa:

- Las fotografías reales de productos, maquinaria, taller y procesos que se incorporarán.
- Que la dirección y la ubicación exacta del mapa correspondan al local actual.
- Si desea publicar un correo electrónico o un horario de atención (no se inventaron ni se incluyeron).
- Si las descripciones de las categorías representan exactamente la oferta vigente.
- El texto definitivo de autorización de tratamiento de datos personales, de acuerdo con la política de privacidad que utilice la empresa.
- Si desea agregar un aviso de privacidad o un enlace a su política de tratamiento de datos.

## 8. Personalización y mantenimiento

- **Textos y secciones:** edita `index.html`.
- **Colores, tamaños y distribución:** edita `css/styles.css`. Los colores de marca están definidos al inicio mediante variables CSS.
- **Menú, galería y formulario:** edita `js/main.js`.
- **Fotografías:** reemplaza o agrega archivos en `images/` y actualiza las rutas correspondientes en `index.html`.

No se requiere instalar paquetes ni ejecutar un proceso de compilación.
