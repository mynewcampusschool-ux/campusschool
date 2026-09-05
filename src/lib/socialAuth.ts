// Social auth provider configuration.
// To enable Facebook or LinkedIn OAuth, set the corresponding env vars
// and replace the stub handlers below with real SDK calls.

export type SocialProvider = 'google' | 'facebook' | 'linkedin';

export interface SocialProviderConfig {
  id: SocialProvider;
  label: string;
  /** hex brand colour used for the icon tint */
  color: string;
  /** background colour on hover */
  hoverBg: string;
  configured: boolean;
  notConfiguredMessage: string;
}

export const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    color: '#EA4335',
    hoverBg: '#FFF5F5',
    configured: true, // always handled by Firebase in AuthContext
    notConfiguredMessage: '',
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    color: '#1877F2',
    hoverBg: '#EFF6FF',
    configured: !!import.meta.env.VITE_FACEBOOK_APP_ID,
    notConfiguredMessage: 'Facebook Login is not configured yet.',
  },
  {
    id: 'linkedin',
    label: 'Continue with LinkedIn',
    color: '#0A66C2',
    hoverBg: '#EFF6FF',
    configured: !!import.meta.env.VITE_LINKEDIN_CLIENT_ID,
    notConfiguredMessage: 'LinkedIn Login is not configured yet.',
  },
];
