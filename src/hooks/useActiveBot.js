/**
 * useActiveBot — hook centralizado para el bot activo seleccionado.
 *
 * El bot activo se guarda en localStorage como:
 *   activeBotId    → ID del chatbot
 *   activeBotName  → nombre para mostrar en el sidebar
 *   activeBotColor → color del widget
 *   activeBotAvatar→ emoji del avatar
 *   activeBotType  → businessType (restaurant / store / clinic / generic)
 */

export const getActiveBot = () => {
  let features = { chat: true, quotes: false, appointments: false, sales: false };
  try {
    const f = localStorage.getItem('activeBotFeatures');
    if (f) features = { ...features, ...JSON.parse(f) };
  } catch {}
  return {
    id:       localStorage.getItem('activeBotId')    || null,
    name:     localStorage.getItem('activeBotName')  || '',
    color:    localStorage.getItem('activeBotColor') || '#667eea',
    avatar:   localStorage.getItem('activeBotAvatar')|| '🤖',
    type:     localStorage.getItem('activeBotType')  || 'generic',
    features,
    brand:    (() => {
      let brand = { enabled: false, name: '', color: '', logo: '' };
      try { const b = localStorage.getItem('activeBotBrand'); if (b) brand = { ...brand, ...JSON.parse(b) }; } catch {}
      return brand;
    })(),
  };
};

export const setActiveBot = (bot) => {
  localStorage.setItem('activeBotId',       bot._id || bot.id || '');
  localStorage.setItem('activeBotName',     bot.name || '');
  localStorage.setItem('activeBotColor',    bot.widget?.color || '#667eea');
  localStorage.setItem('activeBotAvatar',   bot.widget?.avatar || '🤖');
  localStorage.setItem('activeBotType',     bot.businessType || 'generic');
  localStorage.setItem('activeBotFeatures', JSON.stringify(bot.features || {}));
  localStorage.setItem('activeBotBrand',    JSON.stringify(bot.dashboardBrand || {}));
};

export const clearActiveBot = () => {
  ['activeBotId','activeBotName','activeBotColor','activeBotAvatar','activeBotType','activeBotFeatures','activeBotBrand']
    .forEach(k => localStorage.removeItem(k));
};

export const useActiveBot = () => getActiveBot();
