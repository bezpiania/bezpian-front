/**
 * Genera el HTML completo del bubble widget.
 * El usuario copia, guarda como .html y funciona igual que demo-imfluid.html.
 * Patrón: botón FUERA del iframe, chat aparece encima animado.
 */
export function generateBubbleWidgetHtml({ botId, embedKey, color = '#667eea', avatar = '🤖', name = 'Asistente', apiUrl, appUrl }) {
  const colorEncoded  = encodeURIComponent(color);
  const avatarEncoded = encodeURIComponent(avatar);
  const nameEncoded   = encodeURIComponent(name);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}</title>
  <style>
    /* Tu contenido de página va aquí */
    body { margin: 0; font-family: sans-serif; background: #f9f9f9; }

    #zapien-iframe {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: min(400px, calc(100vw - 40px));
      height: min(520px, calc(100dvh - 130px));
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      z-index: 99998;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 220ms ease, opacity 220ms ease;
    }
    #zapien-iframe.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    #zapien-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      background: ${color};
      color: white;
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.22);
      z-index: 99999;
      cursor: pointer;
      transition: transform 0.15s ease;
    }
    #zapien-btn:hover { transform: scale(1.08); }
  </style>
</head>
<body>

  <!-- Tu contenido de página aquí -->
  <h1 style="padding:40px;color:#333;">Mi sitio web</h1>

  <!-- Widget Pielo -->
  <iframe id="zapien-iframe"
    src="${appUrl}/embed.html?botId=${botId}&embedKey=${embedKey}&color=${colorEncoded}&avatar=${avatarEncoded}&name=${nameEncoded}"
    allowtransparency="true">
  </iframe>
  <button id="zapien-btn">${avatar}</button>

  <script>
    (function() {
      var chatbotId   = '${botId}';
      var embedKey    = '${embedKey}';
      var apiUrl      = '${apiUrl}';
      var color       = '${color}';
      var avatar      = '${avatar}';
      var name        = '${name}';
      var isOpen      = false;
      var iframeReady = false;  // true once zapien-chat-ready received
      var openPending = false;  // button clicked before iframe finished loading

      var iframe = document.getElementById('zapien-iframe');
      var btn    = document.getElementById('zapien-btn');

      function sendMsg(obj) {
        try { if (iframe.contentWindow) iframe.contentWindow.postMessage(obj, '*'); } catch(e) {}
      }

      btn.addEventListener('click', function() {
        isOpen = !isOpen;
        if (isOpen) {
          iframe.classList.add('open');
          if (!iframeReady) {
            openPending = true;  // will fire sendOpen once iframe is ready
          } else {
            sendMsg({ type:'zapien-open' });
          }
        } else {
          openPending = false;
          iframe.classList.remove('open');
          sendMsg({ type:'zapien-close' });
        }
      });

      window.addEventListener('message', function(e) {
        if (!e.data || !e.data.type) return;
        if (e.data.type === 'zapien-chat-ready') {
          iframeReady = true;
          sendMsg({ type:'zapien-init', chatbotId:chatbotId, embedKey:embedKey, apiUrl:apiUrl, color:color, avatar:avatar, chatbotName:name });
          if (openPending) { openPending = false; sendMsg({ type:'zapien-open' }); }
        }
        if (e.data.type === 'zapien-close-request') {
          isOpen = false;
          openPending = false;
          iframe.classList.remove('open');
        }
      });
    })();
  </script>

</body>
</html>`;
}
