import generateReport from '../data/report.js'


try{
    const data = {
        client: 
        {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-9876'
        }
    };
    const report = await generateReport(data);
    console.log(report);
}
catch(err){
    console.error(err);
}