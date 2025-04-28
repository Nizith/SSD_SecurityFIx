const nodemailer = require('nodemailer');

/**
 * Send an email with improved formatting and content
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {Object} order - Order details
 */
const sendEmail = async (to, subject, order) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Format order items for display
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs:${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs:${item.totalPrice.toFixed(2)}</td>
      </tr>
    `).join('');

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #28a745; margin-top: 0;">Order Confirmation</h2>
          <p>Thank you for your order! We're excited to prepare your delicious meal.</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="border-bottom: 2px solid #28a745; padding-bottom: 10px;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> <span style="background-color: #ffc107; padding: 3px 8px; border-radius: 3px; color: #000;">${order.status}</span></p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="border-bottom: 2px solid #28a745; padding-bottom: 10px;">Delivery Address</h3>
          <p>${order.address.no}, ${order.address.street}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="border-bottom: 2px solid #28a745; padding-bottom: 10px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 8px; text-align: right;">Rs:${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Delivery Fee:</strong></td>
                <td style="padding: 8px; text-align: right;">Rs:${order.deliveryCharge.toFixed(2)}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td colspan="3" style="padding: 12px 8px; text-align: right; border-top: 2px solid #ddd;"><strong>Total:</strong></td>
                <td style="padding: 12px 8px; text-align: right; border-top: 2px solid #ddd;"><strong>Rs:${order.totalAmount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://sandbox.payhere.lk/pay/checkout?merchant_id=${process.env.MERCHANT_ID}&return_url=http://localhost:5100/api/payment/success&cancel_url=http://localhost:5100/api/payment/cancel&notify_url=http://localhost:5100/api/payment/notify&order_id=${order._id}&items=Order%20${order._id}&amount=${order.totalAmount}&currency=LKR&first_name=John&last_name=Doe&email=${order.userEmail}&phone=0771234567&address=No%20Address&city=Colombo&country=Sri%20Lanka" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Make Payment</a>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-top: 20px;">
          <p style="margin-top: 0;">We'll notify you when your order status changes. If you have any questions, please contact our customer support.</p>
          <p style="margin-bottom: 0;">Thank you for choosing our service!</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #6c757d; font-size: 14px;">
          <p>© ${new Date().getFullYear()} Your Restaurant Name. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </body>
      </html>
    `;

    // Add plain text alternative for email clients that don't support HTML
    const textContent = `
      Order Confirmation
      
      Thank you for your order! We're excited to prepare your delicious meal.
      
      ORDER DETAILS
      Order ID: ${order._id}
      Order Date: ${new Date(order.createdAt).toLocaleString()}
      Status: ${order.status}
      Payment Method: ${order.paymentMethod}
      
      DELIVERY ADDRESS
      ${order.address.no}, ${order.address.street}
      
      ORDER SUMMARY
      ${order.items.map(item => `${item.name} x ${item.quantity} - Rs:${item.totalPrice.toFixed(2)}`).join('\n')}
      
      Subtotal: Rs:${order.subtotal.toFixed(2)}
      Delivery Fee: Rs:${order.deliveryCharge.toFixed(2)}
      Total: Rs:${order.totalAmount.toFixed(2)}
      
      We'll notify you when your order status changes. If you have any questions, please contact our customer support.
      
      Thank you for choosing our service!
    `;

    // Set up mail options
    const mailOptions = {
      from: {
        name: 'Foodies',
        address: process.env.EMAIL_USER
      },
      to,
      subject,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Priority': '1', // Set email priority
        'Importance': 'high',
        'X-MSMail-Priority': 'High'
      }
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;




