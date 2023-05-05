const { ShoppingRepository } = require("../database");
const { FormateData, RPCRequest } = require("../utils");
const {
  APIError,
  STATUS_CODES,
  BadRequestError,
} = require("../utils/app-errors");
// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  // Cart Info
  async GetCart(_id) {
    try {
      return await this.repository.Cart(_id);
    } catch (error) {
      throw error;
    }
  }

  async AddCartItem(customerId, productId, qty) {
    try {
      // grab product info from product service
      const product = await RPCRequest("PRODUCT_RPC", {
        type: "VIEW_PRODUCT",
        data: productId,
      });
      if (product && product._id) {
        return await this.repository.ManageCart(customerId, product, qty);
      }
    } catch (error) {
      throw new APIError("Could not add product to Cart!", err);
    }
  }

  async RemoveCartItem(customerId, productId) {
    try {
      // grab product info from product service
      const product = await RPCRequest("PRODUCT_RPC", {
        type: "VIEW_PRODUCT",
        data: productId,
      });

      if (product && product._id) {
        return await this.repository.ManageCart(customerId, product, 0, true);
      }
    } catch (error) {
      throw new APIError("Could not add product to Cart!", error);
    }
  }

  // Wishlist
  async GetWishlist(_id) {
    try {
      const { products } = await this.repository.GetWishlistByCustomerId(_id);
      if (Array.isArray(products)) {
        const ids = products.map(({ _id }) => _id);
        // perform rpc call
        const productResponse = await RPCRequest("PRODUCT_RPC", {
          type: "VIEW_PRODUCTS",
          data: ids,
        });
        if (productResponse) {
          return productResponse;
        }
      }
      return {};
    } catch (error) {
      throw error;
    }
  }

  async AddToWishlist(customerId, productId) {
    try {
      // grab product info from product service
      const product = await RPCRequest("PRODUCT_RPC", {
        type: "VIEW_PRODUCT",
        data: productId,
      });
      if (product && product._id) {
        return await this.repository.ManageWishlist(customerId, product);
      }
    } catch (error) {
      throw new APIError("Could not add product to Cart!", err);
    }
  }

  async RemoveFromWishlist(customerId, productId) {
    try {
      // grab product info from product service
      const product = await RPCRequest("PRODUCT_RPC", {
        type: "VIEW_PRODUCT",
        data: productId,
      });

      if (product && product._id) {
        return await this.repository.ManageWishlist(customerId, product, true);
      }
    } catch (error) {
      throw new APIError("Could not add product to Cart!", error);
    }
  }

  // Orders
  async CreateOrder(userId, txnNumber) {
    // Verify the txn number with payment logs

    try {
      return await this.repository.CreateNewOrder(userId, txnNumber);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrder(customerId, orderId) {
    try {
      return await this.repository.Order(customerId, orderId);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (error) {
      throw error;
    }
  }

  async DeletePrfileData(customerId) {
    try {
      return this.repository.DeleteProfileData(customerId);
    } catch (error) {
      throw error;
    }
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "DELETE_PROFILE":
        await this.DeletePrfileData(userId._id);
        break;
      default:
        break;
    }
  }

  // GetOrderPayload(userId, order, event) {
  //   if (order) {
  //     return {
  //       event,
  //       data: {
  //         userId,
  //         order,
  //       },
  //     };
  //   } else {
  //     return {
  //       error: "No Order available",
  //     };
  //   }
  // }
}

module.exports = ShoppingService;
