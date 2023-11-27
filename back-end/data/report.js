import jsreport from 'jsreport';
import fs from 'fs'; 


export const reportTemplate = 
{
    content: 
    [
        {
            type: 'box',
            content:
            [
                {text: 'store name: Local Electronics shop', style: 'header'},
                {text: 'store address: 1234 Main St, Anytown, USA', style: 'subHeader'},
                {text: 'store phone: 555-555-5555', style: 'subHeader'}
            ]
        },

        {
            type: 'box',
            content:
            [
                { text: 'Client Name: {{client.name}}', style: 'header' },
                { text: 'Email: {{client.email}}', style: 'subHeader' },
                { text: 'Phone: {{client.phone}}', style: 'subHeader' }
            ]
        }
    ],
    styles: 
    {
        header: 
        {
            fontSize: 18,
            bold: true
        },
        subHeader: 
        {
            fontSize: 14,
            italics: true
        }
       
    }
};

const data = {
    client: 
    {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-9876'
    }
};



export async function generateReport(data) {
    try {
        const result = await jsreport.render({
            template: {
                content: reportTemplate,
                engine: 'handlebars',
                recipe: 'chrome-pdf'
            },
            data: data
        });

        await fs.writeFile('report.pdf', result.content);
        console.log('Report saved as report.pdf');
        return 'Report saved as report.pdf';
    } catch (err) {
        console.error('Error generating report:', err);
        throw err; // Rethrow the error to handle it further up the call stack if necessary
    }
}

generateReport(data).then(message => console.log(message)).catch(err => console.error(err));
console.log(`Current directory: ${process.cwd()}`);


     