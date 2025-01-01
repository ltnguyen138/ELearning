/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",

    content: ["./src/**/*.{html,js}"],
    theme: {
    extend: {
        colors: {
        "text-color": "#333",
        "primary-color": "#0ea8e4",
        "border-color": "#e5e5e5",
        "custom-red": "#f00",
        "custom-gray": "#c0c0c0",
        "link-color": "rgb(25,84,192)",
        "link-color-h": "rgb(14,14,119)",
        "active-btn": "#4F46E5",
        "active-btn-h": "#3D31A2",
        "undo-btn": "#9ca3af",
        "undo-btn-h": "#6b7280",
        "delete-btn": "#f00",
        "delete-btn-h": "#c00",
            "text-white": "#fafafa",
        },
        backgroundImage: {
            'grid-pattern': `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`
        }
    },
    },
    plugins: [

        function({ addUtilities }) {
            addUtilities({
                '.truncate-2-lines': {
                    display: '-webkit-box',
                    '-webkit-box-orient': 'vertical',
                    '-webkit-line-clamp': '2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
            });
        },
        require('tailwind-scrollbar'),
    ],
}

