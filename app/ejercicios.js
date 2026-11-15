// Biblioteca de ejercicios compartida por todos los clientes.
// img = nombre dentro de ejercicios.jpg (fotos de free-exercise-db, dominio público)
// pesas = muestra la casilla para anotar el peso usado
// sub = ejercicio que se usa en modo "Sin máquinas"

window.SPRITE = ['bicycling_stationary','butt_lift_bridge','dead_bug','elliptical_trainer','hamstring_stretch','incline_push-up','leg_press','leverage_chest_press','lying_leg_curls','one-arm_dumbbell_row','plank','platform_hamstring_slides','seated_cable_rows','seated_dumbbell_press','side_leg_raises','single_leg_glute_bridge','standing_calf_raises','standing_dumbbell_calf_raise','standing_dumbbell_press','superman','thigh_abductor','walking_treadmill','wide-grip_lat_pulldown'];

window.EJERCICIOS = {
  // Calentamiento y estiramiento
  bici:            { n:'Calentamiento en bici o caminadora', img:'bicycling_stationary', sub:'marchar' },
  marchar:         { n:'Calentamiento: caminar o marchar en tu lugar', emo:'🚶' },
  calentar_suave:  { n:'Calentamiento suave', emo:'🚶' },
  estirar:         { n:'Estiramiento final', img:'hamstring_stretch', tip:'Suave, sin rebotes. Puedes usar una toalla o liga.' },

  // Tren superior
  jalon:           { n:'Jalón al pecho en máquina', img:'wide-grip_lat_pulldown', pesas:true, tip:'Baja la barra al pecho, nunca detrás de la nuca.', sub:'superman' },
  superman:        { n:'Superman en el piso', img:'superman', tip:'Boca abajo, sube brazos y piernas poquito y sostén 2 seg.' },
  press_pecho:     { n:'Press de pecho en máquina', img:'leverage_chest_press', pesas:true, sub:'lagartijas' },
  lagartijas:      { n:'Lagartijas inclinadas', img:'incline_push-up', tip:'Manos en una mesa, banca o pared.' },
  remo:            { n:'Remo sentado', img:'seated_cable_rows', pesas:true, tip:'Espalda derecha, jala con los codos.', sub:'remo_botella' },
  remo_botella:    { n:'Remo a un brazo', img:'one-arm_dumbbell_row', tip:'Usa una botella de agua o una mochila ligera.' },
  press_hombro:    { n:'Press de hombro con mancuernas ligeras', img:'seated_dumbbell_press', pesas:true, sub:'press_botellas' },
  press_botellas:  { n:'Press de hombro con botellas', img:'standing_dumbbell_press', tip:'Botellas de agua de 1 litro.' },

  // Abdomen
  plancha:         { n:'Plancha', img:'plank', tip:'Si es difícil, apoya las rodillas en un tapete.' },
  bicho_muerto:    { n:'Bicho muerto (dead bug)', img:'dead_bug', tip:'Espalda baja pegada al piso.' },

  // Piernas (sin impacto)
  puente:          { n:'Puente de glúteo', img:'butt_lift_bridge', tip:'Aprieta glúteos arriba 1 segundo.' },
  abductores:      { n:'Abductores en máquina', img:'thigh_abductor', pesas:true, sub:'pierna_lado' },
  pierna_lado:     { n:'Pierna al lado, de pie', img:'side_leg_raises', tip:'Detente de una silla. Movimiento lento.' },
  prensa:          { n:'Prensa de piernas', img:'leg_press', pesas:true, tip:'Poco peso y rango corto: no dobles mucho las rodillas.', sub:'puente_una' },
  puente_una:      { n:'Puente a una pierna', img:'single_leg_glute_bridge', tip:'Si es difícil, hazlo con las dos piernas.' },
  curl_femoral:    { n:'Curl femoral', img:'lying_leg_curls', pesas:true, sub:'talones_toalla' },
  talones_toalla:  { n:'Deslizar talones con toalla', img:'platform_hamstring_slides', tip:'Acostado/a, talones sobre una toalla: jálalos hacia ti.' },
  pantorrillas:    { n:'Pantorrillas', img:'standing_calf_raises', pesas:true, sub:'talones_pared' },
  talones_pared:   { n:'Subir talones de pie', img:'standing_dumbbell_calf_raise', tip:'Sin peso, detente de la pared.' },

  // Cardio
  eliptica:        { n:'Bici o elíptica', img:'elliptical_trainer', tip:'Ritmo cómodo: puedes platicar.', sub:'caminar_rapido' },
  caminar_rapido:  { n:'Caminar rápido', img:'walking_treadmill', tip:'En un lugar seguro y acompañado/a.' },
  cardio_libre:    { n:'Nadar 🏊 · Bailar 💃 · Caminar rápido 🚶', emo:'🏊💃', tip:'Bailar: sin brincos ni giros bruscos.' },
  caminata:        { n:'Caminata tranquila', emo:'🚶' }
};
