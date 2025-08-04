// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the website-generator database
db = db.getSiblingDB('website-generator');

// Create a user for the application
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'website-generator'
    }
  ]
});

// Create indexes for better performance
db.prompts.createIndex({ "sessionId": 1 });
db.prompts.createIndex({ "createdAt": -1 });
db.prompts.createIndex({ "isActive": 1 });

// Insert sample data (optional)
db.prompts.insertOne({
  text: "Create a modern bakery website with hero section and contact form",
  sections: [
    {
      title: "Hero",
      content: "<section class='hero bg-gradient-to-r from-amber-50 to-orange-100 py-20'><div class='container mx-auto text-center'><h1 class='text-5xl font-bold text-gray-800 mb-4'>Fresh Baked Daily</h1><p class='text-xl text-gray-600 mb-8'>Artisan breads and pastries made with love</p><button class='bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors'>Order Now</button></div></section>"
    },
    {
      title: "About",
      content: "<section class='about py-16 bg-white'><div class='container mx-auto px-4'><div class='max-w-4xl mx-auto text-center'><h2 class='text-4xl font-bold text-gray-800 mb-8'>Our Story</h2><p class='text-lg text-gray-600 leading-relaxed'>For over 30 years, we've been crafting the finest breads and pastries using traditional methods and the freshest ingredients. Every loaf tells a story of passion, dedication, and the timeless art of baking.</p></div></div></section>"
    },
    {
      title: "Contact",
      content: "<section class='contact py-16 bg-gray-50'><div class='container mx-auto px-4'><div class='max-w-2xl mx-auto'><h2 class='text-4xl font-bold text-center text-gray-800 mb-12'>Visit Our Bakery</h2><div class='bg-white rounded-lg shadow-lg p-8'><div class='grid md:grid-cols-2 gap-8'><div><h3 class='text-xl font-semibold mb-4'>Location</h3><p class='text-gray-600'>123 Baker Street<br>Sweet City, SC 12345</p></div><div><h3 class='text-xl font-semibold mb-4'>Hours</h3><p class='text-gray-600'>Mon-Fri: 6AM - 8PM<br>Sat-Sun: 7AM - 9PM</p></div></div></div></div></div></section>"
    }
  ],
  sessionId: "demo-session-001",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Database initialization completed successfully!");
