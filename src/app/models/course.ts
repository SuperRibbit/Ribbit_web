export interface Course {
  id?: string | number;
  title: string;
  description: string;
  banner_url: string;
  slug: string;
}

export interface CreateModulePayload {
  title: string;
  description: string;
  index_order: number;
  fk_course: number;
}

export interface CreateClassPayload {
  title: string;
  description: string;
  index_order: number;
  fk_module: number;
}

export interface CreateCourseResponse {
  message: string;
  course_id: number;
}

export interface CreateModuleResponse {
  moduleId: number; 
  title: string;
  description: string;
  index_order: number;
  fk_course: number;
}

export interface DraftClass {
  tempId: number;
  title: string;
  description: string;
  file_url: string;
}

export interface DraftModule {
  tempId: number;
  title: string;
  classes: DraftClass[];
}