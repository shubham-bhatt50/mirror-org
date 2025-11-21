export type ItemType = 'workflow' | 'simulation' | 'folder';
export type Stage = 'draft' | 'production';

export interface BaseItem {
  id: string;
  name: string;
  type: ItemType;
  stage: Stage;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  parentId: string | null;
}

export interface Workflow extends BaseItem {
  type: 'workflow';
  screenCount: number;
  hasAssessment?: boolean;
  hasFlow?: boolean;
}

export interface Simulation extends BaseItem {
  type: 'simulation';
  workflowCount: number;
  hasAssessment: boolean;
  playgroundMode: boolean;
}

export interface Folder extends BaseItem {
  type: 'folder';
  children: Item[];
  playgroundMode?: boolean | null; // null = inherit from parent, true/false = explicit value
  hasAssessment?: boolean | null; // null = inherit from parent, true/false = explicit value
}

export type Item = Workflow | Simulation | Folder;

