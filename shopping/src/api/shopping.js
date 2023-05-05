const { CUSTOMER_BINDING_KEY } = require("../config");
const ShoppingService = require("../services/shopping-service");
const { SubscribeMessage, PublishMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new ShoppingService();
  SubscribeMessage(channel, service);

  // Cart
  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const data = await service.GetCart(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { qty, _id: productId } = req.body;
    try {
      const data = await service.AddCartItem(_id, productId, qty);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { id: productId } = req.params;

    try {
      const data = await service.RemoveCartItem(_id, productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // Wishlist
  app.get("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const data = await service.GetWishlist(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { qty, _id: productId } = req.body;
    try {
      const data = await service.AddToWishlist(_id, productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { id: productId } = req.params;
    try {
      const data = await service.RemoveFromWishlist(_id, productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // Orders
  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id: userId } = req.user;
    const { txnNumber } = req.body;

    try {
      const data = await service.CreateOrder(userId, txnNumber);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/order/:id", UserAuth, async (req, res, next) => {
    const { _id: userId } = req.user;
    const { id: orderId } = req.params;

    try {
      const data = await service.GetOrder(userId, orderId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const data = await service.GetOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
