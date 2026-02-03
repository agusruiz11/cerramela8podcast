import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

const logger = createLogger();
const loggerError = logger.error;

logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
		return;
	}
	loggerError(msg, options);
};

export default defineConfig({
	customLogger: logger,
	plugins: [react()],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
		// Opcional: si tenés deploy en Vercel, poné VITE_API_PROXY=https://tu-app.vercel.app
		// para que npm run dev use esa API. Sino, usá vercel dev para tener API local.
		proxy: process.env.VITE_API_PROXY
			? { '/api': { target: process.env.VITE_API_PROXY, changeOrigin: true } }
			: undefined,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		target: 'esnext',
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types',
			],
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom'],
					'framer-motion': ['framer-motion'],
					'radix-ui': [
						'@radix-ui/react-alert-dialog',
						'@radix-ui/react-dialog',
						'@radix-ui/react-toast',
					],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
});
