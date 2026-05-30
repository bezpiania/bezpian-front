(function() {
  const BACKEND_URL = 'http://localhost:5001';
  const EMBED_SCRIPT_URL = 'http://localhost:5173';

  window.ZapienChat = {
    init: function(embedKey, options = {}) {
      const position = options.position || 'bottom-right';
      const primaryColor = sanitizeColor(options.primaryColor) || '#4299e1';
      const avatar = options.avatar || '';
      const chatbotName = options.chatbotName || '';
      const initialOpen = !!options.initialOpen;
      const customCSS = options.customCSS || '';

      // Create root div
      const root = document.createElement('div');
      root.id = 'zapien-chat-root';
      root.setAttribute('data-embed-key', embedKey);
      document.body.appendChild(root);

      // Inject CSS
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --zapien-primary: ${primaryColor};
        }
        ${customCSS}
      `;
      document.head.appendChild(style);

      // Load React app
      const script = document.createElement('script');
      script.src = EMBED_SCRIPT_URL + '/widget-loader.js';
      script.async = true;
      script.dataset.embedKey = embedKey;
      script.dataset.position = position;
      script.dataset.primaryColor = primaryColor;
      if (avatar) script.dataset.avatar = avatar;
      if (chatbotName) script.dataset.chatbotName = chatbotName;
      script.dataset.initialOpen = initialOpen ? '1' : '0';
      document.head.appendChild(script);
    }
  };

  // Auto-init if script has data attributes
  const currentScript = document.currentScript;
  if (currentScript && currentScript.dataset.embedKey) {
    const embedKey = currentScript.dataset.embedKey;
    const position = currentScript.dataset.position || 'bottom-right';
    const primaryColor = sanitizeColor(currentScript.dataset.primaryColor) || '#4299e1';
    const avatar = currentScript.dataset.avatar || '';
    const chatbotName = currentScript.dataset.chatbotName || '';
    const initialOpen = currentScript.dataset.initialOpen === '1';

    window.addEventListener('DOMContentLoaded', function() {
      window.ZapienChat.init(embedKey, { position, primaryColor, avatar, chatbotName, initialOpen });
    });
  }
})();

// Helper: sanity check hex color like #RRGGBB or #RGB
function sanitizeColor(input) {
  if (!input || typeof input !== 'string') return null;
  const v = input.trim();
  // Accept #RRGGBB or #RGB
  if (/^#([0-9A-Fa-f]{6})$/.test(v)) return v;
  if (/^#([0-9A-Fa-f]{3})$/.test(v)) return v;
  return null;
}
