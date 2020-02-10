const User = require('../models/user');
const Order = require('../models/order');
const generatePdf = require('../utils/generatePdf');
const moment = require('moment');

function billingController() {

    const generateInvoice = async (req, res) => {
        let orderId;
        let invoiceDate = '';
        let userEmail;
        try {
            req.params.id = '5ddfad88733705f1beafe999';
            const order = await Order.findOne({ _id: req.params.id })
                .populate({
                    path: 'eventId'
                })
                .populate({
                    path: 'userId'
                });

            console.log(order);
            //var format = moment.localeData.longDateFormat('LL');
            orderId = order.id;

            tmpDate = moment(order.purchaseDate);
            invoiceDate = `${tmpDate.day()}\\${tmpDate.month()}\\${tmpDate.year()}`;
            //  const z = tmpDate.format('DD-MM-YYYY'); ? bug

            userEmail = order.userId.email;
        }
        catch (err) {
            return res.status(500).send(err);
        }

        const docDefinition = {
            content: [
                {
                    text: 'Receipt',
                    style: 'header'
                },
                {
                    columns: [
                        {
                            width: 60,
                            image: 'fonts/logo.png'
                        },
                        {
                            width: '*',
                            alignment: 'right',
                            stack: [
                                {
                                    text: `Invoice Date:  ${invoiceDate}`,
                                },
                                {
                                    text: `Invoice #:  ${orderId}`,
                                }
                            ]

                        }
                    ]
                },
                { text: 'A simple table with nested elements', style: 'subheader' },
                'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
                {
                    style: 'tableExample',
                    table: {
                        body: [
                            ['Column 1', 'Column 2', 'Column 3'],
                            [
                                {
                                    stack: [
                                        'Let\'s try an unordered list',
                                        {
                                            ul: [
                                                'item 1',
                                                'item 2'
                                            ]
                                        }
                                    ]
                                },
                                [
                                    'or a nested table',
                                    {
                                        table: {
                                            body: [
                                                ['Col1', 'Col2', 'Col3'],
                                                ['1', '2', '3'],
                                                ['1', '2', '3']
                                            ]
                                        },
                                    }
                                ],
                                {
                                    text: [
                                        'Inlines can be ',
                                        { text: 'styled\n', italics: true },
                                        { text: 'easily as everywhere else', fontSize: 10 }]
                                }
                            ]
                        ]
                    }
                },


            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'right'
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                }
            }
        };

        //ToDo: Make it async
        response = await generatePdf(docDefinition); //, (response) => {
        res.contentType('application/pdf');
        res.setHeader('Content-disposition', `attachment; filename=${orderId}.pdf`)

        res.send(response); // sends a base64 encoded string to client
        //});
    };

    return { generateInvoice };
}

module.exports = billingController;