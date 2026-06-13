/**
 * Genera el HTML completo del widget de VOZ (OpenAI Realtime API).
 * El usuario copia, guarda como .html y funciona solo.
 *
 * Patrón: un único iframe transparente (botón + barra + modal viven dentro,
 * para que el permiso de micrófono se pida con gesto real del usuario).
 * El iframe avisa al padre qué tamaño necesita en cada estado (idle/barra/modal)
 * vía postMessage 'voice-size', así nunca bloquea clics de la página.
 *
 * NO toca generateBubbleWidgetHtml.js ni generateFullChatHtml.js.
 */
export function generateVoiceWidgetHtml({ botId, embedKey, color = '#534AB7', avatar = '🎙️', name = 'Asistente', apiUrl, appUrl }) {
  const colorEncoded  = encodeURIComponent(color);
  const avatarEncoded = encodeURIComponent(avatar);
  const nameEncoded   = encodeURIComponent(name);
  const apiUrlEncoded = encodeURIComponent(apiUrl);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} — Voz</title>
  <style>
    /* Tu contenido de página va aquí */
    body { margin: 0; font-family: sans-serif; background: #f9f9f9; }

    #zapien-voice-iframe {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 88px;
      height: 88px;
      border: none;
      background: transparent;
      z-index: 99999;
      transition: width 220ms ease, height 220ms ease;
      color-scheme: normal;
    }
  </style>
</head>
<body>

  <!-- Tu contenido de página aquí -->
  <h1 style="padding:40px;color:#333;">Mi sitio web</h1>

  <!-- Widget de voz Bezpian -->
  <iframe id="zapien-voice-iframe"
    src="${appUrl}/voice-embed.html?botId=${botId}&embedKey=${embedKey}&color=${colorEncoded}&avatar=${avatarEncoded}&name=${nameEncoded}&apiUrl=${apiUrlEncoded}"
    allow="microphone; autoplay"
    allowtransparency="true">
  </iframe>

  <script>
    (function () {
      var iframe = document.getElementById('zapien-voice-iframe');

      window.addEventListener('message', function (e) {
        if (!e.data || !e.data.type) return;
        if (e.data.type === 'voice-size' && e.data.size) {
          iframe.style.width  = e.data.size.w + 'px';
          iframe.style.height = e.data.size.h + 'px';
        }
      });
    })();
  </script>

</body>
</html>`;
}
