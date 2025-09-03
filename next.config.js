/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		// Prefer .env for secrets; these are placeholders only
	},
	experimental: {
		instrumentationHook: true,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.externals = config.externals || [];
			config.resolve = config.resolve || {};
			config.resolve.fallback = {
				...(config.resolve.fallback || {}),
				fs: false,
				path: false,
				child_process: false
			};
		}
		return config;
	}
};

module.exports = nextConfig;
