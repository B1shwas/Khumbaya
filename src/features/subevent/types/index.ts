import {
    SubEventTemplate,
    TemplateActivity,
} from "@/src/constants/subeventTemplates";

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
export type SubEvent = Event;


export type { SubEventTemplate, TemplateActivity };

