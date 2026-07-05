/**
 * plans.js — Fuente de verdad única de planes en el frontend.
 * Debe mantenerse sincronizado con zapien-backend/config/plans.js
 */
export const PLAN_CONFIG = {
    // 'free' se mantiene SOLO como fallback interno. No se ofrece (offered:false).
    free: {
        label:         'Free',
        price:         '$0',
        desc:          'Fallback interno.',
        conversations: 10,
        chatbots:      1,
        members:       2,
        offered:       false,
        manager:       false,
        features:      ['1 chatbot', '10 conversaciones/mes'],
    },
    basico: {
        label:         'Básico',
        price:         '$50.000',
        desc:          'Un asistente para tu negocio.',
        conversations: 100,
        chatbots:      1,
        members:       3,
        offered:       true,
        manager:       false,   // acceso simple: entra directo a su único bot
        features:      ['1 chatbot', '100 conversaciones/mes', 'Leads y widgets', 'Chat por texto y voz'],
    },
    pro: {
        label:         'Pro',
        price:         '$85.000',
        desc:          'Más volumen para tu asistente.',
        conversations: 500,
        chatbots:      1,
        members:       5,
        offered:       true,
        manager:       false,
        features:      ['1 chatbot', '500 conversaciones/mes', 'Soporte prioritario', 'Chat por texto y voz'],
    },
    enterprise: {
        label:         'Empresa',
        price:         '$60.000',
        desc:          'Hasta 4 bots y panel con la marca de cada cliente.',
        conversations: 800,              // pool de referencia (200 × 4)
        conversationsPerBot: 200,
        chatbots:      4,
        extraBotPrice: 15000,            // bot adicional del 5º en adelante
        members:       -1,
        offered:       true,
        manager:       true,             // ve la lista y marca el panel de cada cliente
        features:      ['Hasta 4 chatbots', 'Bot adicional: $15.000/mes', '200 conversaciones por bot', 'Panel multi-cliente', 'Marca blanca del dashboard'],
    },
};

// Alias de claves antiguas → nuevas (workspaces existentes)
const PLAN_ALIASES = { starter: 'basico' };

export const getPlanConfig = (planKey) => PLAN_CONFIG[PLAN_ALIASES[planKey] || planKey] || PLAN_CONFIG.free;
