import type {
    SubEventTemplate,
    TemplateActivity,
} from "@/src/data/subeventTemplates";

export interface SelectedActivity {
  activity: TemplateActivity;
  time: string;
}

export interface SelectedSubEvent {
  template: SubEventTemplate;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
}

export type {
    SubEventTemplate,
    TemplateActivity
} from "@/src/data/subeventTemplates";

