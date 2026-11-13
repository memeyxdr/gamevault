import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { applyCloak, clearCloak } from '../utils/cloak';

/**
 * Headless: keeps the browser tab's name in sync with the cloaking settings.
 * Nothing else about the page — URL, favicon, history, links — is touched.
 */
export const CloakController: React.FC = () => {
  const { settings } = useSettings();
  const { cloakEnabled, cloakTitle } = settings;

  useEffect(() => {
    if (!cloakEnabled) {
      clearCloak();
      return;
    }
    applyCloak(cloakTitle);
    return () => clearCloak();
  }, [cloakEnabled, cloakTitle]);

  return null;
};
