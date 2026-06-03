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

export const getActiveBot = () => ({
  id:     localStorage.getItem('activeBotId')    || null,
  name:   localStorage.getItem('activeBotName')  || '',
  color:  localStorage.getItem('activeBotColor') || '#667eea',
  avatar: localStorage.getItem('activeBotAvatar')|| '🤖',
  type:   localStorage.getItem('activeBotType')  || 'generic',
});

export const setActiveBot = (bot) => {
  localStorage.setItem('activeBotId',    bot._id || bot.id || '');
  localStorage.setItem('activeBotName',  bot.name || '');
  localStorage.setItem('activeBotColor', bot.widget?.color || '#667eea');
  localStorage.setItem('activeBotAvatar',bot.widget?.avatar || '🤖');
  localStorage.setItem('activeBotType',  bot.businessType || 'generic');
};

export const clearActiveBot = () => {
  ['activeBotId','activeBotName','activeBotColor','activeBotAvatar','activeBotType']
    .forEach(k => localStorage.removeItem(k));
};

export const useActiveBot = () => getActiveBot();
