module.exports = (app) => {
    const service = require('../services/product-service');

    app.use('/app-events', async(req,res,next)=>{
        const {payload} = req.body;
        service.SubscribeEvents(payload);

        console.log("===================== Customer service Recovered Event =====================");
        
        return  res.status(200).json(payload);
    });
}