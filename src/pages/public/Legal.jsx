import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Legal — Términos de Servicio y Política de Privacidad de Pielo.
 * Renderiza ambos documentos según la prop `doc` ('terms' | 'privacy').
 *
 * NOTA: textos base; deben ser revisados por un abogado antes de operar comercialmente.
 */
const UPDATED = '16 de junio de 2026';
const COMPANY = 'Pielo';
const CONTACT = 'soporte@pielo.app';

const wrap = { maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px', fontFamily: 'var(--font-body)', color: 'var(--carbon)', lineHeight: 1.7 };
const h1 = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.03em', marginBottom: 6 };
const h2 = { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, marginTop: 32, marginBottom: 8 };
const meta = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 28 };
const p = { marginBottom: 12, fontSize: 15.5 };

const Header = ({ title }) => (
  <>
    <Link to="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>← Volver</Link>
    <h1 style={h1}>{title}</h1>
    <div style={meta}>Pielo · Última actualización: {UPDATED}</div>
  </>
);

const Terms = () => (
  <div style={wrap}>
    <Header title="Términos de Servicio" />

    <p style={p}>Estos Términos regulan el uso de la plataforma {COMPANY} ("la Plataforma", "el Servicio"), que permite a negocios crear asistentes conversacionales con inteligencia artificial (texto y voz) e integrarlos en sus canales. Al registrarte o usar el Servicio, aceptas estos Términos.</p>

    <h2 style={h2}>1. Descripción del servicio</h2>
    <p style={p}>{COMPANY} provee herramientas para configurar, desplegar y gestionar chatbots de IA. El Servicio utiliza modelos de terceros (por ejemplo, OpenAI) que el cliente conecta mediante su propia clave de API. {COMPANY} no garantiza respuestas exactas de la IA y el cliente es responsable de revisar el contenido generado.</p>

    <h2 style={h2}>2. Cuentas y responsabilidad</h2>
    <p style={p}>Eres responsable de la veracidad de los datos de tu cuenta, de la custodia de tus credenciales y de toda actividad realizada bajo tu cuenta. Debes tener la autorización legal para cargar la información y catálogos que publiques en tus chatbots.</p>

    <h2 style={h2}>3. Claves de terceros (OpenAI u otros)</h2>
    <p style={p}>El cliente conecta su propia clave de API. Los costos de uso de esos proveedores corren por cuenta del cliente. {COMPANY} almacena dichas claves de forma cifrada y no las comparte con terceros. {COMPANY} no se responsabiliza por cargos, límites o suspensiones impuestas por el proveedor del modelo.</p>

    <h2 style={h2}>4. Planes, límites y pagos</h2>
    <p style={p}>El Servicio se ofrece bajo distintos planes con límites de uso (conversaciones, chatbots, miembros). Al alcanzar el límite, ciertas funciones pueden pausarse hasta la renovación del período o la actualización del plan. Los precios y condiciones pueden cambiar con aviso previo razonable.</p>

    <h2 style={h2}>5. Uso aceptable</h2>
    <p style={p}>Está prohibido usar el Servicio para fines ilegales, engañosos, para enviar spam, suplantar identidades, o procesar datos sin la autorización correspondiente. {COMPANY} puede suspender cuentas que infrinjan estas reglas.</p>

    <h2 style={h2}>6. Disponibilidad y límites de responsabilidad</h2>
    <p style={p}>El Servicio se entrega "tal cual" y "según disponibilidad". {COMPANY} no garantiza operación ininterrumpida ni libre de errores. En la máxima medida permitida por la ley, {COMPANY} no será responsable por daños indirectos o lucro cesante derivados del uso o imposibilidad de uso del Servicio.</p>

    <h2 style={h2}>7. Cancelación</h2>
    <p style={p}>Puedes cancelar tu cuenta en cualquier momento. Tras la cancelación podemos eliminar tus datos conforme a nuestra Política de Privacidad y a los plazos legales aplicables.</p>

    <h2 style={h2}>8. Cambios y contacto</h2>
    <p style={p}>Podemos actualizar estos Términos; los cambios relevantes se notificarán. Para consultas: {CONTACT}.</p>

    <p style={{ ...p, marginTop: 32, fontSize: 13, opacity: 0.6 }}>Este documento es una base general y no constituye asesoría legal. Debe ser revisado por un abogado según la jurisdicción aplicable antes de operar comercialmente.</p>
    <p style={{ fontSize: 13 }}><Link to="/privacidad" style={{ textDecoration: 'underline' }}>Ver Política de Privacidad</Link></p>
  </div>
);

