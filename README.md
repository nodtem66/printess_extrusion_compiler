# Printess extrusion compiler

## Overview

[![Cloudflare Pages](https://img.shields.io/badge/Deploy%20on-Cloudflare%20Pages-informational)](https://printess-extrusion-compiler.pages.dev/)

> **Cloudflare page:** \
> [https:// printess-extrusion-compiler.pages.dev/](https://printess-extrusion-compiler.pages.dev/)

The Printess Extrusion Compiler is a web-based application designed to convert plain text files (`.txt`) into G-code for the [Printess Low-Cost 3D Printer](https://github.com/weiss-jonathan/Printess-Low-Cost-3D-Printer). This application serves as the web-version of the original Python script, specifically `gcode_translator_10_17_24.py`, found within the Printess project repository.

It aims to provide an accessible and user-friendly interface for generating extrusion commands, streamlining the process of preparing 3D print jobs.

## Development

This application is built with the following technologies:

* **SolidJS:** A reactive JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **Vite:** A fast build tool for modern web projects.

For simplicity, the application is structured as a single-page application (SPA) within `App.jsx`. The core logic for processing `.txt` files and generating G-code is encapsulated in `process_gcode.js`. Due to the extensive content, the help documentation is separated into `Help.jsx`.

For simplicity, `App.jsx` contains a single-page app. The main logic for processing txt is seperated to `process_gcode.js`. Due to the amount of content, the help modal is splited to `Help.jsx`.

### Getting Started

To set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nodtem66/printess_extrusion_compiler.git
    cd printess_extrusion_compiler
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will typically start the application at `http://localhost:3000`.


## Deployment

The application is deployed using Cloudflare Pages.

### Cloudflare Pages Deployment Steps

1.  **Build the project for production:**
    ```bash
    npm run build
    ```
    This command compiles the application and outputs the optimized files into the `/dist` directory.
2.  **Deploy the `/dist` directory:** Upload the contents of the `/dist` directory to your Cloudflare Pages project. Cloudflare Pages will then host your application.

## Testing

**Note:** This section is under development.

The primary focus for testing will be to compare the output of `process_gcode.js` with the original `gcode_translator_10_17_24.py` script to ensure accuracy and consistency in G-code generation. Detailed testing procedures will be added here in the future.