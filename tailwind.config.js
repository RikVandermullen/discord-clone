const { createGlobPatternsForDependencies } = require("@nrwl/angular/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        join(__dirname, "src/**/!(*.stories|*.spec).{ts,html}"),
        ...createGlobPatternsForDependencies(__dirname)
    ],
    theme: {
        extend: {
            colors: {
                "main-gray": "#36393f",
                "main-gray-darker": "#2f3136",
                "main-gray-darkest": "#202225",
                "main-gray-light": "#40444b",
                "white-light": "#dcddde"
            },
            gridTemplateColumns: {
                24: "repeat(24, minmax(0, 1fr))"
            },
            gridColumn: {
                "span-17": "span 17 / span 17",
                "span-24": "span 24 / span 24"
            }
        }
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("tailwind-scrollbar-hide"),
        require("tailwind-scrollbar")
    ],
    variants: {
        scrollbar: ["rounded"]
    }
};
