/**
 * plans.js — Fuente de verdad única de planes en el frontend.
 * Debe mantenerse sincronizado con zapien-backend/config/plans.js
 */
export const PLAN_CONFIG = {
    free: {
        label:         'Free',
        price:         '$0',
        desc:          'Para probar la plataforma.',
        conversations: 500,
        chatbots:      1,
        members:       2,
        features:      ['1 chatbot', '500 conversaciones/mes', '2 miembros'],
        missing:       ['Sin agendamiento'],
    },
    starter: {
        label:         'Starter',
        price:         '$9.990',
        desc:          'Para empezar sin compromiso.',
        conversations: 1000,
        chatbots:      1,
        members:       2,
        features:      ['1 chatbot', '1.000 conversaciones/mes', '2 miembros'],
        missing:       ['Sin agendamiento'],
    },
    pro: {
        label:         'Pro',
        price:         '$29.990',
        desc:          'Para PyMEs que venden todos los días.',
        conversations: 5000,
        chatbots:      3,
        members:       10,
        features:      ['3 chatbots', '5.000 conversaciones/mes', '10 miembros', 'Agendamiento + integraciones'],
    },
    enterprise: {
        label:         'Empresa',
        price:         '$99.000',
        desc:          'Cuando ya volaste de la PyME.',
        conversations: 50000,
        chatbots:      -1,
        members:       -1,
        features:      ['Bots ilimitados', '50.000 conversaciones/mes', 'Equipo ilimitado · SSO', 'Soporte dedicado'],
    },
};

export const getPlanConfig = (planKey) => PLAN_CONFIG[planKey] || PLAN_CONFIG.free;
