module.exports = (app) => {
    const ShoppingService = require('../services/shopping-service');
    const service = new ShoppingService();

    app.use('/app-events', async(req,res,next)=>{
        const {payload} = req.body;
        service.SubscribeEvents(payload);

        console.log("===================== Shopping service Recovered Event =====================");
        
        return  res.status(200).json(payload);
    });
}