/**
 * businessTypes.js — Configuración central por tipo de negocio
 *
 * Este archivo es la fuente de verdad para todo lo que varía según el rubro.
 * Agregar un nuevo rubro = agregar una entrada aquí. Nada más.
 *
 * Estructura por tipo:
 *  - meta:         Información visual y de presentación
 *  - modules:      Qué módulos/pestañas están habilitados
 *  - catalog:      Configuración del catálogo de productos/servicios
 *  - appointments: Configuración del agendamiento
 *  - sales:        Configuración de ventas/pedidos
 *  - quotes:       Configuración de cotizaciones
 *  - prompts:      Hints para el sistema de IA
 */

export const BUSINESS_TYPES = {

  // ─── RESTAURANTE ────────────────────────────────────────────────────────────
  restaurant: {
    meta: {
      label:       'Restaurante',
      description: 'Restaurante, café, bar o food delivery',
      icon:        '🍽️',
      color:       '#8B4513',
    },
    modules: {
      catalog:      true,
      appointments: true,
      sales:        true,
      quotes:       false,
      leads:        true,
      conversations: true,
    },
    catalog: {
      label:       'Menú',
      itemLabel:   'Plato',
      itemsLabel:  'Platos',
      categories:  ['Entradas', 'Sopas', 'Platos principales', 'Postres', 'Bebidas', 'Cócteles', 'Especiales'],
      fields: {
        // Campos base (todos los rubros)
        name:        { show: true, required: true,  label: 'Nombre del plato' },
        description: { show: true, required: false, label: 'Descripción' },
        price:       { show: true, required: true,  label: 'Precio' },
        category:    { show: true, required: true,  label: 'Categoría' },
        image:       { show: true, required: false, label: 'Foto' },
        available:   { show: true, required: false, label: 'Disponible' },
        // Campos específicos restaurante
        ingredients:   { show: true,  required: false, label: 'Ingredientes',          type: 'tags' },
        allergens:     { show: true,  required: false, label: 'Alérgenos',             type: 'multiselect', options: ['Gluten', 'Lactosa', 'Huevo', 'Mariscos', 'Frutos secos', 'Soja', 'Maní'] },
        tags:          { show: true,  required: false, label: 'Etiquetas',             type: 'multiselect', options: ['Vegetariano', 'Vegano', 'Sin gluten', 'Sin lactosa', 'Picante', 'Especial del día', 'Recomendado'] },
        portionSize:   { show: true,  required: false, label: 'Tamaño de porción',     type: 'select',      options: ['Individual', 'Para compartir (2)', 'Familiar (4+)'] },
        prepTime:      { show: true,  required: false, label: 'Tiempo de preparación', type: 'number',      suffix: 'min' },
        availableFor:  { show: true,  required: false, label: 'Disponible en',         type: 'multiselect', options: ['Almuerzo', 'Cena', 'Todo el día'] },
        calories:      { show: false, required: false, label: 'Calorías (kcal)',        type: 'number' },
        // Combos
        isCombo:       { show: true,  required: false, label: 'Es un combo/promoción', type: 'boolean' },
        comboItems:    { show: true,  required: false, label: 'Ítems del combo',       type: 'combo-items' },
        comboSavings:  { show: true,  required: false, label: 'Ahorro vs individual',  type: 'number', suffix: '' },
        // No aplica para restaurante
        sku:           { show: false },
        brand:         { show: false },
        stock:         { show: false },
        variants:      { show: false },
        duration:      { show: false },
        specialty:     { show: false },
      },
    },
    appointments: {
      resourceLabel:    'Mesa',
      resourcesLabel:   'Mesas',
      clientDataFields: [
        { fieldId: 'name',     label: 'Nombre',            fieldType: 'text',   required: true },
        { fieldId: 'phone',    label: 'Teléfono',          fieldType: 'phone',  required: true },
        { fieldId: 'email',    label: 'Email',             fieldType: 'email',  required: false },
        { fieldId: 'occasion', label: 'Ocasión especial',  fieldType: 'select', required: false, options: ['Ninguna', 'Cumpleaños', 'Aniversario', 'Reunión de negocios', 'Otra'] },
      ],
      features: {
        zoneTypes:     true,   // terraza / interior / barra
        waitingList:   true,   // lista de espera
        groupBooking:  true,   // reservas para grupos grandes
        guestCount:    true,   // preguntar cuántas personas
      },
    },
    sales: {
      enabled:        true,
      orderLabel:     'Pedido',
      ordersLabel:    'Pedidos',
      features: {
        itemNotes:      true,   // observaciones por plato
        deliveryHours:  true,   // horario delivery ≠ horario local
        combos:         true,   // combos y promociones
        maxConcurrent:  true,   // límite pedidos simultáneos
      },
      statusFlow: ['new', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
      statusLabels: {
        new:        'Nuevo',
        preparing:  'En preparación',
        on_the_way: 'En camino',
        delivered:  'Entregado',
        cancelled:  'Cancelado',
      },
    },
    quotes: { enabled: false },
    prompts: {
      catalogContext: 'menú con platos de cocina',
      appointmentContext: 'reserva de mesa en el restaurante',
      salesContext: 'pedido de comida para delivery o retiro',
    },
  },

  // ─── TIENDA / E-COMMERCE ─────────────────────────────────────────────────────
  store: {
    meta: {
      label:       'Tienda / E-commerce',
      description: 'Tienda física, online o distribuidora',
      icon:        '🛒',
      color:       '#1B2C5C',
    },
    modules: {
      catalog:      true,
      appointments: false,
      sales:        true,
      quotes:       true,
      leads:        true,
      conversations: true,
    },
    catalog: {
      label:      'Productos',
      itemLabel:  'Producto',
      itemsLabel: 'Productos',
      categories: ['General', 'Electrónica', 'Ropa', 'Repuestos', 'Hogar', 'Alimentos', 'Deportes', 'Otro'],
      fields: {
        name:        { show: true, required: true,  label: 'Nombre del producto' },
        description: { show: true, required: false, label: 'Descripción' },
        price:       { show: true, required: true,  label: 'Precio' },
        category:    { show: true, required: true,  label: 'Categoría' },
        image:       { show: true, required: false, label: 'Foto' },
        available:   { show: true, required: false, label: 'Disponible' },
        // Campos específicos tienda
        sku:         { show: true, required: false, label: 'SKU / Código',        type: 'text' },
        brand:       { show: true, required: false, label: 'Marca',               type: 'text' },
        stock:       { show: true, required: true,  label: 'Stock',               type: 'number' },
        salePrice:   { show: true, required: false, label: 'Precio oferta',       type: 'number' },
        barcode:     { show: true, required: false, label: 'Código de barras',    type: 'text' },
        weight:      { show: true, required: false, label: 'Peso (kg)',           type: 'number' },
        variants:    { show: true, required: false, label: 'Variantes',           type: 'variants' },
        // No aplica para tienda
        ingredients:  { show: false },
        allergens:    { show: false },
        tags:         { show: false },
        portionSize:  { show: false },
        prepTime:     { show: false },
        availableFor: { show: false },
        duration:     { show: false },
        specialty:    { show: false },
      },
    },
    appointments: { enabled: false },
    sales: {
      enabled:    true,
      orderLabel: 'Orden',
      ordersLabel: 'Órdenes',
      features: {
        itemNotes:     false,
        variantSelect: true,   // elegir variante al pedir
        trackingCode:  true,   // número de guía de envío
        returns:       true,   // devoluciones y cambios
      },
      statusFlow: ['new', 'processing', 'preparing', 'shipped', 'delivered', 'returned', 'cancelled'],
      statusLabels: {
        new:        'Nueva',
        processing: 'Procesando',
        preparing:  'Preparando',
        shipped:    'Enviada',
        delivered:  'Entregada',
        returned:   'Devuelta',
        cancelled:  'Cancelada',
      },
    },
    quotes: {
      enabled: true,
      features: {
        expiry:         true,   // fecha de vencimiento
        paymentTerms:   true,   // términos de pago
        taxConfig:      true,   // IVA incluido/excluido
        volumeDiscount: true,   // descuento por volumen
        termsText:      true,   // términos y condiciones
      },
    },
    prompts: {
      catalogContext:     'catálogo de productos',
      appointmentContext: null,
      salesContext:       'orden de compra con envío o retiro en tienda',
    },
  },

  // ─── CLÍNICA / SALUD ─────────────────────────────────────────────────────────
  clinic: {
    meta: {
      label:       'Clínica / Salud',
      description: 'Clínica, consultorio, centro médico o spa',
      icon:        '🏥',
      color:       '#059669',
    },
    modules: {
      catalog:      true,
      appointments: true,
      sales:        false,
      quotes:       true,
      leads:        true,
      conversations: true,
    },
    catalog: {
      label:      'Servicios',
      itemLabel:  'Servicio',
      itemsLabel: 'Servicios',
      categories: ['Consultas', 'Procedimientos', 'Exámenes', 'Tratamientos', 'Cirugías', 'Terapias', 'Otro'],
      fields: {
        name:        { show: true, required: true,  label: 'Nombre del servicio' },
        description: { show: true, required: false, label: 'Descripción' },
        price:       { show: true, required: false, label: 'Precio (0 = Consultar)', type: 'number' },
        category:    { show: true, required: true,  label: 'Categoría' },
        image:       { show: false },
        available:   { show: true, required: false, label: 'Disponible' },
        // Campos específicos clínica
        duration:       { show: true, required: true,  label: 'Duración (minutos)',     type: 'number' },
        specialty:      { show: true, required: true,  label: 'Especialidad',           type: 'text' },
        requiresPrep:   { show: true, required: false, label: '¿Requiere preparación?', type: 'boolean' },
        prepInstructions: { show: true, required: false, label: 'Instrucciones previas', type: 'textarea' },
        insuranceCoverage:{ show: true, required: false, label: 'Cobertura de seguro',   type: 'text' },
        sessionCount:   { show: true, required: false, label: 'Nº de sesiones',         type: 'number' },
        // No aplica para clínica
        sku:          { show: false },
        brand:        { show: false },
        stock:        { show: false },
        variants:     { show: false },
        ingredients:  { show: false },
        allergens:    { show: false },
        portionSize:  { show: false },
        prepTime:     { show: false },
        availableFor: { show: false },
      },
    },
    appointments: {
      resourceLabel:  'Doctor/Especialista',
      resourcesLabel: 'Doctores',
      clientDataFields: [
        { fieldId: 'name',      label: 'Nombre completo',       fieldType: 'text',   required: true },
        { fieldId: 'phone',     label: 'Teléfono',              fieldType: 'phone',  required: true },
        { fieldId: 'email',     label: 'Email',                 fieldType: 'email',  required: false },
        { fieldId: 'rut',       label: 'RUT / CI',              fieldType: 'text',   required: true },
        { fieldId: 'insurance', label: 'Seguro / Obra social',  fieldType: 'text',   required: false },
        { fieldId: 'reason',    label: 'Motivo de consulta',    fieldType: 'textarea', required: true },
      ],
      features: {
        zoneTypes:     false,
        waitingList:   true,
        groupBooking:  false,
        guestCount:    false,
        serviceSelect: true,   // elige el servicio antes de la cita
        doctorSelect:  true,   // elige el doctor/especialista
        blockSchedule: true,   // doctor puede bloquear horarios
        followUp:      true,   // citas de seguimiento vinculadas
      },
    },
    sales: { enabled: false },
    quotes: {
      enabled: true,
      features: {
        expiry:          true,
        sessionBreakdown: true,  // desglose por sesiones
        insuranceCoverage: true, // cobertura de seguro
        treatmentPlan:   true,   // plan de tratamiento
        conditions:      true,   // condiciones médicas relevantes
      },
    },
    prompts: {
      catalogContext:     'servicios médicos y tratamientos disponibles',
      appointmentContext: 'cita médica o consulta con el especialista',
      salesContext:       null,
    },
  },

  // ─── GENÉRICO (fallback) ─────────────────────────────────────────────────────
  generic: {
    meta: {
      label:       'Negocio general',
      description: 'Cualquier otro tipo de negocio',
      icon:        '🏢',
      color:       '#1B2C5C',
    },
    modules: {
      catalog:      true,
      appointments: true,
      sales:        true,
      quotes:       true,
      leads:        true,
      conversations: true,
    },
    catalog: {
      label:      'Catálogo',
      itemLabel:  'Producto',
      itemsLabel: 'Productos',
      categories: ['General'],
      fields: {
        name:        { show: true, required: true,  label: 'Nombre' },
        description: { show: true, required: false, label: 'Descripción' },
        price:       { show: true, required: true,  label: 'Precio' },
        category:    { show: true, required: true,  label: 'Categoría' },
        image:       { show: true, required: false, label: 'Imagen' },
        available:   { show: true, required: false, label: 'Disponible' },
        sku:         { show: true, required: false, label: 'Código / SKU', type: 'text' },
        stock:       { show: true, required: false, label: 'Stock',        type: 'number' },
      },
    },
    appointments: {
      resourceLabel:  'Recurso',
      resourcesLabel: 'Recursos',
      clientDataFields: [
        { fieldId: 'name',  label: 'Nombre',    fieldType: 'text',  required: true },
        { fieldId: 'phone', label: 'Teléfono',  fieldType: 'phone', required: true },
        { fieldId: 'email', label: 'Email',     fieldType: 'email', required: false },
      ],
      features: {
        zoneTypes:    false,
        waitingList:  false,
        groupBooking: false,
        guestCount:   false,
      },
    },
    sales: {
      enabled:     true,
      orderLabel:  'Pedido',
      ordersLabel: 'Pedidos',
      features: { itemNotes: false, variantSelect: false, trackingCode: false, returns: false },
      statusFlow: ['new', 'preparing', 'shipped', 'delivered', 'cancelled'],
      statusLabels: {
        new:       'Nuevo',
        preparing: 'En proceso',
        shipped:   'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
      },
    },
    quotes: { enabled: true, features: { expiry: true, paymentTerms: false, taxConfig: false, volumeDiscount: false } },
    prompts: {
      catalogContext:     'catálogo de productos y servicios',
      appointmentContext: 'agenda o reserva',
      salesContext:       'pedido o compra',
    },
  },
};

/** Helper: devuelve la config del rubro o generic como fallback */
export const getBusinessType = (type) => BUSINESS_TYPES[type] || BUSINESS_TYPES.generic;

/** Lista para selectores y wizards */
export const BUSINESS_TYPE_OPTIONS = Object.entries(BUSINESS_TYPES)
  .filter(([key]) => key !== 'generic')
  .map(([key, val]) => ({ value: key, ...val.meta }))
  .concat([{ value: 'generic', ...BUSINESS_TYPES.generic.meta }]);
