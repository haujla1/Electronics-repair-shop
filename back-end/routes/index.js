import * as clients from '../routes/clients';
// import * as repairs from '../routes/repairs';

export const constructorMethod = app => {
    app.use('/clients', clients);
    // app.use('/repairs', repairs);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found.'});
    });
};