import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export function MetaPixel() {
  const location = useLocation();
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (loading || !settings?.metaPixelId) return;

    const META_PIXEL_ID = settings.metaPixelId;

    // Load pixel script if not already loaded
    if (!window.fbq) {
      /* eslint-disable */
      (function(f:any,b:any,e:any,v:any,n?:any,t?:any,s?:any)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)})(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      
      window.fbq('init', META_PIXEL_ID);
    }
    
    window.fbq('track', 'PageView');
  }, [location.pathname, settings?.metaPixelId, loading]);

  return null;
}

export const trackEvent = (eventName: string, data?: any) => {
  if (window.fbq) {
    window.fbq('track', eventName, data);
  }
};

export const trackCustomEvent = (eventName: string, data?: any) => {
  if (window.fbq) {
    window.fbq('trackCustom', eventName, data);
  }
};
