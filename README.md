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

For python

```
brew swig
```

```
pip install trace_skeleton
pip install svgwrite
```


## Prepare

- Step 1. Get a sample PDF page (e.g., `/public/sample/sample-1.pdf`)
- Step 2. Convert PDF to JPG with [Ezgif](https://ezgif.com/pdf-to-jpg)
- Step 3. Perform OCR with [Google Cloud Vision API](https://cloud.google.com/vision/docs/drag-and-drop) and save response as a JSON file (e.g., `/src/ocr-1.json`)
- Step 4. Create an image target with [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/) and save it as a target file (e.g., `/public/sample/target-1.mind`)
- Step 5. Perform math OCR with [MathPix Web Snip Tool](https://snip.mathpix.com/) and save it as a markdown file (e.g., `/public/sample/mathpix-1.md`)