const Privacy = () => (
  <div style={wrap}>
    <Header title="Política de Privacidad" />

    <p style={p}>Esta Política explica cómo {COMPANY} trata los datos personales en el marco del Servicio. {COMPANY} actúa como <strong>encargado de tratamiento</strong> respecto de los datos que los negocios (clientes) y sus usuarios finales aportan a través de los chatbots; el negocio es el <strong>responsable</strong> de esos datos.</p>

    <h2 style={h2}>1. Datos que tratamos</h2>
    <p style={p}>• <strong>De la cuenta del negocio:</strong> nombre, email, datos de acceso, workspace.<br/>
       • <strong>De configuración:</strong> catálogos, textos, claves de API (cifradas).<br/>
       • <strong>De conversaciones:</strong> mensajes intercambiados entre los usuarios finales y el chatbot, y datos que el usuario entregue (ej. nombre, teléfono, dirección para un pedido o reserva).</p>

    <h2 style={h2}>2. Para qué los usamos</h2>
    <p style={p}>Para operar el Servicio: generar respuestas, gestionar pedidos/reservas/cotizaciones, mostrar métricas al negocio, dar soporte y mejorar la plataforma. No vendemos datos personales.</p>

    <h2 style={h2}>3. Proveedores (subencargados)</h2>
    <p style={p}>Para funcionar usamos proveedores que pueden procesar datos por cuenta nuestra, entre ellos: el proveedor del modelo de IA (ej. OpenAI), el proveedor de base de datos (MongoDB Atlas) y el de infraestructura/hosting. Estos procesan los datos únicamente para prestar el servicio contratado.</p>

    <h2 style={h2}>4. Conversaciones por voz e IA</h2>
    <p style={p}>Las conversaciones (texto y voz) se procesan mediante el modelo de IA conectado para generar respuestas. El audio se transcribe para operar el asistente. El negocio debe informar a sus usuarios finales que interactúan con un asistente de IA y que sus mensajes se procesan con ese fin.</p>

    <h2 style={h2}>5. Conservación y seguridad</h2>
    <p style={p}>Conservamos los datos mientras la cuenta esté activa o según lo exija la ley. Aplicamos medidas razonables de seguridad, incluido el cifrado de credenciales sensibles. Ningún sistema es 100% infalible.</p>

    <h2 style={h2}>6. Derechos de los titulares</h2>
    <p style={p}>Los usuarios finales pueden ejercer sus derechos (acceso, rectificación, eliminación) ante el negocio responsable. {COMPANY} colaborará con el negocio para atender dichas solicitudes. Para temas de la cuenta del negocio, escribe a {CONTACT}.</p>

    <h2 style={h2}>7. Cambios y contacto</h2>
    <p style={p}>Podemos actualizar esta Política; los cambios relevantes se notificarán. Contacto: {CONTACT}.</p>

    <p style={{ ...p, marginTop: 32, fontSize: 13, opacity: 0.6 }}>Este documento es una base general y no constituye asesoría legal. Debe ser revisado por un abogado y adaptado a la normativa aplicable (en Chile, Ley 19.628 y sus actualizaciones) antes de operar comercialmente.</p>
    <p style={{ fontSize: 13 }}><Link to="/terminos" style={{ textDecoration: 'underline' }}>Ver Términos de Servicio</Link></p>
  </div>
);

const Legal = ({ doc }) => (doc === 'privacy' ? <Privacy /> : <Terms />);

export default Legal;
