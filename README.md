# math

```
npm install
```

```
node server.js
```

```
npm run start
```

Mind AR.js Image Target Compiler

https://hiukim.github.io/mind-ar-js-doc/tools/compile


Dynamically create

https://github.com/hiukim/mind-ar-js-doc/blob/a32d638b74935e2b0df9763794926c88b1d75d8c/static/samples/compile.html


When getting the node-canvas error for M1 Mac

```
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

## Prepare

- Step 1. Get a sample PDF page (e.g., `/public/sample-1.pdf`)
- Step 2. Convert PDF to JPG https://ezgif.com/pdf-to-jpg
- Step 3. Perform OCR https://cloud.google.com/vision/docs/drag-and-drop
- Step 4. Save response as a JSON file (e.g., `/src/ocr-1.json`)
- Step 5. Create and compile a MindAR image target https://hiukim.github.io/mind-ar-js-doc/tools/compile/
- Step 6. Save mind target file (e.g., `/public/target-1.mind`)
