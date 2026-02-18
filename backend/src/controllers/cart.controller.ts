import { NextFunction, Request, Response } from 'express';
import cartService from '../services/cart.service';

class CartController {
  async createCart(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user)
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );

      const items = req.body.items || [];
      const cart = await cartService.createCart(user.userId, items);
      return (res as any).success(cart, 'Cart created/updated', null, 201);
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to create cart',
        'CART_CREATE_ERROR',
        400
      );
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user)
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );

      const cart = await cartService.getCart(user.userId);
      return (res as any).success(
        cart || { items: [], total: 0 },
        'Cart retrieved'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to get cart',
        'CART_GET_ERROR',
        400
      );
    }
  }

  async removeItem(
    req: Request<{ itemId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = (req as any).user;
      if (!user)
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );

      // Express params can sometimes be string[]; ensure we use a single string
      let itemId = req.params.itemId;
      if (Array.isArray(itemId)) {
        itemId = itemId[0];
      }

      const cart = await cartService.removeItem(user.userId, itemId);
      return (res as any).success(cart, 'Item removed from cart');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to remove item',
        'CART_REMOVE_ITEM_ERROR',
        400
      );
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user)
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );

      const cart = await cartService.clearCart(user.userId);
      return (res as any).success(cart, 'Cart cleared');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to clear cart',
        'CART_CLEAR_ERROR',
        400
      );
    }
  }

  async mergeCart(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user)
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );

      const items = req.body.items || [];
      const cart = await cartService.mergeCart(user.userId, items);
      return (res as any).success(cart, 'Cart merged successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to merge cart',
        'CART_MERGE_ERROR',
        400
      );
    }
  }
}

export default new CartController();
