declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-ZQF40DV7M1';

// Initialize Google Analytics
export const initGA = () => {
  // Skip initialization if gtag is already defined
  if (typeof window.gtag === 'function') {
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}');
  `;
  
  document.head.appendChild(script1);
  document.head.appendChild(script2);
};

// Log page views
export const logPageView = (url: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log events
export const logEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}; 