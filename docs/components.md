# Компоненты — Omuz CRM

Переиспользуемые компоненты из UI-Kit макета (канвас **UI-Kit**, фреймы Buttons, Text Inputs, Components, Typography). Имена — из Figma; где в Figma опечатка, она помечена и предложено чистое имя для кода (ТЗ §9: имена из макета, но опечатки не тащим).

Порядок реализации — `shared/ui` в первую очередь (ТЗ §8), от базовых к составным. Все интерактивные состояния обязательны (ТЗ §9: доступность, видимый фокус).

## Базовые (`shared/ui`)

### Button
Компонент-сет `Button`, оси вариантов:
- **Size:** Large · Medium · Small
- **Type:** `Primary` · `Primary_outlined` · `Secondary_outlined` · `Secodary_base` *(опечатка Figma → в коде `secondaryBase`)* · `Text`
- **State:** Default · Hover · Active · Focus · Disabled · **Loading** (со спиннером)

Полная матрица Size × Type × State есть в макете. Loading и Disabled — обязательные состояния, не опускать.

### Button with Icon Only
Компонент-сет. Только иконка, квадратная.
- **Type:** Primary · Secondary · Outlined · Secondary_outlined
- **Size:** Large · Medium · Small
- **State:** Default · Hover · Active · Focus · Disabled · Loading
- Обязателен `aria-label` (ТЗ §9).

### Input
Компонент-сет `Input`. Состояния:
- Default · Caption (с подписью) · Active · Typing · Filled · Disable · **Error**
- Error — с текстом ошибки под полем (форм-валидация Zod, ТЗ §11).
- В коде: `inputSize` — `md` (36px, плотные экраны со списками) и `lg` (56px, формы по макету); `rightSlot` — интерактивная иконка справа («Masc icon» в Figma).

### PasswordInput
Надстройка над `Input`: тип `password` + кнопка показа содержимого (в макете — иконка `remove_red_eye`). Кнопка доступна с клавиатуры, состояние через `aria-pressed`.

### Logo
Логотип Omuz — экспорт узла `Logo settting` из макета, инлайн-SVG. `markOnly` — только знак-«шапочка» для свёрнутого сайдбара. Цвета через переменные темы, не зашитые hex.

### Select
Компонент-сет `Select`. Состояния: Default · Caption · Active · Filled · Disable · Error. Плюс отдельный инстанс `Select` на канвасе Design.

### Textarea
Компонент-сет `Textarea`. Состояния: Default · Active · Typing · Filled · Disable.

### Chips / Badge
Несколько наборов — свести к одному гибкому компоненту с вариантами:
- `Chips` (общий): оси **Geen/Red** *(опечатка Figma «Geen» → `green`)* on/off, **Border** on/off, **Style** Primary/Secondary; отдельный вариант `Rating` (звёзды).
- `chips` — должности: Admin · Manager · Mentor · Developer.
- `chips_course` — тип занятия: Lecture · Practice · Exam.
- `Language` — теги языков/курсов: Rus · Taj · Eng · C# · C++ · Frontend · Python · HTML & CSS · UX/UI.
- Статус-бейджи из таблиц (Active / Finished / N day left) — тот же компонент, цвета из `color.status`.

### Tab
Компонент-сет `Tab` (on/off) — переключение вкладок внутри экрана. `fullWidth` — вкладки делят ширину поровну (макет Log in / Sign up).

### Step / Stepper
Компонент-сет `Step` — шаги многошаговых форм (New client, Add new student).

### Level
Компонент/сет `Level` — уровень ментора (влияет на ставку, см. Accounting/Salary).

### Theme toggle
Компонент-сет `Theme` (on/off) — переключатель светлой/тёмной темы. Держать компоненты и токены под обе темы.

### Language switcher
Переключатель Rus/Taj/Eng (в topbar и как теги). Завязан на i18n.

## Составные (`widgets`)

### Navbar (Sidebar)
Компонент-сет `Navbar` (Web/mobile on/off = expanded/collapsed). Пункты меню с иконками, раскрывающиеся группы (Students, Courses, Administration, Accounting), активный пункт подсвечен брендом. Логотип Omuz.

### User header / Topbar
`User header` (Web/mob on/off), `Header` (close/home/кнопки). Поиск, язык, уведомления, тема, профиль.

### bottom-nav (мобайл)
Компонент-сет `bottom-nav`: omuz · lang · notification · profile.

### Profile menu
`Profile_menu` — выпадающее меню профиля (250×203).

### Calendar / Timetable
Набор компонентов расписания: `Month`, `Week`, `Day`, `Days of Week`, `Date/Today` · `Date/NotToday` · `Date/DifferentMonth`, `Event`, `Block/0..4+` (плотность событий в дне), `icon/back` · `icon/forward`. Основа экранов Time table.

### Week (журнал)
Компонент-сет `Week` (варианты Stroke / Two stroke / Table) — недельная сетка посещаемости/оценок в Journal.

### Title / Breadcrumbs
Компонент-сет `Title` (on/off) и `Breadcamps` *(Figma; = breadcrumbs)* — заголовок раздела с хлебными крошками.

### Modal / Drawer
Модальные окна (`Modal`, `Modalka`) и боковые шторки (`Drawer`, шириной 360/450/520/720). По ТЗ §9: ловушка фокуса, закрытие по Esc, возврат фокуса на триггер.

### Table
Табличный блок (в макете как часть экранов, отдельного компонент-сета нет): заголовки-`label`, строки, поповеры в ячейках (статус, телефон Student/Father), колонка действий (edit/delete), сортировка, пагинация. Ключевой переиспользуемый виджет — списки студентов, групп, платежей, сотрудников используют его.

### File type icon
Набор иконок типов файлов (Courses/Resources): pdf · image · ppt · doc · video · word.

## Заметки для кода

- **Опечатки Figma:** `Secodary_base` → `secondaryBase`; `Geen` → `green`; `Breadcamps` → `Breadcrumbs`; `Attandance` (на дашборде) → `Attendance`. В коде — исправленные имена, в комментарии — исходное имя Figma.
- Все состояния hover/active/focus/disabled/loading уже нарисованы в макете — реализовывать по ним, не выдумывать.
- Токены — только из `src/shared/styles/tokens.ts`, без хардкода цветов и чисел (ТЗ §9).
