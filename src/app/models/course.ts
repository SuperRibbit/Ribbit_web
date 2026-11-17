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

export interface CreateCourseResponse {
  message: string;
  course_id: number;
}

export interface CreateModuleResponse {
  message: string;
  moduleId: number;
}

export interface CreateClassResponse {
  message: string;
  class_id: number;
}

export interface ModuleFull {
  id_module: number;
  title: string;
  description: string;
  index_order: number;
  fk_course: number;
}

export interface UpdateModuleResponse {
  message: string;
  module: ModuleFull;
}

export interface CourseClassFull {
  class_id: number;
  title: string;
  description: string;
  index_order: number;
  fk_module: number;
}

export interface UpdateClassResponse {
  message: string;
  class: CourseClassFull;
}

export interface CourseClassSummary {
  class_id: number;
  title: string;
  is_completed: boolean;
}

export interface CourseModuleSummary {
  module_id: number;
  title: string;
  index_order: number;
  classes: CourseClassSummary[];
}

export interface CourseFull {
  id_course: number;
  id?: number;
  title: string;
  slug: string;
  description: string;
  banner_url?: string;
  teacher_name: string;
  progress: number;
  modules: CourseModuleSummary[];
}

export interface CoursesResponse {
  courses: CourseFull[];
}

export type CoursesResult = CourseFull[] | CoursesResponse;

export type CourseDetailResponse = CourseFull & { course?: CourseFull };

export interface MessageResponse {
  message: string;
}

export interface CourseOperationResponse extends MessageResponse {
  course?: CourseFull;
}

export interface FileUploadResponse extends MessageResponse {
  file_id?: number;
  file_url?: string | null;
  display_name?: string;
  file_type?: string | null;
}

export interface EnrolledCourse {
  id?: number;
  course_id?: number;
  id_course?: number;
  title: string;
  slug?: string;
  description?: string;
  banner_url?: string;
  teacher_name?: string;
  progress?: number;
  modules?: CourseModuleSummary[];
}

export interface EnrollmentSummary {
  enrollment_id: number;
  progress: number;
  enrollment_date?: string | null;
  course: EnrolledCourse;
}

export interface MyCoursesResponse {
  courses?: EnrollmentSummary[];
}

export interface ModuleClassSummary {
  class_id: number;
  title: string;
  index_order: number;
}

export interface ModuleWithClasses {
  module_id: number;
  title: string;
  description: string;
  index_order: number;
  classes: ModuleClassSummary[];
}

export interface ClassMaterial {
  file_id: number;
  display_name: string;
  file_url: string | null;
  file_type: string | null;
}

export interface CourseClassDetail {
  class_id: number;
  title: string;
  description: string;
  index_order: number;
  fk_module: number;
  materials: ClassMaterial[];
}

export interface CourseModule {
  module_id: number;
  title: string;
  description?: string;
  index_order: number;
  classes: CourseClass[];
}

export interface CourseClass {
  class_id: number;
  title: string;
  description?: string;
  index_order?: number;
  is_completed?: boolean;
  materials?: ClassMaterial[];
}