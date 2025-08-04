import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prompt, PromptDocument } from '../schemas/prompt.schema';

@Injectable()
export class PromptsService {
  constructor(
    @InjectModel(Prompt.name) private promptModel: Model<PromptDocument>,
  ) {}

  async create(text: string, sessionId?: string): Promise<Prompt> {
    // Generate sections based on the prompt text
    const sections = await this.generateSections(text);
    
    // Create and save the new prompt with timestamp
    const newPrompt = new this.promptModel({
      text,
      sections,
      sessionId: sessionId || `session-${Date.now()}`,
      // Note: timestamps are automatically added by Mongoose schema (timestamps: true)
    });
    
    // Log the creation for monitoring
    console.log(`Created prompt: "${text.substring(0, 30)}..." with ${sections.length} sections`);
    
    return newPrompt.save();
  }

  async findAll(): Promise<Prompt[]> {
    return this.promptModel.find().sort({ createdAt: -1 }).exec();
  }
  
  async findBySession(sessionId: string): Promise<Prompt[]> {
    return this.promptModel.find({ sessionId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Prompt | null> {
    return this.promptModel.findById(id).exec();
  }

  async update(id: string, text: string): Promise<Prompt | null> {
    // Generate new sections based on updated text
    const sections = await this.generateSections(text);
    
    return this.promptModel.findByIdAndUpdate(
      id, 
      { text, sections }, 
      { new: true }
    ).exec();
  }

  async delete(id: string): Promise<Prompt | null> {
    return this.promptModel.findByIdAndDelete(id).exec();
  }

  // Generate sections based on prompt text with simulated streaming
      // Now generates 3 dummy sections with HTML content for a ChatGPT-like experience
  private async generateSections(text: string): Promise<{ title: string; content: string }[]> {
    // Define our 3 dummy sections with HTML content
    const sectionTemplates = [
      {
        title: 'Hero Section',
        content: `<div class="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg">
  <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center">Welcome to ${text}</h1>
  <p class="text-xl md:text-2xl mb-8 text-center max-w-2xl">Your premier destination for innovative solutions</p>
  <div class="flex flex-wrap gap-4 justify-center">
    <button class="px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">Get Started</button>
    <button class="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">Learn More</button>
  </div>
</div>`,
      },
      {
        title: 'About Section',
        content: `<section class="py-12 px-4 bg-white dark:bg-gray-800 rounded-lg">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">About ${text}</h2>
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <p class="text-lg text-gray-600 dark:text-gray-300">We are dedicated to providing exceptional services and products that exceed expectations.</p>
        <p class="text-lg text-gray-600 dark:text-gray-300">With years of experience in the industry, our team of experts is committed to delivering high-quality solutions.</p>
      </div>
      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 aspect-video flex items-center justify-center">
        <div class="text-gray-500 dark:text-gray-400 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Image Placeholder</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
      },
      {
        title: 'Contact Section',
        content: `<section class="py-12 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Get in Touch</h2>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
      <div class="mb-6">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
        <input type="text" id="name" placeholder="Your Name" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
      </div>
      <div class="mb-6">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
        <input type="email" id="email" placeholder="Your Email" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
      </div>
      <div class="mb-6">
        <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
        <textarea id="message" placeholder="Your Message" rows="4" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"></textarea>
      </div>
      <button class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">Send Message</button>
    </div>
  </div>
</section>`,
      },
    ];
    
    // Simulate progressive generation with delays
    // In a real implementation, this would use Server-Sent Events or WebSockets
    const sections: { title: string; content: string }[] = [];
    
    // Add a random delay factor to make it feel more natural
    const baseDelay = 300; // ms
    const randomFactor = () => Math.random() * 0.5 + 0.75; // 0.75 to 1.25
    
    // Generate sections with varying delays
    for (const template of sectionTemplates) {
      // Simulate thinking/processing time
      await new Promise(resolve => setTimeout(resolve, baseDelay * randomFactor()));
      
      // Add the section
      sections.push({
        title: template.title,
        content: template.content,
      });
    }
    
    return sections;
  }
}
