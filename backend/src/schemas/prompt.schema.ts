import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromptDocument = Prompt & Document;

@Schema({ timestamps: true })
export class Prompt {
  @Prop({ required: true })
  text: string;

  @Prop({ type: [{ title: String, content: String }] })
  sections: { title: string; content: string }[];

  @Prop()
  sessionId: string;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);
