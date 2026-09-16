/* ============================================================
   NonnoIA — navegación entre pantallas y lógica de conversación
   ============================================================ */

(function () {
  'use strict';

  // Historial de pantallas visitadas, para que "Atrás" tenga sentido
  var history = ['welcome'];

  var screens = {
    welcome: document.getElementById('screen-welcome'),
    menu: document.getElementById('screen-menu'),
    chat: document.getElementById('screen-chat')
  };

  var backBtn = document.getElementById('backBtn');

  function showScreen(name, opts) {
    opts = opts || {};
    Object.keys(screens).forEach(function (key) {
      screens[key].hidden = key !== name;
    });
    backBtn.hidden = name === 'welcome';

    if (!opts.isBack) {
      history.push(name);
    }
  }

  backBtn.addEventListener('click', function () {
    if (history.length > 1) {
      history.pop(); // quita la pantalla actual
      var previous = history[history.length - 1];
      showScreen(previous, { isBack: true });
    }
  });

  // ---------- Pantalla 1 → 2 ----------
  document.getElementById('continueBtn').addEventListener('click', function () {
    showScreen('menu');
  });

  document.getElementById('termsLink').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Aquí se mostrarían los términos y condiciones completos.');
  });

  // ---------- Pantalla 2 → 3 ----------
  document.getElementById('startChatBtn').addEventListener('click', function () {
    showScreen('chat');
  });

  // Respuestas de ejemplo para las preguntas frecuentes
  var faqAnswers = {
    '¿Cómo contesto un mensaje?':
      'Toque el mensaje que quiere responder, escriba su respuesta en el cuadro de texto de abajo y presione la flecha azul para enviarlo.',
    '¿Cómo subo una foto?':
      'Toque el ícono de la cámara o el clip que aparece junto al cuadro de texto, elija la foto en su galería y presione enviar.',
    '¿Qué es una red social?':
      'Es una aplicación donde las personas comparten mensajes, fotos y videos con familiares y amigos, como WhatsApp o Facebook.'
  };

  document.getElementById('faqList').addEventListener('click', function (e) {
    var button = e.target.closest('[data-question]');
    if (!button) return;
    var question = button.getAttribute('data-question');
    showScreen('chat');
    addBubble(question, 'user');
    respondTo(question);
  });

  // ---------- Pantalla 3: composer ----------
  var chatLog = document.getElementById('chatLog');
  var form = document.getElementById('composerForm');
  var input = document.getElementById('questionInput');
  var micBtn = document.getElementById('micBtn');
  var micHint = document.getElementById('micHint');

  function addBubble(text, who) {
    var bubble = document.createElement('div');
    bubble.className = 'bubble bubble--' + who;
    bubble.textContent = text;
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function respondTo(question) {
    var answer = faqAnswers[question] ||
      'Buena pregunta. Un momento mientras busco la mejor forma de explicárselo.';
    // Pequeña pausa para simular que el asistente está "pensando"
    window.setTimeout(function () {
      addBubble(answer, 'bot');
    }, 500);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addBubble(text, 'user');
    input.value = '';
    respondTo(text);
  });

  // ---------- Botón de micrófono (pregunta por voz) ----------
  var isRecording = false;

  micBtn.addEventListener('click', function () {
    isRecording = !isRecording;
    micBtn.classList.toggle('is-recording', isRecording);

    if (isRecording) {
      micHint.textContent = 'Escuchando… toque de nuevo para terminar';
    } else {
      micHint.textContent = 'Diga su pregunta, nosotros la transcribimos';
      addBubble('(pregunta transcrita desde su nota de voz)', 'user');
      respondTo(null);
    }
  });
})();
