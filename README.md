# QuímicaEduc — landing page

Página de inicio de https://quimicaeduc.org: catálogo de aplicaciones para enseñar química, con herramientas interactivas que funcionan en la misma página.

## Archivos

```
index.html        estructura y textos de la página
css/styles.css    estilos, temas claro/oscuro y animaciones
js/data.js        datos: elementos, áreas temáticas, catálogo de aplicaciones, moléculas
js/art.js         ilustraciones SVG de cada aplicación del catálogo
js/main.js        interacción: visor 3D, filtros, masa molar, pH, tabla periódica
```

Es HTML, CSS y JavaScript sin dependencias ni compilación: basta con subir la carpeta completa a la raíz del sitio. Solo carga las fuentes desde Google Fonts.

## Cambios frecuentes

- **Agregar o actualizar una aplicación**: edite `QE.apps` en `js/data.js`. Cada aplicación tiene `name`, `areas` (ids de `QE.areas`), `levels` (`colegio` y/o `universidad`), `text`, `tags` y `status`:
  - `status: 'disponible'` con `url` (enlace externo o `#seccion` de esta página);
  - `status: 'pronto'` para las que están en desarrollo (se muestran como «Próximamente»).

  Los contadores de cada área se calculan solos.
- **Imagen de una aplicación**: cada tarjeta muestra la ilustración indicada en su campo `art` (por ejemplo `art: 'ir'`). Las ilustraciones son SVG en `QE.art` (`js/art.js`) dibujados con las clases `a-ln`, `a-fl`, `a-ac`, `a-soft`, `a-tx`…, que toman el color del área principal y se adaptan al tema claro u oscuro. Para una aplicación nueva, añada una clave en `QE.art` y póngala en `art`.
- **Tras cambiar CSS o JS**: suba el número `?v=` de los enlaces en `index.html` para que los navegadores no usen la versión en caché.
- **Correo de contacto**: cambie `contacto@quimicaeduc.org` en `index.html` (sección «Para docentes») por la dirección real.
- **Áreas temáticas**: `QE.areas` en `js/data.js` (símbolo de dos letras, nombre, tono de color y descripción).

## Secciones

1. Hero con visor molecular 3D (agua, metano, amoníaco, CO₂, etanol, benceno): se gira arrastrando o con las flechas del teclado.
2. Áreas temáticas presentadas como fichas de elementos; el número indica cuántas aplicaciones tiene cada área.
3. Catálogo con búsqueda y filtros por área y nivel.
4. Laboratorio: calculadora de masa molar (paréntesis, corchetes e hidratos) e indicador universal de pH.
5. Tabla periódica interactiva de los 118 elementos (masa, grupo, periodo y configuración electrónica).
6. Cómo funciona, sección para docentes, preguntas frecuentes y pie.

Respeta el modo oscuro del sistema (con botón para cambiarlo), funciona en celular y reduce las animaciones si el usuario lo pide en su sistema (`prefers-reduced-motion`).
