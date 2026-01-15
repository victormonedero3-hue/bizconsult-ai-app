
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  role: Role;
  content: string;
  timestamp: Date;
}

export interface BusinessContext {
  companyName: string;
  industry: string;
  stage: 'idea' | 'startup' | 'growth' | 'mature';
  employees: string;
  mainGoal: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
