import {
  SubEventTemplate,
  TemplateActivity,
} from "../constants/subeventTemplates";

export interface SelectedActivity {
  activity: TemplateActivity;
  time: string;
  budget: string;
}

export interface SelectedSubEvent {
  template: SubEventTemplate;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
  invited: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: string;
  phone?: string;
  email?: string;
  selected?: boolean;
  imageUrl?: string;
  verified?: boolean;
  reviews?: number;
  yearsExperience?: number;
  description?: string;
}

export type {
  SubEventTemplate,
  TemplateActivity
} from "../constants/subeventTemplates";

