import type {
  Branch,
  BranchesQuery,
  Course,
  CourseResource,
  CourseResourcesQuery,
  CoursesQuery,
  CreateStudentDto,
  Employee,
  EmployeesQuery,
  Enrollment,
  EnrollmentsQuery,
  EnrollmentStats,
  Graduate,
  GraduatesQuery,
  GraduateStats,
  Group,
  GroupsQuery,
  LoginDto,
  Paginated,
  Payment,
  PaymentsQuery,
  Session,
  SignupDto,
  SignupRequest,
  Student,
  StudentsQuery,
  UpdateStudentDto,
} from './schemas';

/**
 * Единый контракт данных (ТЗ §6). Компоненты ходят только сюда и не знают,
 * mock это или HTTP. Реализации переключаются в `./index.ts` по VITE_API_MODE.
 *
 * Пагинация/сортировка/фильтры заложены в сигнатуры сразу, даже если мок-список
 * короткий. Типы приходят из Zod-схем — руками не дублировать.
 */
export interface CrmApi {
  // Авторизация
  login(dto: LoginDto): Promise<Session>;
  logout(): Promise<void>;
  /** Восстановление сессии при загрузке приложения. `null` — не авторизован. */
  getSession(): Promise<Session | null>;
  /** Заявка на обучение с экрана Sign up. Аккаунт не создаёт. */
  signup(dto: SignupDto): Promise<SignupRequest>;

  // Студенты
  getStudents(query: StudentsQuery): Promise<Paginated<Student>>;
  getStudent(id: string): Promise<Student>;
  createStudent(dto: CreateStudentDto): Promise<Student>;
  updateStudent(id: string, dto: UpdateStudentDto): Promise<Student>;
  deleteStudent(id: string): Promise<void>;

  // Группы
  getGroups(query: GroupsQuery): Promise<Paginated<Group>>;
  getGroup(id: string): Promise<Group>;

  // Курсы
  getCourses(query: CoursesQuery): Promise<Paginated<Course>>;
  getCourse(id: string): Promise<Course>;
  /** Файлы-ресурсы курса (макет Courses/Resources). */
  getCourseResources(query: CourseResourcesQuery): Promise<Paginated<CourseResource>>;

  // Выпускники
  getGraduates(query: GraduatesQuery): Promise<Paginated<Graduate>>;
  getGraduateStats(): Promise<GraduateStats>;

  // Записи в группы (Enroll students)
  getEnrollments(query: EnrollmentsQuery): Promise<Paginated<Enrollment>>;
  getEnrollmentStats(year: number): Promise<EnrollmentStats>;

  // Филиалы
  getBranches(query: BranchesQuery): Promise<Paginated<Branch>>;

  // Сотрудники / менторы
  getEmployees(query: EmployeesQuery): Promise<Paginated<Employee>>;

  // Платежи
  getPayments(query: PaymentsQuery): Promise<Paginated<Payment>>;
}
