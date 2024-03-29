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
                "main-gray": "#313338",
                "main-gray-darker": "#2b2d31",
                "main-gray-darker2": "#232428",
                "main-gray-darkest": "#202225",
                "main-gray-dark": "#221b22",
                "main-gray-light": "#40444b",
                "main-gray-hover": "#3b3e45",
                "main-gray-hover2": "#32353b",
                "main-black": "#18191c",
                "white-light": "#dcddde",
                "lightmode-grey": "#e3e5e8"
            },
            gridTemplateColumns: {
                24: "repeat(24, minmax(0, 1fr))"
            },
            gridColumn: {
                "span-15": "span 15 / span 15",
                "span-23": "span 23 / span 23",
                "span-24": "span 30 / span 30"
            }
        }
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("tailwind-scrollbar-hide"),
        require("tailwind-scrollbar"),
        require("prettier-plugin-tailwindcss")
    ],
    variants: {
        scrollbar: ["rounded"]
    }
};
