# Mi Rutina: plantilla para clientes

Cada cliente tiene su propia carpeta con su link personal. Todos comparten la misma app (`app/`).

```
rutinas/
├── app/                  ← la app (no se toca por cliente)
│   ├── app.js            ← lógica: calendario, casillas, logros, respaldo
│   ├── app.css           ← diseño
│   ├── ejercicios.js     ← biblioteca de ejercicios y sus suplentes sin máquina
│   └── ejercicios.jpg    ← fotos (free-exercise-db, dominio público)
├── c/
│   └── lynette-k7q2xm/   ← un cliente = una carpeta
│       ├── index.html    ← igual para todos
│       └── config.js     ← SU rutina, nombre y precauciones
├── plantilla-cliente/    ← copia esta carpeta para cada cliente nuevo
├── index.html            ← portada genérica (no muestra a ningún cliente)
└── robots.txt            ← le pide a Google que no indexe nada
```

## Agregar un cliente nuevo (5 minutos)

1. Copia la carpeta `plantilla-cliente` dentro de `c/`.
2. Renómbrala `nombre-` + 6 letras o números al azar, por ejemplo `maria-p3x9rt`.
   Las letras al azar evitan que alguien adivine el link de otra persona.
3. Abre `config.js` y cambia:
   - `nombre`: **solo el nombre de pila**.
   - `dias`: los ejercicios de cada día. Los `id` están en `app/ejercicios.js`.
   - `precauciones` y `reglas` según la persona.
4. Súbela a GitHub. Su link queda así:
   `https://TU-USUARIO.github.io/rutinas/c/maria-p3x9rt/`

### Opcional en `config.js`

- `comidas`: lista de comidas para marcar. Si no la pones, usa las 5 del plan (desayuno, colación, comida, snack antes del gym, cena).
- `motivos`: motivos del botón "Hoy no puedo entrenar". Ejemplo: `[['trabajo','💼 Trabajo'], ['otro','🤷 Otro']]`.

## Reglas de privacidad

En `config.js` **solo** van:
- Nombre de pila.
- Su rutina, reglas y precauciones generales (por ejemplo, "nada de saltos").

**Nunca** pongas: apellido, edad, peso, estatura, escuela, dirección, teléfono, fotos ni diagnósticos.
Esos datos guárdalos tú, fuera de GitHub.

Las marcas de cada cliente (casillas, agua, pesos, dolor) **no se suben a internet**: se quedan en su teléfono.
Para que tú las veas, el cliente te manda su resumen semanal por WhatsApp.

## Agregar un ejercicio nuevo

En `app/ejercicios.js` agrega una línea:

```js
mi_ejercicio: { n:'Nombre en español', emo:'🤸', tip:'Consejo corto', sub:'otro_id' },
```

- `emo`: un emoji, si no tiene foto.
- `img`: solo si su foto ya está en `ejercicios.jpg`.
- `pesas:true`: muestra la casilla para anotar el peso.
- `sub`: el ejercicio que se usa en modo "Sin máquinas".

## Ideas que vienen de otras apps

| App | Qué tomamos | Cómo lo adaptamos |
|---|---|---|
| Trainerize / TrueCoach / Everfit | Rutina asignada por el coach + check-in semanal | `config.js` por cliente + "¿Cómo me fue esta semana?" en el resumen |
| My PT Hub | App con tu marca | `marca.nombre` y `marca.color` |
| Hevy / Strong | Anotar el peso y ver el récord, cronómetro de descanso | "Peso usado", pestaña "Mi fuerza", botón ⏱️ 60/90 seg |
| Fitbod | Progresión automática | Regla sencilla: si te sobran más de 3 repeticiones dos veces, sube un poquito |
| Streaks | Rachas | "Semanas seguidas" (por semana, no por día, para no presionar) |
| Loop Habit Tracker | Sin cuenta, con exportación de datos | Datos solo en el teléfono + respaldo copiable |
| Habitica | Logros y juego | 9 insignias en "Mi semana" |

Lo que **no** copiamos a propósito: contar calorías, pesarse, rankings contra otras personas y chats dentro de la app (por privacidad y porque hay menores de edad).
