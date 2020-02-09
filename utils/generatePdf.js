const path = require('path');

const pdfMakePrinter = require('pdfmake/src/printer');


const generatePdf = (docDefinition, callback = () => {}) => 
    new Promise((resolve, reject) => {
        try {
            const fontDescriptors = {
                Roboto: {
                    normal: path.join(__dirname, '..', '/fonts/Roboto-Regular.ttf'),
                    bold: path.join(__dirname, '..', '/fonts/Roboto-Medium.ttf'),
                    italics: path.join(__dirname, '..', '/fonts/Roboto-Italic.ttf'),
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
                resolve(result);
                callback(result);
            });

            doc.end();

        } catch (err) {
            reject(err);
            throw (err);
        }
    });

module.exports = generatePdf;