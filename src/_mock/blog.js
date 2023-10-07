import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  'Plantillas de Pizarra Blanca de Líderes de la Industria',
  'Remolque para camper inspirado en el Tesla Cybertruck para fanáticos de Tesla que no pueden esperar por la camioneta',
  'Diseño de la página de aterrizaje de Designify Agency',
  '✨ Lo que está hecho, está hecho ✨',
  'El Príncipe de Bel-Air',
  'Estudio Six Socks',
  'La obra "crossing over" de Vincenzo de Cotiis muestra una investigación sobre la contaminación',
  'Animaciones Sencillas y Atractivas en Tu Proyecto | Tutorial en Video',
  '40 Fuentes Serif Gratuitas para Diseñadores Digitales',
  'Examinando la Evolución del Cliente Típico de Diseño Web',
  'Katie Griffin ama crear arte hogareño',
  'El Sueño Americano contado a través de gráficos ferroviarios de mediados de siglo',
  'Diseño de Sistema de Ilustración',
  'App de Entrega CarZio - Inicio de Sesión/Registro de Conductores',
  'Cómo crear una aplicación Jamstack sin servidor cliente-servidor utilizando Netlify, Gatsby y Fauna',
  'Tylko Organiza sin esfuerzo - Diseño 3D y de Movimiento',
  'RAYO ?? Identidad expandida para un festival de artes visuales',
  'Anthony Burrill y Andrew Diprose de la revista Wired discuten cómo hicieron la portada de "Change Everything" de enero',
  'Dentro de la Mente de Samuel Day',
  'Revisión de Portafolio: ¿Este Portafolio es Demasiado Creativo?',
  'Akkers van Margraten',
  'Icono Gradiente de Boleta',
  '¡Aquí tienes un conceptos de motocicleta josaq que no "suciona"!',
  'Cómo Animar un SVG con border-image',
];

const posts = [...Array(23)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/assets/images/covers/cover_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.datatype.number(),
  comment: faker.datatype.number(),
  share: faker.datatype.number(),
  favorite: faker.datatype.number(),
  author: {
    name: faker.name.fullName(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
}));

export default posts;
