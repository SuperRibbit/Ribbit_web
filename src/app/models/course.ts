export interface CoursePayload {
  title: string;
  slug: string;
  description: string;
}

export interface ModulePayload {
  title: string;
  description?: string;
  index_order: number;
  fk_course: number;
}

export interface ClassPayload {
  title: string;
  description: string;
  index_order: number;
  fk_module: number;
}

export interface CourseModule {
  module_id: number;
  title: string;
  index_order: number;
  classes: CourseClass[];
}

export interface CourseClass {
  class_id: number;
  title: string;
  is_completed?: boolean;
}