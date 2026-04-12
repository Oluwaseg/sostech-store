import { NextFunction, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import orderService from '../services/order.service';

class OrderController {
  async listMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'ORDER_LIST_AUTH_ERROR',
          401
        );
      }

      const { orders, stats } = await orderService.getUserOrders(user._id);
      return (res as any).success(
        { orders, stats },
        'Orders and stats fetched successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch orders',
        'ORDER_LIST_ERROR',
        400
      );
    }
  }

  async getMyOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'ORDER_DETAIL_AUTH_ERROR',
          401
        );
      }

      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;

      const order = await orderService.getUserOrderById(user._id, id);
      if (!order) {
        return (res as any).error(
          'Order not found',
          'ORDER_DETAIL_NOT_FOUND',
          404
        );
      }

      return (res as any).success(order, 'Order fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch order',
        'ORDER_DETAIL_ERROR',
        400
      );
    }
  }

  downloadInvoice = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return (res as any).error(
        'Authentication required',
        'ORDER_INVOICE_AUTH_ERROR',
        401
      );
    }

    let { id } = req.params;
    id = Array.isArray(id) ? id[0] : id;

    const order = await orderService.getUserOrderById(user._id, id);
    if (!order) {
      return (res as any).error(
        'Order not found',
        'ORDER_INVOICE_NOT_FOUND',
        404
      );
    }

    try {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="invoice-${order._id}.pdf"`
      );

      const doc = new PDFDocument({ size: 'A4', margin: 40 });

      doc.on('error', () => {
        res.destroy();
      });

      res.on('error', () => {
        if (typeof (doc as any).destroy === 'function') {
          (doc as any).destroy();
        }
      });

      doc.pipe(res);
      this.generateInvoicePdf(doc, order);
      doc.end();
    } catch (error: any) {
      console.error('Invoice generation error:', error);
      if (!res.headersSent) {
        return (res as any).error(
          error.message || 'Failed to generate invoice',
          'ORDER_INVOICE_ERROR',
          400
        );
      }
      res.destroy();
    }
  };

  private generateInvoicePdf(doc: typeof PDFDocument, order: any) {
    const margins = { top: 40, bottom: 40, left: 40, right: 40 };
    const pageWidth = 595.28;
    const contentWidth = pageWidth - margins.left - margins.right;

    const formatCurrency = (value: number) => `₦${value.toFixed(2)}`;
    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(date));

    const tax = Math.max(
      0,
      order.total - order.subtotal - order.shippingFee + (order.discount || 0)
    );

    const getStatusLabel = () => {
      if (order.paymentStatus === 'paid') return 'PAID';
      if (order.paymentStatus === 'payment_pending') return 'PAYMENT PENDING';
      if (order.paymentStatus === 'cancelled') return 'CANCELLED';
      if (order.paymentStatus === 'refunded') return 'REFUNDED';
      return order.shippingStatus?.toUpperCase() || 'PENDING';
    };

    const getStatusColor = () => {
      if (order.paymentStatus === 'paid') return '#16a34a';
      if (order.paymentStatus === 'payment_pending') return '#f59e0b';
      if (order.paymentStatus === 'cancelled') return '#ef4444';
      if (order.paymentStatus === 'refunded') return '#6366f1';
      return '#2563eb';
    };

    // Header Section
    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('SOSTECH Store', margins.left, margins.top);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text('Modern ecommerce orders & invoice history', margins.left);

    doc.moveDown(0.5);

    // Invoice Details Box
    const boxY = doc.y;
    doc
      .lineWidth(1)
      .strokeColor('#e5e7eb')
      .rect(margins.left, boxY, contentWidth, 85)
      .stroke();

    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Invoice Details', margins.left + 12, boxY + 10);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text(
        `Order #${order._id.toString().slice(-8).toUpperCase()}`,
        margins.left + 12,
        boxY + 28
      )
      .text(`Date: ${formatDate(order.createdAt)}`, margins.left + 12)
      .text(`Shipping Status: ${order.shippingStatus}`, margins.left + 12);

    // Status Badge
    const badgeText = getStatusLabel();
    const badgeColor = getStatusColor();
    const badgeX = margins.left + contentWidth - 80;
    const badgeY = boxY + 12;

    doc.fillColor(badgeColor).rect(badgeX, badgeY, 70, 22).fill();

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#ffffff')
      .text(badgeText, badgeX, badgeY + 6, { width: 70, align: 'center' });

    doc.moveTo(margins.left, boxY + 85);
    doc.y = boxY + 90;
    doc.moveDown(0.5);

    // Bill To Section
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Bill To');

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#374151')
      .text(order.shipping?.addressLine || '', margins.left)
      .text(
        [order.shipping?.city, order.shipping?.state, order.shipping?.country]
          .filter(Boolean)
          .join(', '),
        margins.left
      );

    doc.moveDown(0.5);

    // Items Table
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#111827').text('Items');

    doc.moveDown(0.3);

    const tableStartY = doc.y;
    const colWidths = { product: 200, qty: 60, price: 80, total: 90 };

    // Table Header
    doc.fillColor('#f3f4f6').rect(margins.left, doc.y, contentWidth, 24).fill();

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#6b7280')
      .text('Product', margins.left + 8, tableStartY + 6, {
        width: colWidths.product,
      })
      .text('Qty', margins.left + colWidths.product + 8, tableStartY + 6, {
        width: colWidths.qty,
        align: 'right',
      })
      .text(
        'Price',
        margins.left + colWidths.product + colWidths.qty + 8,
        tableStartY + 6,
        {
          width: colWidths.price,
          align: 'right',
        }
      )
      .text(
        'Total',
        margins.left + colWidths.product + colWidths.qty + colWidths.price + 8,
        tableStartY + 6,
        { width: colWidths.total, align: 'right' }
      );

    doc.y = tableStartY + 28;

    // Table Rows
    order.items.forEach((item: any, index: number) => {
      const itemTotal = item.price * item.quantity;
      const rowY = doc.y;

      // Alternating row background
      if (index % 2 === 0) {
        doc
          .fillColor('#f9fafb')
          .rect(margins.left, rowY - 2, contentWidth, 24)
          .fill();
      }

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#111827')
        .text(item.name, margins.left + 8, rowY, {
          width: colWidths.product - 8,
        })
        .text(
          item.quantity.toString(),
          margins.left + colWidths.product + 8,
          rowY,
          {
            width: colWidths.qty,
            align: 'right',
          }
        )
        .text(
          formatCurrency(item.price),
          margins.left + colWidths.product + colWidths.qty + 8,
          rowY,
          {
            width: colWidths.price,
            align: 'right',
          }
        )
        .text(
          formatCurrency(itemTotal),
          margins.left +
            colWidths.product +
            colWidths.qty +
            colWidths.price +
            8,
          rowY,
          { width: colWidths.total, align: 'right' }
        );

      doc.y = rowY + 24;
    });

    doc.moveDown(0.5);

    // Summary Section
    const summaryX = margins.left + 280;
    const summaryWidth = contentWidth - 280;

    doc.fillColor('#f3f4f6').rect(summaryX, doc.y, summaryWidth, 120).fill();

    const summaryY = doc.y;
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Summary', summaryX + 12, summaryY + 10);

    let summaryLineY = summaryY + 30;

    const drawSummaryLine = (label: string, value: string) => {
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#6b7280')
        .text(label, summaryX + 12, summaryLineY, {
          width: summaryWidth / 2 - 12,
        });

      doc
        .font('Helvetica-Bold')
        .fillColor('#111827')
        .text(value, summaryX + summaryWidth / 2, summaryLineY, {
          width: summaryWidth / 2 - 12,
          align: 'right',
        });

      summaryLineY += 16;
    };

    drawSummaryLine('Subtotal', formatCurrency(order.subtotal));
    if (order.shippingFee > 0) {
      drawSummaryLine('Shipping', formatCurrency(order.shippingFee));
    }
    if (order.discount > 0) {
      drawSummaryLine('Discount', `- ${formatCurrency(order.discount)}`);
    }
    if (tax > 0) {
      drawSummaryLine('Tax', formatCurrency(tax));
    }

    summaryLineY += 5;
    doc
      .lineWidth(0.5)
      .strokeColor('#e5e7eb')
      .moveTo(summaryX + 12, summaryLineY)
      .lineTo(summaryX + summaryWidth - 12, summaryLineY)
      .stroke();

    summaryLineY += 12;
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Total', summaryX + 12, summaryLineY);

    doc.text(
      formatCurrency(order.total),
      summaryX + summaryWidth / 2,
      summaryLineY,
      {
        width: summaryWidth / 2 - 12,
        align: 'right',
      }
    );

    doc.y = summaryY + 125;
    doc.moveDown(1);

    // Footer Section
    doc.fillColor('#111827').rect(margins.left, doc.y, contentWidth, 60).fill();

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#ffffff')
      .text('Thank you for your purchase!', margins.left + 12, doc.y + 10);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#d1d5db')
      .text('Need help? Contact us:', margins.left + 12, doc.y + 28)
      .text('support@sostechstore.com | sostechstore.com', margins.left + 12);
  }

  // ----- Admin-side -----

  async listAllOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const { orders, stats } = await orderService.getAllOrdersWithStats();
      return (res as any).success(
        { orders, stats },
        'All orders and stats fetched successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch orders',
        'ADMIN_ORDER_LIST_ERROR',
        400
      );
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;

      const order = await orderService.getOrderById(id);
      if (!order) {
        return (res as any).error(
          'Order not found',
          'ADMIN_ORDER_DETAIL_NOT_FOUND',
          404
        );
      }

      return (res as any).success(order, 'Order fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch order',
        'ADMIN_ORDER_DETAIL_ERROR',
        400
      );
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;

      const { status } = req.body as { status?: string };
      const allowedStatuses = [
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ];

      if (!status || !allowedStatuses.includes(status)) {
        return (res as any).error(
          'Invalid shipping status',
          'ADMIN_ORDER_STATUS_INVALID',
          422
        );
      }

      const order = await orderService.updateOrderShippingStatus(
        id,
        status as any
      );
      if (!order) {
        return (res as any).error(
          'Order not found',
          'ADMIN_ORDER_STATUS_NOT_FOUND',
          404
        );
      }

      // Send email notification for shipping status change
      await orderService.sendOrderStatusEmail(id);

      return (res as any).success(order, 'Order status updated successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update order status',
        'ADMIN_ORDER_STATUS_ERROR',
        400
      );
    }
  }
}

export default new OrderController();
