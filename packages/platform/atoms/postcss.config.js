/** @type {import("postcss-load-config").Config} */
const config = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-import"),
    require("postcss-prefixwrap")(".calcom-atoms"),
  ],
};

module.exports = config;
