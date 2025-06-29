import React from 'react';
import { RefreshCw, Shield, Truck, CreditCard, FileText, Cookie } from 'lucide-react';

interface PoliciesProps {
  currentSection?: string;
}

const Policies: React.FC<PoliciesProps> = ({ currentSection = 'policies' }) => {
  const renderSection = () => {
    switch (currentSection) {
      case 'privacy':
        return (
          <div className="bg-white dark:bg-[#2C2A29] rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Shield className="text-[#5D3A8D] mr-3" size={28} />
              <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5]">Privacy Policy</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Information We Collect</h3>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 mb-4">
                  We collect information you provide directly to us, such as when you create 
                  an account, make a purchase, or contact us for support.
                </p>
                <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Purchase history and preferences</li>
                  <li>Communication history with customer service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">How We Use Your Information</h3>
                <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your purchases</li>
                  <li>Provide customer support</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our products and services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Data Security</h3>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70">
                  We implement appropriate technical and organizational measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, 
                  or destruction. All data is encrypted and stored securely.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Your Rights</h3>
                <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="bg-white dark:bg-[#2C2A29] rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <FileText className="text-[#5D3A8D] mr-3" size={28} />
              <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5]">Terms of Service</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Acceptance of Terms</h3>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70">
                  By accessing and using this website, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please 
                  do not use this service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Use License</h3>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 mb-4">
                  Permission is granted to temporarily download one copy of the materials on SoleStyle's 
                  website for personal, non-commercial transitory viewing only.
                </p>
                <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                  <li>This is the grant of a license, not a transfer of title</li>
                  <li>You may not modify or copy the materials</li>
                  <li>You may not use the materials for any commercial purpose</li>
                  <li>You may not attempt to reverse engineer any software</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Disclaimer</h3>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70">
                  The materials on SoleStyle's website are provided on an 'as is' basis. SoleStyle 
                  makes no warranties, expressed or implied, and hereby disclaims and negates all 
                  other warranties including without limitation, implied warranties or conditions 
                  of merchantability, fitness for a particular purpose, or non-infringement of 
                  intellectual property or other violation of rights.
                </p>
              </div>
            </div>
          </div>
        );

      case 'cookies':
        return (
          <div className="bg-white dark:bg-[#2C2A29] rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Cookie className="text-[#A67C9D] mr-3" size={28} />
              <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5]">Cookie Policy</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">What Are Cookies</h3>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70">
                  Cookies are small text files that are placed on your computer by websites that you visit. 
                  They are widely used in order to make websites work, or work more efficiently, as well 
                  as to provide information to the owners of the site.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">How We Use Cookies</h3>
                <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand how you use our site</li>
                  <li>Marketing cookies to show you relevant advertisements</li>
                  <li>Preference cookies to remember your settings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Managing Cookies</h3>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70">
                  You can control and/or delete cookies as you wish. You can delete all cookies that 
                  are already on your computer and you can set most browsers to prevent them from 
                  being placed. However, if you do this, you may have to manually adjust some 
                  preferences every time you visit a site.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            {/* Return & Refund Policy */}
            <div className="bg-white dark:bg-[#2C2A29] rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <RefreshCw className="text-[#5D3A8D] mr-3" size={28} />
                <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5]">Return & Refund Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">30-Day Return Policy</h3>
                  <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 mb-4">
                    We offer a 30-day return policy from the date of delivery. Items must be in 
                    original condition with all tags attached and in original packaging.
                  </p>
                  <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                    <li>Shoes must be unworn and in original condition</li>
                    <li>Original packaging and tags must be included</li>
                    <li>Custom or personalized items are not eligible for return</li>
                    <li>Sale items are final sale unless defective</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Refund Process</h3>
                  <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 mb-4">
                    Once we receive your returned item, we will inspect it and notify you of 
                    the approval or rejection of your refund.
                  </p>
                  <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                    <li>Refunds will be processed within 5-7 business days</li>
                    <li>Refunds will be issued to the original payment method</li>
                    <li>Shipping costs are non-refundable unless item is defective</li>
                    <li>Return shipping costs are the responsibility of the customer</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">How to Return</h3>
                  <ol className="list-decimal list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                    <li>Contact our customer service team to initiate a return</li>
                    <li>Receive your return authorization number and shipping label</li>
                    <li>Package the item securely with all original materials</li>
                    <li>Ship the item using the provided label</li>
                    <li>Track your return and await processing confirmation</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Shipping Policy */}
            <div className="bg-white dark:bg-[#2C2A29] rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <Truck className="text-[#A67C9D] mr-3" size={28} />
                <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5]">Shipping Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Shipping Options</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-[#F5F5F5] dark:bg-[#5D3A8D]/10 rounded-lg">
                      <div>
                        <p className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">Standard Shipping</p>
                        <p className="text-sm text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">5-7 business days</p>
                      </div>
                      <p className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">Free on orders $50+</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#F5F5F5] dark:bg-[#5D3A8D]/10 rounded-lg">
                      <div>
                        <p className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">Express Shipping</p>
                        <p className="text-sm text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">2-3 business days</p>
                      </div>
                      <p className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">$9.99</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#F5F5F5] dark:bg-[#5D3A8D]/10 rounded-lg">
                      <div>
                        <p className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">Overnight Shipping</p>
                        <p className="text-sm text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">Next business day</p>
                      </div>
                      <p className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">$19.99</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Shipping Information</h3>
                  <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                    <li>Orders are processed within 1-2 business days</li>
                    <li>Shipping times exclude weekends and holidays</li>
                    <li>We ship to all 50 states and internationally</li>
                    <li>Tracking information will be provided via email</li>
                    <li>Signature may be required for high-value orders</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Policy */}
            <div className="bg-white dark:bg-[#2C2A29] rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <CreditCard className="text-[#A67C9D] mr-3" size={28} />
                <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5]">Payment Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Accepted Payment Methods</h3>
                  <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                    <li>Credit Cards (Visa, MasterCard, American Express, Discover)</li>
                    <li>Debit Cards</li>
                    <li>PayPal</li>
                    <li>Apple Pay</li>
                    <li>Google Pay</li>
                    <li>Razor Pay (for international customers)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Payment Security</h3>
                  <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 mb-4">
                    All payment information is processed securely using industry-standard 
                    encryption and security protocols.
                  </p>
                  <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                    <li>SSL encryption for all transactions</li>
                    <li>PCI DSS compliant payment processing</li>
                    <li>No payment information stored on our servers</li>
                    <li>Fraud detection and prevention measures</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-3">Billing Information</h3>
                  <ul className="list-disc list-inside text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 space-y-1">
                    <li>Payment is due at the time of purchase</li>
                    <li>Prices are subject to change without notice</li>
                    <li>All prices are in USD unless otherwise specified</li>
                    <li>Tax will be calculated and added at checkout</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4">
            {currentSection === 'privacy' ? 'Privacy Policy' :
             currentSection === 'terms' ? 'Terms of Service' :
             currentSection === 'cookies' ? 'Cookie Policy' :
             'Policies & Information'}
          </h1>
          <p className="text-lg text-[#2C2A29]/70 dark:text-[#F5F5F5]/70">
            {currentSection === 'privacy' ? 'How we collect, use, and protect your information' :
             currentSection === 'terms' ? 'Terms and conditions for using our service' :
             currentSection === 'cookies' ? 'How we use cookies on our website' :
             'Your satisfaction is our priority. Please review our policies below.'}
          </p>
        </div>

        {renderSection()}

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] rounded-xl text-white p-8 text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">Questions About Our Policies?</h2>
          <p className="text-lg mb-6">
            Our customer service team is here to help. Contact us for any questions 
            about our policies or your order.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p>Email: support@solestyle.com</p>
            <p>Phone: 1-800-SOLE-STYLE</p>
            <p>Hours: Mon-Fri 9AM-6PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;