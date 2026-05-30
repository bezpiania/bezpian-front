import React from 'react';
import ChatWidget from '../../components/ChatWidget/ChatWidget.jsx';

// This component loads the embed script and mounts the widget
const WidgetEmbed = () => {
  const embedKey = new URLSearchParams(window.location.search).get('embedKey');
  const position = new URLSearchParams(window.location.search).get('position') || 'bottom-right';

  if (!embedKey) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h1>Error</h1>
        <p>Missing embedKey parameter</p>
      </div>
    );
  }

  return (
    <ChatWidget embedKey={embedKey} position={position} />
  );
};

export default WidgetEmbed;
