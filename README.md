# 🪐 Galaxia Matemática

Aventura espacial para aprender matemática de **2.º y 3.er año** (diseño curricular de Córdoba). Cada bloque es un planeta y cada tema, una misión con:

- 📖 **Teoría** breve con ejemplos y tips.
- 🧪 **Simulador** interactivo (balanza de ecuaciones, explorador de cuadriláteros, Pitágoras, trigonometría, gráficos de funciones y más).
- ✏️ **Práctica** de 10 ejercicios que se generan al azar (nunca se repiten), con corrección y explicación. 6, 8 y 10 aciertos dan 1, 2 y 3 estrellas.
- 🎮 **Juego**: *Lluvia de asteroides* o *Carrera contrarreloj*. También hay un desafío mixto por planeta.

Además: experiencia (XP), rangos, 12 logros, sonidos y modo celular. El progreso se guarda en el navegador de cada alumno. No hace falta crear cuentas.

**Para el docente:** el botón 🖨️ de cada misión arma una hoja con 12 ejercicios nuevos y, en otra página, sus respuestas.

## Publicar en Netlify (5 minutos)
1. Entrá a https://app.netlify.com/drop (con tu cuenta iniciada).
2. Arrastrá **esta carpeta** (la que tiene `index.html`).
3. Listo: compartí el enlace o cambiale el nombre en *Project configuration → Change project name*.

Para actualizarla: en Netlify → tu sitio → **Deploys** → arrastrá la carpeta nueva.

## Probar en tu compu
Abrí `index.html` con doble clic: funciona sin internet ni servidor (las fuentes necesitan conexión, pero la app anda igual).

## Para modificar el código
El código fuente está en `js/` (app.js, content2.js, content3.js, widgets.js, util.js). La página carga `js/galaxia.bundle.js`, que es todo eso junto. Después de editar, regeneralo con:
`npx esbuild js/app.js --bundle --format=iife --minify --outfile=js/galaxia.bundle.js`

## Contenidos
| Año | Planeta | Misiones |
|---|---|---|
| 2.º | Zeta (enteros) | Comparar y ubicar · Operaciones y propiedades · Cálculos combinados |
| 2.º | Equis (álgebra) | Fórmulas para contar · Fórmulas equivalentes · Ecuaciones ax+b=cx+d · Problemas y tipos de solución |
| 2.º | Fracción (racionales) | Representaciones · Orden, discretitud y densidad · Operaciones y propiedades · Estrategias con decimales |
| 2.º | Polígono (geometría) | Clasificar cuadriláteros · Argumentar · Construir con datos · Instrumentos y graficadores · Ángulos y diagonales · Perímetros y áreas |
| 2.º | Datos (estadística) | Leer gráficos · Frecuencias · Elegir gráficos · Media y moda |
| 3.º | Potencia (racionales) | Operaciones y potencias · Radicación |
| 3.º | Pitágoras (geometría) | Pitágoras · Trigonometría · Thales · Reconocer cuerpos · Áreas · Volúmenes |
| 3.º | Función (álgebra y funciones) | Proporcionalidad · Análisis de gráficos · Parámetros de y=ax+b · Gráficos lineales · Producir fórmulas · Ecuaciones |
