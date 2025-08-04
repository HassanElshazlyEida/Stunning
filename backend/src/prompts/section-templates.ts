export const generateSectionTemplates = (text: string) => {
  return [
    {
      title: 'Navbar Section',
      content: `<!-- Navbar Section -->
<nav class="bg-amber-800 text-white">
  <div class="container mx-auto px-4 py-3 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 3a1 1 0 011-1h6a1 1 0 011 1v2H6V3zm5 4a1 1 0 10-2 0v1H7a1 1 0 100 2h2v1a1 1 0 102 0v-1h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
      </svg>
      <span class="text-xl font-bold">${text}</span>
    </div>
    <div class="hidden md:flex space-x-6">
      <a href="#home" class="hover:text-amber-200 transition">Home</a>
      <a href="#about" class="hover:text-amber-200 transition">About Us</a>
      <a href="#products" class="hover:text-amber-200 transition">Our Products</a>
      <a href="#contact" class="hover:text-amber-200 transition">Contact</a>
    </div>
    <div class="md:hidden">
      <button class="focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>
</nav>
`,
    },
    {
      title: 'Hero Section',
      content: `<!-- Hero Section -->
<section id="home" class="py-20 bg-amber-50">
  <div class="container mx-auto px-4 text-center">
    <div class="bg-white bg-opacity-80 p-8 rounded-lg max-w-2xl mx-auto shadow-lg">
      <h1 class="text-4xl md:text-5xl font-bold text-amber-800 mb-4">${text}</h1>
      <p class="text-lg md:text-xl text-amber-900 mb-8">Artisanal breads, pastries, and cakes made with love and the finest ingredients</p>
      <div class="w-24 h-1 bg-amber-500 mx-auto my-6"></div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-amber-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 15.9999V7.9999C21 6.8999 20.1 5.9999 19 5.9999H5C3.9 5.9999 3 6.8999 3 7.9999V15.9999C3 17.0999 3.9 17.9999 5 17.9999H19C20.1 17.9999 21 17.0999 21 15.9999ZM12 7.9999C14.76 7.9999 17 10.2399 17 12.9999C17 15.7599 14.76 17.9999 12 17.9999C9.24 17.9999 7 15.7599 7 12.9999C7 10.2399 9.24 7.9999 12 7.9999Z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15.9999C13.66 15.9999 15 14.6599 15 12.9999C15 11.3399 13.66 9.9999 12 9.9999C10.34 9.9999 9 11.3399 9 12.9999C9 14.6599 10.34 15.9999 12 15.9999Z" />
      </svg>
      <button class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full transition">
        Order Now
      </button>
    </div>
  </div>
</section>

<!-- Hero-About Divider -->
<div class="">`,
    },
    {
      title: 'About Section',
      content: `<!-- About Section -->
<section id="about" class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-amber-800 mb-4">About ${text}</h2>
      <div class="w-24 h-1 bg-amber-500 mx-auto"></div>
    </div>
    
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="md:w-1/2">
        <div class="bg-amber-50 p-6 rounded-lg shadow-md">
          <h3 class="text-2xl font-semibold text-amber-700 mb-4">Our Story</h3>
          <p class="text-amber-900 mb-6">Founded in 1995, our family bakery has been serving the community with freshly baked goods made from traditional recipes passed down through generations. We believe in using only the finest ingredients and baking with love.</p>
          
          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-white p-4 rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-amber-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="block text-2xl font-bold text-amber-800">25+</span>
              <span class="text-amber-600 text-sm">Years of Experience</span>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-amber-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="block text-2xl font-bold text-amber-800">50+</span>
              <span class="text-amber-600 text-sm">Team Members</span>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-amber-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="block text-2xl font-bold text-amber-800">100%</span>
              <span class="text-amber-600 text-sm">Quality Ingredients</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="md:w-1/2 mt-8 md:mt-0">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-64 w-64 mx-auto text-amber-300" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <p class="text-center text-amber-800 font-medium p-4 bg-white bg-opacity-80 rounded-lg">Our master bakers combine traditional techniques with innovative flavors to create unforgettable baked goods for every occasion.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- About-Products Divider -->
<div class="">
  `,
    },
    {
      title: 'Products Section',
      content: `<!-- Products Section -->
<section id="products" class="py-16 bg-amber-100">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-amber-800 mb-4">Our Products</h2>
      <div class="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
      <p class="text-amber-900 max-w-2xl mx-auto">Discover our handcrafted selection of freshly baked goods made daily with premium ingredients</p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Product Card 1 -->
      <div class="bg-white rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1">
        <div class="h-48 bg-amber-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-amber-800 mb-2">Artisan Breads</h3>
          <p class="text-amber-700 mb-4">Our signature sourdough, whole grain, and specialty breads are fermented slowly for maximum flavor and nutrition.</p>
          <div class="flex justify-between items-center">
            <span class="text-amber-900 font-bold">From $4.99</span>
            <button class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">View Details</button>
          </div>
        </div>
      </div>
      
      <!-- Product Card 2 -->
      <div class="bg-white rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1">
        <div class="h-48 bg-amber-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-amber-800 mb-2">French Pastries</h3>
          <p class="text-amber-700 mb-4">Delicate croissants, pain au chocolat, and other French classics made with European butter and traditional techniques.</p>
          <div class="flex justify-between items-center">
            <span class="text-amber-900 font-bold">From $3.50</span>
            <button class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">View Details</button>
          </div>
        </div>
      </div>
      
      <!-- Product Card 3 -->
      <div class="bg-white rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1">
        <div class="h-48 bg-amber-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-amber-800 mb-2">Custom Cakes</h3>
          <p class="text-amber-700 mb-4">Celebration cakes for any occasion, customized to your preferences with our signature buttercream frosting.</p>
          <div class="flex justify-between items-center">
            <span class="text-amber-900 font-bold">From $28.99</span>
            <button class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">View Details</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 text-center">
      <button class="bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-8 rounded-full transition inline-flex items-center">
        View Full Menu
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</section>

<!-- Products-Contact Divider -->
<div class="">
  `,
    },
    {
      title: 'Contact Section',
      content: `<!-- Contact Section -->
<section id="contact" class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-amber-800 mb-4">Contact Us</h2>
      <div class="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
      <p class="text-amber-900 max-w-2xl mx-auto">Have a question or want to place an order? Get in touch with our friendly team!</p>
    </div>
    
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Contact Form -->
      <div class="md:w-1/2 bg-amber-50 p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-amber-700 mb-4">Send us a Message</h3>
        <form>
          <div class="mb-4">
            <label class="block text-amber-800 mb-2" for="name">Name</label>
            <input type="text" id="name" class="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Your name" />
          </div>
          <div class="mb-4">
            <label class="block text-amber-800 mb-2" for="email">Email</label>
            <input type="email" id="email" class="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Your email" />
          </div>
          <div class="mb-4">
            <label class="block text-amber-800 mb-2" for="message">Message</label>
            <textarea id="message" rows="4" class="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Your message"></textarea>
          </div>
          <button type="submit" class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition w-full">
            Send Message
          </button>
        </form>
      </div>
      
      <!-- Bakery Info -->
      <div class="md:w-1/2">
        <div class="bg-amber-100 p-6 rounded-lg shadow-md h-full">
          <h3 class="text-2xl font-semibold text-amber-700 mb-6">Bakery Information</h3>
          
          <div class="space-y-6">
            <div class="flex items-start">
              <div class="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-medium text-amber-800">Address</h4>
                <p class="text-amber-700">123 Bakery Street<br />Flour City, FC 12345</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-medium text-amber-800">Hours</h4>
                <p class="text-amber-700">Monday - Friday: 7:00 AM - 7:00 PM<br />Saturday: 8:00 AM - 5:00 PM<br />Sunday: 8:00 AM - 3:00 PM</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-medium text-amber-800">Phone</h4>
                <p class="text-amber-700">(123) 456-7890</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-medium text-amber-800">Email</h4>
                <p class="text-amber-700">info@${text.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Contact-Footer Divider -->
<div class="">`,
    },
    {
      title: 'Footer Section',
      content: `<!-- Footer Section -->
<footer class="bg-amber-900 text-white py-10">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between">
      <!-- Logo and About -->
      <div class="mb-8 md:mb-0 md:w-1/4">
        <div class="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 3a1 1 0 011-1h6a1 1 0 011 1v2H6V3zm5 4a1 1 0 10-2 0v1H7a1 1 0 100 2h2v1a1 1 0 102 0v-1h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          <span class="text-xl font-bold text-amber-200 ml-2">${text}</span>
        </div>
        <p class="text-amber-200 mb-4">Artisanal baked goods made with love and the finest ingredients since 1995. Our family recipes bring joy to your table every day.</p>
        <div class="flex space-x-4">
          <a href="#" class="text-amber-200 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href="#" class="text-amber-200 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a href="#" class="text-amber-200 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>
      </div>
      
      <!-- Quick Links -->
      <div class="mb-8 md:mb-0">
        <h3 class="text-lg font-semibold text-amber-200 mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li><a href="#home" class="text-amber-100 hover:text-white transition">Home</a></li>
          <li><a href="#about" class="text-amber-100 hover:text-white transition">About Us</a></li>
          <li><a href="#products" class="text-amber-100 hover:text-white transition">Our Products</a></li>
          <li><a href="#contact" class="text-amber-100 hover:text-white transition">Contact</a></li>
        </ul>
      </div>
      
      <!-- Products -->
      <div class="mb-8 md:mb-0">
        <h3 class="text-lg font-semibold text-amber-200 mb-4">Our Products</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-amber-100 hover:text-white transition">Artisan Breads</a></li>
          <li><a href="#" class="text-amber-100 hover:text-white transition">French Pastries</a></li>
          <li><a href="#" class="text-amber-100 hover:text-white transition">Custom Cakes</a></li>
          <li><a href="#" class="text-amber-100 hover:text-white transition">Cookies & Treats</a></li>
        </ul>
      </div>
      
      <!-- Newsletter -->
      <div>
        <h3 class="text-lg font-semibold text-amber-200 mb-4">Subscribe to Our Newsletter</h3>
        <p class="text-amber-100 mb-4">Get updates on new products and seasonal specials!</p>
        <form class="flex">
          <input type="email" placeholder="Your email" class="px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full" />
          <button type="submit" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-r-lg transition">Subscribe</button>
        </form>
      </div>
    </div>
    
    <div class="border-t border-amber-800 mt-10 pt-6 text-center text-amber-200">
      <p>&copy; ${new Date().getFullYear()} ${text}. All rights reserved.</p>
    </div>
  </div>
</footer>
`,
    }
  ];
};
