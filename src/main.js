/* =========================================================
   AÑO ACTUAL EN EL FOOTER
========================================================= */

/*
document.getElementById('year').textContent =
  'Invitaciones digitales · © ' + new Date().getFullYear();

*/

/* =========================================================
   MÚSICA
========================================================= */

let audio = null;
let musicPlaying = false;

const musicBtn =
  document.getElementById('floating-music-btn');


/* =========================================================
   APERTURA DE LA PORTADA
========================================================= */

const cover =
  document.getElementById('cover');

const content =
  document.getElementById('content');


cover.addEventListener('click', () => {

  cover.classList.add('hidden');

  content.classList.add('show');

  musicBtn.classList.add('show');


  /*
     Creamos el audio solamente la primera vez
  */

  if (!audio) {

    audio = new Audio('assets/Musica_fondo.mpeg');

    audio.loop = true;

    audio.volume = 0.35;
  }


  /*
     Intentamos reproducir la música
  */

  audio.play()
    .then(() => {

      musicPlaying = true;

      updateMusicButton();

    })
    .catch(error => {

      console.log(
        'Audio bloqueado por el navegador:',
        error
      );

      musicPlaying = false;

      updateMusicButton();

    });

});


/* =========================================================
   ACTUALIZAR BOTÓN DE MÚSICA
========================================================= */

function updateMusicButton() {

  if (!musicBtn) return;


  if (musicPlaying) {

    /*
       Música reproduciéndose
       → mostramos PAUSA
    */

    musicBtn.classList.add('is-playing');

    musicBtn.setAttribute(
      'aria-label',
      'Pausar música'
    );

  } else {

    /*
       Música pausada
       → mostramos PLAY
    */

    musicBtn.classList.remove('is-playing');

    musicBtn.setAttribute(
      'aria-label',
      'Reproducir música'
    );

  }

}


/* =========================================================
   BOTÓN MÚSICA FLOTANTE
========================================================= */

function toggleMusic() {

  if (!audio) return;


  if (musicPlaying) {

    /*
       PAUSAR
    */

    audio.pause();

    musicPlaying = false;

    updateMusicButton();

  } else {

    /*
       REPRODUCIR
    */

    audio.play()
      .then(() => {

        musicPlaying = true;

        updateMusicButton();

      })
      .catch(error => {

        console.log(
          'No se pudo reproducir la música:',
          error
        );

        musicPlaying = false;

        updateMusicButton();

      });

  }

}


/* =========================================================
   EVENTO DEL BOTÓN
========================================================= */

if (musicBtn) {

  musicBtn.addEventListener(
    'click',
    toggleMusic
  );

}


/* =========================================================
   PAUSAR MÚSICA AL SALIR DE LA APP / PESTAÑA

   La Page Visibility API avisa cuando el documento deja de
   estar visible: el usuario cambia de pestaña, bloquea la
   pantalla del celular, o pasa a otra app. En todos esos
   casos "document.hidden" pasa a true.

   Al volver, la música queda pausada (no se reanuda sola)
   y el botón flotante refleja el estado correcto para que
   el usuario la retome con un toque si quiere.
========================================================= */

document.addEventListener('visibilitychange', () => {

  if (document.hidden) {

    if (audio && musicPlaying) {

      audio.pause();

      musicPlaying = false;

      updateMusicButton();

    }

  }

});


/* =========================================================
   CUENTA REGRESIVA
========================================================= */

/*
   BODA:
   10 de octubre de 2026
   20:00 hs
   Argentina (UTC-3)
*/

const TARGET_DATE =
  new Date(
    '2026-10-10T18:00:00-03:00'
  ).getTime();


const cdContainer =
  document.getElementById('cd');


if (cdContainer) {

  function tick() {

    const diff =
      Math.max(
        0,
        TARGET_DATE - Date.now()
      );


    const days =
      Math.floor(
        diff / 86400000
      );


    const hours =
      Math.floor(
        (diff % 86400000) / 3600000
      );


    const minutes =
      Math.floor(
        (diff % 3600000) / 60000
      );


    const seconds =
      Math.floor(
        (diff % 60000) / 1000
      );


    const map = {

      d: days,

      h: hours,

      m: minutes,

      s: seconds

    };


    cdContainer
      .querySelectorAll('[data-k]')
      .forEach(el => {

        el.textContent =
          String(
            map[el.dataset.k]
          ).padStart(2, '0');

      });

  }


  tick();

  setInterval(
    tick,
    1000
  );

}


/* =========================================================
   FORMULARIO CONFIRMACION DE INVITACION -> WHATSAPP
========================================================= */

const rsvpForm =
  document.getElementById('rsvp');

