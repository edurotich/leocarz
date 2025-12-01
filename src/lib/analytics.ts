// Google Analytics tracking utilities
// Usage: import { trackEvent, trackPageView } from '@/lib/analytics'

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Track page views
export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    }
};

// Track custom events
export const trackEvent = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Predefined event trackers for common actions
export const analytics = {
    // Car viewing events
    viewCar: (carId: string, carName: string) => {
        trackEvent({
            action: 'view_car',
            category: 'Cars',
            label: `${carId} - ${carName}`,
        });
    },

    // WhatsApp click events
    clickWhatsApp: (source: string, carName?: string) => {
        trackEvent({
            action: 'click_whatsapp',
            category: 'Contact',
            label: carName ? `${source} - ${carName}` : source,
        });
    },

    // Search events
    search: (query: string, resultsCount: number) => {
        trackEvent({
            action: 'search',
            category: 'Search',
            label: query,
            value: resultsCount,
        });
    },

    // Filter events
    applyFilter: (filterType: string, filterValue: string) => {
        trackEvent({
            action: 'apply_filter',
            category: 'Search',
            label: `${filterType}: ${filterValue}`,
        });
    },

    // Newsletter signup
    newsletterSignup: (email: string) => {
        trackEvent({
            action: 'newsletter_signup',
            category: 'Engagement',
            label: email,
        });
    },

    // Phone call clicks
    clickPhone: (source: string) => {
        trackEvent({
            action: 'click_phone',
            category: 'Contact',
            label: source,
        });
    },

    // Email clicks
    clickEmail: (source: string) => {
        trackEvent({
            action: 'click_email',
            category: 'Contact',
            label: source,
        });
    },

    // Admin actions (optional - for internal tracking)
    adminAction: (action: string, details?: string) => {
        trackEvent({
            action: 'admin_action',
            category: 'Admin',
            label: details ? `${action} - ${details}` : action,
        });
    },
};
