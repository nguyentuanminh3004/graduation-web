import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        // Chia nhỏ bundle để tối ưu load
        rollupOptions: {
            output: {
                manualChunks: {
                    // Three.js tách riêng → chỉ tải khi gọi dynamic import
                    three: ['three'],
                    // Confetti nhẹ, để chung
                    confetti: ['canvas-confetti'],
                },
            },
        },
        // Nén nhỏ hơn
        minify: 'esbuild',
        target: 'es2020',
        // Tắt sourcemap cho production cho nhẹ
        sourcemap: false,
        // Cảnh báo bundle > 800KB
        chunkSizeWarningLimit: 800,
    },
});