if (rsvpForm) {

  rsvpForm.addEventListener('submit', e => {

    e.preventDefault();


    /* =====================================================
       OBTENER DATOS DEL FORMULARIO
    ===================================================== */

    const nombre =
      rsvpForm
        .querySelector('input[type="text"]')
        .value
        .trim();


    const asistencia =
      rsvpForm.querySelector(
        'input[name="attend"]:checked'
      );


    const asistira =
      asistencia &&
      asistencia.parentElement.textContent.trim();


    const inputs =
      rsvpForm.querySelectorAll(
        'input[type="text"]'
      );


    const acompanantes =
      inputs[1].value.trim();


    const restricciones =
      inputs[2].value.trim();


    /* =====================================================
       VALIDAR NOMBRE
    ===================================================== */

    if (!nombre) {

      alert(
        'Por favor, ingresá tu nombre completo.'
      );

      return;

    }


    /* =====================================================
       ¿VA A ASISTIR?

       Se detecta comparando el texto de la opción marcada
       ("Sí, allí estaré." vs "Lo siento, no podré asistir.").
       Alcanza con revisar si arranca con "Sí"/"Si"
       (sin importar mayúscula/tilde), así sigue funcionando
       aunque se retoque ligeramente el texto de las opciones.
    ===================================================== */

    const vaAsistir =
      !!asistira &&
      /^s[ií]/i.test(asistira);


    /* =====================================================
       NÚMERO DE WHATSAPP
    ===================================================== */

    const telefono =
      '5493875720620';


    /* =====================================================
       EMOJIS

       Se construyen a partir de su código numérico
       (String.fromCodePoint) en lugar de escribir el
       carácter o el escape "\u{...}" directamente.

       Esto los hace inmunes a problemas de encoding del
       archivo/servidor: el código fuente de esta parte
       queda compuesto solo por dígitos ASCII, que ninguna
       codificación (UTF-8, Latin-1, etc.) puede corromper.
       Si en algún punto de la cadena (editor, servidor,
       navegador vía file://) algo interpreta mal el archivo,
       los "\u{1F48D}" escritos como texto podían llegar a
       corromperse; los códigos numéricos, no.
    ===================================================== */

    const emojiAnillo =
      String.fromCodePoint(0x1F48D);

    const emojiConfirmacion =
      String.fromCodePoint(0x1F4CB);

    const emojiAcompanantes =
      String.fromCodePoint(0x1F465);

    const emojiComida =
      String.fromCodePoint(0x1F37D, 0xFE0F);

    const emojiCorazon =
      String.fromCodePoint(0x2764, 0xFE0F);


    /* =====================================================
       CONSTRUIR MENSAJE

       - Si va a asistir: nombre + confirmación + acompañantes
         + restricciones alimentarias.
       - Si NO va a asistir: solo nombre + confirmación.
         (acompañantes/restricciones no aplican y no se envían)
    ===================================================== */

    let mensaje =
      `${emojiAnillo} *Confirmación de Invitación*\n\n` +
      `Hola! Soy *${nombre}*.\n\n` +
      `${emojiConfirmacion} *Confirmación de asistencia:*\n` +
      `${asistira}\n\n`;


    if (vaAsistir) {

      /* =====================================================
         ACOMPAÑANTES
      ===================================================== */

      if (acompanantes) {

        mensaje +=
          `${emojiAcompanantes} *Acompañante/s:*\n` +
          `${acompanantes}\n\n`;

      } else {

        mensaje +=
          `${emojiAcompanantes} *Acompañante/s:*\n` +
          `Ninguno\n\n`;

      }


      /* =====================================================
         RESTRICCIONES ALIMENTARIAS
      ===================================================== */

      if (restricciones) {

        mensaje +=
          `${emojiComida} *Restricciones alimentarias:*\n` +
          `${restricciones}\n\n`;

      } else {

        mensaje +=
          `${emojiComida} *Restricciones alimentarias:*\n` +
          `Ninguna\n\n`;

      }

    }


    /* =====================================================
       DESPEDIDA
    ===================================================== */

    mensaje +=
      `Gracias! ${emojiCorazon}`;


    /* =====================================================
       CREAR URL DE WHATSAPP
    ===================================================== */

    const url =
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;


    /* =====================================================
       ABRIR WHATSAPP
    ===================================================== */

    window.open(
      url,
      '_blank'
    );


    /* =====================================================
       MOSTRAR MENSAJE DE AGRADECIMIENTO
    ===================================================== */

    rsvpForm.style.display =
      'none';


    const thanks =
      document.getElementById('thanks');


    if (thanks) {

      thanks.style.display =
        'block';

    }

  });

}

/* =========================================================
   SWIPER - GALERÍA
========================================================= */

if (
  document.querySelector(
    '.momentosSwiper'
  )
) {

  new Swiper(
    '.momentosSwiper',
    {

      loop: true,

      spaceBetween: 20,


      pagination: {

        el:
          '.swiper-pagination',

        clickable: true

      },


      navigation: {

        nextEl:
          '.swiper-button-next',

        prevEl:
          '.swiper-button-prev'

      },


      breakpoints: {

        0: {

          slidesPerView: 1

        },

        768: {

          slidesPerView: 2

        }

      }

    }
  );

}