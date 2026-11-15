// Datos de la clienta. PRIVACIDAD: aquí solo va el nombre de pila.
// Nada de apellido, edad, peso, estatura, escuela, teléfono ni diagnósticos.
window.CLIENTE = {
  nombre: 'Lynette',
  subtitulo: 'Marca cada ejercicio cuando lo termines. Siempre con un adulto o instructor 👩‍🏫',
  marca: { nombre: 'Mi Rutina', color: '#36b37e' },
  diasMeta: 5,                 // días completos por semana para "semana cumplida"
  agua: { min: 6, max: 8 },    // vasos al día

  reglas: [
    '🔁 2–3 series de 12–15',
    '🤏 Que te sobren 2–3 repeticiones',
    '⏱️ Descansa 60–90 seg',
    '🚫 Nunca al fallo ni pesos máximos'
  ],
  precauciones: [
    'Si algo te duele, para ese ejercicio y avisa a un adulto.',
    'Nada de saltos, sentadillas profundas ni desplantes hasta que te revise el doctor.'
  ],

  // 7 días: lunes a domingo. id = ejercicio de app/ejercicios.js
  // d = series/tiempo en el gym · ds = series/tiempo en modo "Sin máquinas" (opcional)
  dias: [
    { titulo: 'LUNES · Tren superior 💪', color: '#e4f0fb', items: [
      { id: 'bici', d: '5–10 min' },
      { id: 'jalon', d: '2–3 × 12–15', ds: '2–3 × 10' },
      { id: 'press_pecho', d: '2–3 × 12–15', ds: '2–3 × 8–12' },
      { id: 'remo', d: '2–3 × 12–15', ds: '2–3 × 12 por lado' },
      { id: 'press_hombro', d: '2–3 × 12–15' },
      { id: 'plancha', d: '3 × 20–30 seg' },
      { id: 'estirar', d: '5 min' }
    ]},
    { titulo: 'MARTES · Cardio y abdomen ❤️', color: '#ffeedd', items: [
      { id: 'bici', d: '5–10 min' },
      { id: 'eliptica', d: '20–30 min' },
      { id: 'plancha', d: '3 × 20–30 seg' },
      { id: 'bicho_muerto', d: '2–3 × 10 por lado' },
      { id: 'estirar', d: '5 min' }
    ]},
    { titulo: 'MIÉRCOLES · Piernas con cuidado 🦵', color: '#e5f6ec', items: [
      { id: 'bici', d: '5–10 min' },
      { id: 'puente', d: '2–3 × 12–15' },
      { id: 'abductores', d: '2–3 × 12–15', ds: '2–3 × 12 por lado' },
      { id: 'prensa', d: '2–3 × 12–15 · poco peso, rango corto', ds: '2–3 × 8–10 por lado' },
      { id: 'curl_femoral', d: '2–3 × 12–15', ds: '2–3 × 10' },
      { id: 'pantorrillas', d: '2–3 × 15' },
      { id: 'estirar', d: '5 min' }
    ]},
    { titulo: 'JUEVES · Cuerpo completo 🔄', color: '#efe9fb', nota: 'Circuito ligero: uno tras otro, descansa 60–90 seg al terminar la vuelta. Haz 2 vueltas.', items: [
      { id: 'bici', d: '5–10 min' },
      { id: 'jalon', d: '12–15', ds: '10' },
      { id: 'puente', d: '12–15' },
      { id: 'press_pecho', d: '12–15', ds: '8–12' },
      { id: 'curl_femoral', d: '12–15', ds: '10' },
      { id: 'remo', d: '12–15', ds: '12 por lado' },
      { id: 'plancha', d: '20–30 seg' },
      { id: 'estirar', d: '5 min' }
    ]},
    { titulo: 'VIERNES · Cardio divertido 🎉', color: '#fff6dc', nota: 'Elige uno: nadar, bailar (sin saltos) o caminar rápido.', items: [
      { id: 'calentar_suave', d: '5–10 min' },
      { id: 'cardio_libre', d: '30–40 min' },
      { id: 'estirar', d: '5 min' }
    ]},
    { titulo: 'SÁBADO · Descanso activo 🌿', color: '#e5f6ec', nota: 'Hoy tu cuerpo se recupera.', items: [
      { id: 'caminata', d: '20–30 min' },
      { id: 'estirar', d: '5–10 min' }
    ]},
    { titulo: 'DOMINGO · Descanso activo 🌿', color: '#e5f6ec', nota: 'Hoy tu cuerpo se recupera. ¡Manda tu resumen de la semana! 📲', items: [
      { id: 'caminata', d: '20–30 min' },
      { id: 'estirar', d: '5–10 min' }
    ]}
  ]
};
