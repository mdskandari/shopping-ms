const CustomerService = require('../services/customer-service');

module.exports = (app) =>{
    const service = new CustomerService();

    app.use('/app-event',async(req,res,next)=>{
        const payload = req.body;
        service.SubscribeEvents(payload);

        console.log("===================== Customer service Recovered Event =====================");
        
        return  res.status(200).json(payload);
    })
}