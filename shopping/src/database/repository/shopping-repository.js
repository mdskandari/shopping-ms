const { OrderModel, CartModel, WishlistModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const {
  APIError,
  STATUS_CODES,
  BadRequestError,
} = require("../../utils/app-errors");
const _ = require("lodash");
const mongoose = require("mongoose");
//Dealing with data base operations
class ShoppingRepository {
  // payment

  // Cart
  async Cart(customerId) {
    try {
      return await CartModel.findOne({ customerId });
    } catch (error) {
      throw error;
    }
  }

  async ManageCart(customerId, product, qty, isRemove = false) {
    try {
      const cart = await CartModel.findOne({ customerId });
      if (cart) {
        if (isRemove) {
          // handle remove case
          cart.items = cart.items.filter(
            (item) => item.product._id !== product._id
          );
        } else {
          const cartIndex = _.findIndex(cart.items, {
            product: { _id: product._id },
          });

          if (cartIndex > -1) {
            cart.items[cartIndex].unit = qty;
          } else {
            cart.items.push({ product: { ...product }, unit: qty });
          }
        }
        return await cart.save();
      } else {
        // create new one
        return await CartModel.create({
          customerId,
          items: [{ product: { ...product }, unit: qty }],
        });
      }
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Manage Cart"
      );
    }
  }

  // Wishlist
  async GetWishlistByCustomerId(customerId) {
    try {
      return await WishlistModel.findOne({ customerId });
    } catch (error) {
      throw error;
    }
  }

  async ManageWishlist(customerId, { _id: productId }, isRemove = false) {
    try {
      const wishlist = await WishlistModel.findOne({ customerId });
      if (wishlist) {
        if (isRemove) {
          // handle remove case
          wishlist.products = wishlist.products.filter(
            (item) =>
              item._id.toString() !==
              mongoose.Types.ObjectId(productId).toString()
          );
        } else {
          const wishlistIndex = wishlist.products.filter((item) =>
            mongoose.Types.ObjectId(productId).equals(item._id)
          );

          if (!wishlistIndex.length) {
            wishlist.products.push({ _id: productId });
          }
        }
        return await wishlist.save();
      } else {
        // create new one
        return await WishlistModel.create({
          customerId,
          products: [{ _id: productId }],
        });
      }
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Manage Cart"
      );
    }
  }

  // Orders
  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders"
      );
    }
  }

  async Order(customerId, orderId) {
    try {
      if (orderId) {
        return await OrderModel.findOne({ _id: orderId });
      }
      return await OrderModel.find({ customerId });
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Order"
      );
    }
  }

  async CreateNewOrder(customerId, txnId) {
    //check transaction for payment Status

    try {
      const cart = await CartModel.findOne({ customerId });

      if (cart) {
        let amount = 0;

        if (cart.items.length > 0) {
          //process Order
          cart.items.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            txnId,
            status: "received",
            items: cart.items,
          });

          cart.items = [];

          await cart.save();

          return await order.save();
        }
      }

      return {};
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }

  async DeleteProfileData(customerId) {
    try {
      return Promise.all([
        CartModel.findOneAndDelete({ customerId }),
        OrderModel.findOneAndDelete({ customerId }),
        WishlistModel.findOneAndDelete({ customerId }),
      ]);
    } catch (error) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to to delete user profile"
      );
    }
  }
}

module.exports = ShoppingRepository;
