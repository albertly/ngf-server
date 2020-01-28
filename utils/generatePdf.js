const path = require('path');

const pdfMakePrinter = require('pdfmake/src/printer');

module.exports = function generatePdf(docDefinition, callback)  {
  try {
    const fontDescriptors = { 
        Roboto: {
			normal: path.join(__dirname, '..',  '/fonts/Roboto-Regular.ttf'),
			bold: path.join(__dirname, '..',  '/fonts/Roboto-Medium.ttf'),
			italics: path.join(__dirname, '..','/fonts/Roboto-Italic.ttf'),
			bolditalics: path.join(__dirname, '..', '/fonts/Roboto-MediumItalic.ttf')
    }
 };
    const printer = new pdfMakePrinter(fontDescriptors);
    const doc = printer.createPdfKitDocument(docDefinition);
    
    let chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });
  
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      callback(result);
    });
    
    doc.end();
    
  } catch(err) {
    throw(err);
  }
};