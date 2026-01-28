import React, { useEffect, useRef } from 'react';

interface VoiceNavigatorProps {
  currentManeuver: string;
  enabled?: boolean;
}

const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({ currentManeuver, enabled = true }) => {
  const lastManeuverRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !currentManeuver || currentManeuver === lastManeuverRef.current) return;

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(currentManeuver);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Select a premium sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium'));
      if (premiumVoice) utterance.voice = premiumVoice;

      window.speechSynthesis.speak(utterance);
    };

    speak();
    lastManeuverRef.current = currentManeuver;
  }, [currentManeuver, enabled]);

  return null; // This is a headless logic component
};

export default VoiceNavigator;
