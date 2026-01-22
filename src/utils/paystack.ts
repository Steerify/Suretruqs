export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).PaystackPop) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

export const initializePaystack = (config: any) => {
  const handler = (window as any).PaystackPop.setup({
    key: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount * 100, // to kobo
    ref: config.reference,
    onClose: config.onClose,
    callback: config.callback,
  });
  handler.openIframe();
};
