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
        content: `<div class="hero-section">
  <h1 class="hero-title">Welcome to ${text}</h1>
  <p class="hero-subtitle">Your premier destination for innovative solutions</p>
  <div class="cta-container">
    <button class="cta-button primary">Get Started</button>
    <button class="cta-button secondary">Learn More</button>
  </div>
</div>`,
      },
      {
        title: 'About Section',
        content: `<section class="about-section">
  <div class="container">
    <h2 class="section-title">About ${text}</h2>
    <div class="content-columns">
      <div class="text-column">
        <p>We are dedicated to providing exceptional services and products that exceed expectations.</p>
        <p>With years of experience in the industry, our team of experts is committed to delivering high-quality solutions.</p>
      </div>
      <div class="image-column">
        <div class="image-placeholder">Image Placeholder</div>
      </div>
    </div>
  </div>
</section>`,
      },
      {
        title: 'Contact Section',
        content: `<section class="contact-section">
  <div class="container">
    <h2 class="section-title">Get in Touch</h2>
    <div class="contact-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" placeholder="Your Name" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Your Email" />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" placeholder="Your Message"></textarea>
      </div>
      <button class="submit-button">Send Message</button>
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
