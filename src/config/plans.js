/**
 * plans.js — Fuente de verdad única de planes en el frontend.
 * Debe mantenerse sincronizado con zapien-backend/config/plans.js
 */
export const PLAN_CONFIG = {
    free: {
        label:         'Free',
        price:         '$0',
        desc:          'Para probar la plataforma.',
        conversations: 10,
        chatbots:      1,
        members:       2,
        features:      ['1 chatbot', '10 conversaciones/mes', '2 miembros', 'Chat por texto y voz'],
        missing:       ['Sin agendamiento'],
    },
    basico: {
        label:         'Básico',
        price:         '$50.000',
        desc:          'Para empezar a vender en serio.',
        conversations: 200,
        chatbots:      1,
        members:       3,
        features:      ['1 chatbot', '200 conversaciones/mes', '3 miembros', 'Chat por texto y voz'],
        missing:       ['Sin agendamiento avanzado'],
    },
    pro: {
        label:         'Pro',
        price:         '$150.000',
        desc:          'Para PyMEs que venden todos los días.',
        conversations: 1000,
        chatbots:      3,
        members:       10,
        features:      ['3 chatbots', '1.000 conversaciones/mes', '10 miembros', 'Agendamiento + integraciones', 'Chat por texto y voz'],
    },
    enterprise: {
        label:         'Empresa',
        price:         'A medida',
        desc:          'Cuando ya volaste de la PyME.',
        conversations: -1,
        chatbots:      -1,
        members:       -1,
        features:      ['Bots ilimitados', 'Conversaciones ilimitadas', 'Equipo ilimitado · SSO', 'Soporte dedicado'],
    },
};

// Alias de claves antiguas → nuevas (workspaces existentes)
const PLAN_ALIASES = { starter: 'basico' };

export const getPlanConfig = (planKey) => PLAN_CONFIG[PLAN_ALIASES[planKey] || planKey] || PLAN_CONFIG.free;
