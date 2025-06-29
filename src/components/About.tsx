import React from 'react';
import { Award, Users, Globe, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2A29] mb-6">
            About <span className="text-[#5D3A8D]">SoleStyle</span>
          </h1>
          <p className="text-xl text-[#2C2A29]/70 max-w-3xl mx-auto">
            We're passionate about bringing you the finest footwear that combines style, 
            comfort, and quality craftsmanship. Our journey began with a simple mission: 
            to help everyone step forward with confidence.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2C2A29] mb-6">Our Story</h2>
              <p className="text-[#2C2A29]/70 mb-4">
                Founded in 2020, SoleStyle emerged from a passion for exceptional footwear. 
                We noticed a gap in the market for shoes that truly balanced style, comfort, 
                and affordability. Our founders, lifelong shoe enthusiasts, decided to create 
                a brand that would set new standards in the industry.
              </p>
              <p className="text-[#2C2A29]/70 mb-4">
                From our humble beginnings in a small workshop to becoming a trusted name 
                in footwear, we've remained committed to our core values of quality, 
                innovation, and customer satisfaction. Every pair of shoes we create is 
                a testament to our dedication to excellence.
              </p>
              <p className="text-[#2C2A29]/70">
                Today, SoleStyle serves customers worldwide, offering a curated collection 
                of shoes for men, women, and children. We continue to innovate and expand 
                our offerings while maintaining the personal touch that makes us special.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Shoe craftsmanship"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#2C2A29] text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-[#5D3A8D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-[#5D3A8D]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C2A29] mb-3">Quality First</h3>
              <p className="text-[#2C2A29]/70">
                We use only the finest materials and employ skilled craftspeople to ensure 
                every shoe meets our high standards.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-[#A67C9D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-[#A67C9D]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C2A29] mb-3">Customer Focus</h3>
              <p className="text-[#2C2A29]/70">
                Our customers are at the heart of everything we do. We listen, learn, 
                and continuously improve based on their feedback.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-[#5D3A8D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-[#5D3A8D]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C2A29] mb-3">Sustainability</h3>
              <p className="text-[#2C2A29]/70">
                We're committed to sustainable practices and reducing our environmental 
                impact through responsible sourcing and production.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-[#A67C9D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-[#A67C9D]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C2A29] mb-3">Passion</h3>
              <p className="text-[#2C2A29]/70">
                Every team member shares a genuine passion for footwear and takes pride 
                in creating shoes that make people feel confident.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-[#2C2A29] text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#5D3A8D] to-[#A67C9D] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                T
              </div>
              <h3 className="text-xl font-semibold text-[#2C2A29] mb-2">Ted</h3>
              <p className="text-[#5D3A8D] font-medium mb-2">Founder & CEO</p>
              <p className="text-[#2C2A29]/70">
                A visionary leader with 15+ years in the fashion industry, Ted founded 
                SoleStyle to revolutionize how people think about footwear.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#A67C9D] to-[#5D3A8D] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                M
              </div>
              <h3 className="text-xl font-semibold text-[#2C2A29] mb-2">Marshal</h3>
              <p className="text-[#5D3A8D] font-medium mb-2">Head of Design</p>
              <p className="text-[#2C2A29]/70">
                Marshal brings creativity and innovation to every design, ensuring our 
                shoes are both stylish and functional.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#2C2A29] to-[#5D3A8D] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                L
              </div>
              <h3 className="text-xl font-semibold text-[#2C2A29] mb-2">Lily</h3>
              <p className="text-[#5D3A8D] font-medium mb-2">Quality Assurance</p>
              <p className="text-[#2C2A29]/70">
                Lily ensures every shoe meets our rigorous quality standards before 
                reaching our customers.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            To create exceptional footwear that empowers people to express their unique style 
            while providing unmatched comfort and quality. We believe that the right pair of 
            shoes can transform not just your outfit, but your entire day.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div>
              <span className="block text-2xl font-bold">50K+</span>
              <span>Happy Customers</span>
            </div>
            <div>
              <span className="block text-2xl font-bold">100+</span>
              <span>Shoe Styles</span>
            </div>
            <div>
              <span className="block text-2xl font-bold">25+</span>
              <span>Countries Served</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;