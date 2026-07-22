# Экраны — Omuz CRM

Составлено на этапе 0 из выгрузки Figma (`figma/pages.json`, канвас **Design** — 293 фрейма). Это карта макета, не финальный список задач на реализацию (порядок работ — в `roadmap.md`).

## Что это за продукт

**CRM учебного центра** (не sales-CRM). Домен — обучение: студенты, группы, курсы, менторы и сотрудники, журнал успеваемости и посещаемости, платежи и бухгалтерия, зарплата, выпускники, трудоустройство, SMS-рассылки. Валюта — сомони (Таджикистан).

Ключевые факты, снявшие открытые вопросы ТЗ:

- **Локализация обязательна** — переключатель языка Rus / Taj / Eng в шапке. i18n закладывать сразу.
- **Роли есть** — Admin / Manager / Mentor / Developer; отдельные профили Student / Mentor / Admin; раздел Administration (Users, Roles, Logs). Интерфейс зависит от роли.
- **Авторизация есть** — экраны Log in и Sign up (десктоп + мобайл).
- **Тема** — переключатель светлая/тёмная в шапке (компонент `Theme` on/off). Токены и компоненты закладывать под обе темы.

## Каркас приложения

- **Sidebar (Navbar)** — сворачиваемый, состояния collapsed/expanded. Пункты: Dashboard, Students (→ All students, Graduates), Groups, Employees, Progressbook, Timetable, Courses (раскрывается), Administration (→ Users, Roles, Logs), Accounting (раскрывается), Branches, Jobs, SMS mailings. Логотип Omuz сверху.
- **Topbar** — кнопка сворачивания сайдбара, поиск, переключатель языка (флаг + код), колокол уведомлений, переключатель темы, аватар профиля (меню `Profile_menu`).
- **Bottom-nav (мобайл)** — omuz / lang / notification / profile.
- Ширины макета: десктоп **1440**, мобайл **360**. Адаптив по ТЗ — 360–1920.

## Разделы и экраны

Легенда: 🖥 десктоп (1440) · 📱 мобайл (360) · ▽ оверлей (Modal/Drawer). Оверлеи (шторки-Drawer, модалки-Modal/Modalka) в макете вынесены отдельными фреймами и привязаны к разделам ниже.

### Auth
- 🖥 Log in · 🖥 Sign up · 📱 мобильные версии (Android Large 1–2)

### Dashboard
- 🖥 Dashboard (длинная прокручиваемая страница) · 📱 Dashboard (несколько состояний)
- Блоки: карточки-счётчики (Students / Users / Employees), список групп с доходом, сводка посещаемости Present / Absent / Late + таблица, графики: Leads (линия), Income (пончик %), Attendance (area, Late/Absent), Enroll (area), Left courses (столбцы), таблица «Employed graduates».
- ▽ оверлеи: Notification, Lang, Absent
- **Графики → Recharts** (линия, area, пончик, столбцы) — подтверждено, метка [по макету] снята.

### Students
- 🖥 Students/List, Students/Grid (переключатель список/плитка), Students/Add new student, Students/Edit profile
- 🖥 Graduates (List/Grid), Enroll students
- 📱 версии перечисленного
- Таблица: ФИО, группы, телефон (поповер Student/Father), статус, наличие аккаунта, контракт (Active / N day left / Finished), действия (edit/delete). Фильтры: поиск, Course, Group, Contract.
- ▽ New client (шаги), Edit client, карточки Contract 1–3

### Groups
- 🖥 Groups/Grid, Groups/List · 🖥 карточка группы «C# 5 group»
- 📱 версии
- Внутри группы: список студентов, посещаемость, доход

### Courses
- 🖥 Courses/Grid, Courses/List, Courses/Resources, Courses/Clients · Left courses
- Ресурсы курса: файлы (pdf / image / ppt / doc / video / word — набор иконок типов)

### Employees / Mentors
- 🖥 Employees/Grid, Employees/List, Employees/Add new mentor, Employees/Mentor levels
- 🖥 Profile/Mentor, Profile/Mentor/Materials, Profile/Mentor/Materials/Question
- 🖥 Mentors progressbook (скрыт в макете)

### Journal (журнал / успеваемость)
- 🖥 Journal (несколько состояний) · 📱 Journal
- 🖥 Progressbook, Student activity · 📱 Student activity
- Оценки, посещаемость, недельная сетка (компонент Week)

### Timetable (расписание)
- 🖥 Time table (8 состояний — виды/фильтры) — календарь: Month / Week / Day, события (компоненты Calendar/Event/Date)

### Accounting (бухгалтерия)
- 🖥 Accounting, Accounting/Budget, Payments, Expenses, Debtors, Accountant
- 🖥 Salary, Avans (аванс) · оверлеи Avans, Level (уровни ментора → ставка)
- 📱 Accounting, Payments

### SMS mailings (рассылки)
- 🖥 SMS mailings + по аудиториям: Group, Students, Leads, Graduates, Mentors · Templates
- 📱 SMS mailings / Students

### Administration
- 🖥 Administration/User, Administration/Roles, Administration/Logs
- 📱 Administration/User

### Прочее
- 🖥 Branches (филиалы) · 🖥 Jobs (вакансии/трудоустройство, скрыт)
- 🖥 Profile/Student, Profile/Admin · 📱 версии
- 🖥 Student/Home task (домашние задания, в UI-Kit — набор состояний сдачи)

## Состояния экранов

В макете явно нарисованы: **список с данными**, **фильтры**, **поповеры** (статус, телефон), **пустой/ошибка** — отдельными кадрами не везде. По ТЗ §11 для каждого экрана-списка реализуются четыре состояния независимо от наличия в макете:

- **loading** — скелет таблицы/карточек;
- **empty** — приглашение к действию (напр. «Добавить студента»);
- **error** — что случилось и что делать, кнопка «Повторить»;
- **много данных** — пагинация/виртуализация, горизонтальный скролл таблицы.

Формы (Add new student, Add new mentor, New client, SMS) имеют состояния: пусто → ввод → валидация (ошибка у поля) → отправка (loading) → успех.

## Открытые вопросы по экранам

- Точная привязка каждого оверлея Modal/Modalka/Drawer к родительскому экрану — уточняется при реализации соответствующего раздела (в макете они лежат плоско на канвасе).
- Часть фреймов помечены `hidden` (черновики: Jobs/List, Mentors progressbook, Student/Home task на канвасе Design) — брать в работу только по подтверждению заказчика.
- Есть ли реальный бэкенд (ТЗ §12 в.1) — по-прежнему открыт; на слое моков это не блокирует.
