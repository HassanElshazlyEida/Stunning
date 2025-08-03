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
  // In a real implementation, this would call an AI service with streaming capabilities
  private async generateSections(text: string): Promise<{ title: string; content: string }[]> {
    // Define our sections based on the prompt
    const sectionTemplates = [
      {
        title: 'Website Concept',
        content: `A website for ${text} that helps users discover and explore new ideas.`,
      },
      {
        title: 'Target Audience',
        content: 'Professionals, enthusiasts, and curious minds interested in innovative solutions.',
      },
      {
        title: 'Key Features',
        content: 'Interactive UI, personalized recommendations, social sharing capabilities.',
      },
      {
        title: 'Design Direction',
        content: 'Modern, clean aesthetic with intuitive navigation and responsive design.',
      },
      {
        title: 'Technology Stack',
        content: 'Frontend: React/Next.js, Backend: Node.js/NestJS, Database: MongoDB.',
      },
      {
        title: 'Marketing Strategy',
        content: `Social media campaigns, content marketing, and SEO optimization for ${text}.`,
      },
      {
        title: 'Monetization Plan',
        content: 'Subscription model, freemium features, and targeted advertisements.',
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
