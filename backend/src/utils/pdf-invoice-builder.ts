import PDFDocument from 'pdfkit';

export interface InvoiceData {
  orderId: string;
  date: string;
  status: string;
  paymentStatus: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  tax: number;
  billingAddress: {
    line: string;
    city: string;
    state?: string;
    country: string;
  };
}

export class InvoiceBuilder {
  private doc: typeof PDFDocument;
  private margins = { top: 40, bottom: 40, left: 40, right: 40 };
  private pageWidth = 595.28;
  private contentWidth: number;
  private currentY: number;
  private gap = 20;
  private smallGap = 10;

  constructor(doc: typeof PDFDocument) {
    this.doc = doc;
    this.contentWidth = this.pageWidth - this.margins.left - this.margins.right;
    this.currentY = this.margins.top;
  }

  private moveDown(multiplier = 1) {
    this.currentY += this.gap * multiplier;
  }

  private moveDownSmall() {
    this.currentY += this.smallGap;
  }

  private formatCurrency(value: number): string {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  header(brand: string, subtitle: string) {
    this.doc
      .fontSize(26)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text(brand, this.margins.left, this.currentY);

    this.doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text(subtitle, this.margins.left);

    this.moveDown(1.5);
  }

  metaRow(
    orderId: string,
    date: string,
    statusText: string,
    statusColor: string
  ) {
    const boxHeight = 70;
    const boxY = this.currentY;

    // Border box
    this.doc
      .lineWidth(1)
      .strokeColor('#e5e7eb')
      .rect(this.margins.left, boxY, this.contentWidth, boxHeight)
      .stroke();

    // Left side: Order details
    this.doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text(`Order #${orderId}`, this.margins.left + 16, boxY + 14)
      .text(`Date: ${date}`, this.margins.left + 16);

    // Right side: Status badge
    const badgeWidth = 70;
    const badgeHeight = 28;
    const badgeX = this.margins.left + this.contentWidth - badgeWidth - 16;
    const badgeY = boxY + (boxHeight - badgeHeight) / 2;

    this.doc
      .fillColor(statusColor)
      .rect(badgeX, badgeY, badgeWidth, badgeHeight)
      .fill();

    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#ffffff')
      .text(statusText, badgeX, badgeY + 6, {
        width: badgeWidth,
        align: 'center',
      });

    this.currentY = boxY + boxHeight + this.smallGap;
  }

  twoColumnSection(
    leftTitle: string,
    rightTitle: string,
    leftContent: string,
    rightContent: string
  ) {
    const colWidth = (this.contentWidth - 30) / 2;

    // Left column
    this.doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text(leftTitle, this.margins.left, this.currentY);

    this.doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#374151')
      .text(leftContent, this.margins.left, this.currentY + 20, {
        width: colWidth,
      });

    // Right column
    this.doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text(rightTitle, this.margins.left + colWidth + 30, this.currentY);

    this.doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#374151')
      .text(
        rightContent,
        this.margins.left + colWidth + 30,
        this.currentY + 20,
        {
          width: colWidth,
        }
      );

    this.moveDown(2.5);
  }

  itemsTable(items: InvoiceData['items']) {
    const tableY = this.currentY;
    const colWidths = { product: 220, qty: 50, price: 80, total: 90 };
    const rowHeight = 28;
    const headerHeight = 24;

    // Table header background
    this.doc
      .fillColor('#f3f4f6')
      .rect(this.margins.left, tableY, this.contentWidth, headerHeight)
      .fill();

    // Header text
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#6b7280')
      .text('Product', this.margins.left + 10, tableY + 6, {
        width: colWidths.product,
      })
      .text('Qty', this.margins.left + colWidths.product + 10, tableY + 6, {
        width: colWidths.qty,
        align: 'center',
      })
      .text(
        'Price',
        this.margins.left + colWidths.product + colWidths.qty + 10,
        tableY + 6,
        { width: colWidths.price, align: 'right' }
      )
      .text(
        'Total',
        this.margins.left +
          colWidths.product +
          colWidths.qty +
          colWidths.price +
          10,
        tableY + 6,
        { width: colWidths.total, align: 'right' }
      );

    let rowY = tableY + headerHeight;

    items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;

      // Alternating row background
      if (index % 2 === 0) {
        this.doc
          .fillColor('#fafbfc')
          .rect(this.margins.left, rowY, this.contentWidth, rowHeight)
          .fill();
      }

      // Row data
      this.doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#111827')
        .text(item.name, this.margins.left + 10, rowY + 8, {
          width: colWidths.product - 10,
        })
        .text(
          item.quantity.toString(),
          this.margins.left + colWidths.product + 10,
          rowY + 8,
          {
            width: colWidths.qty,
            align: 'center',
          }
        )
        .text(
          this.formatCurrency(item.price),
          this.margins.left + colWidths.product + colWidths.qty + 10,
          rowY + 8,
          { width: colWidths.price, align: 'right' }
        )
        .text(
          this.formatCurrency(itemTotal),
          this.margins.left +
            colWidths.product +
            colWidths.qty +
            colWidths.price +
            10,
          rowY + 8,
          { width: colWidths.total, align: 'right' }
        );

      rowY += rowHeight;
    });

    this.currentY = rowY + this.smallGap;
  }

  summary(data: {
    subtotal: number;
    shipping: number;
    discount: number;
    tax: number;
    total: number;
  }) {
    const summaryY = this.currentY;
    const summaryWidth = 200;
    const summaryX = this.margins.left + this.contentWidth - summaryWidth - 10;
    const lineHeight = 18;

    this.doc
      .fillColor('#f3f4f6')
      .rect(summaryX - 10, summaryY, summaryWidth + 20, 120)
      .fill();

    let lineY = summaryY + 12;

    const drawLine = (label: string, value: string) => {
      this.doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#6b7280')
        .text(label, summaryX, lineY, { width: summaryWidth / 2 });

      this.doc
        .font('Helvetica-Bold')
        .fillColor('#111827')
        .text(value, summaryX + summaryWidth / 2, lineY, {
          width: summaryWidth / 2,
          align: 'right',
        });

      lineY += lineHeight;
    };

    drawLine('Subtotal', this.formatCurrency(data.subtotal));
    if (data.shipping > 0) {
      drawLine('Shipping', this.formatCurrency(data.shipping));
    }
    if (data.discount > 0) {
      drawLine('Discount', `- ${this.formatCurrency(data.discount)}`);
    }
    if (data.tax > 0) {
      drawLine('Tax', this.formatCurrency(data.tax));
    }

    lineY += 6;
    this.doc
      .lineWidth(0.5)
      .strokeColor('#e5e7eb')
      .moveTo(summaryX, lineY)
      .lineTo(summaryX + summaryWidth, lineY)
      .stroke();

    lineY += 12;
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Total', summaryX, lineY);

    this.doc.text(
      this.formatCurrency(data.total),
      summaryX + summaryWidth / 2,
      lineY,
      {
        width: summaryWidth / 2,
        align: 'right',
      }
    );

    this.currentY = summaryY + 135;
  }

  footer(email: string, website: string) {
    this.moveDown(1);

    this.doc
      .lineWidth(0.5)
      .strokeColor('#e5e7eb')
      .moveTo(this.margins.left, this.currentY)
      .lineTo(this.margins.left + this.contentWidth, this.currentY)
      .stroke();

    this.moveDownSmall();

    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Thank you for your purchase!', this.margins.left);

    this.doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text(
        `Questions? Contact us at ${email} or visit ${website}`,
        this.margins.left
      );
  }
}
