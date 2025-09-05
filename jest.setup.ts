import '@testing-library/jest-dom';

// Basic fetch polyfill for node jest
import 'whatwg-fetch';

process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'testsecret';
process.env.SENTRY_DSN = process.env.SENTRY_DSN || '';
process.env.NEXT_PUBLIC_SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

