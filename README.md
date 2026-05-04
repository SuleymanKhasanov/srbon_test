# Sarbon — Dispatcher Cargo

Тестовое задание: редизайн страницы списка грузов диспетчера с использованием **Next.js + React + TypeScript**, фильтрами, пагинацией, состояниями (loading / error / empty), i18n (ru / uz / en) и адаптивной вёрсткой.

Маршрут страницы: **`/<locale>/dispatcher/cargo`** (например `/ru/dispatcher/cargo`).
API-эндпоинт: `GET https://api.sarbon.me/v1/dispatchers/cargo/all`

---

## Стек технологий

| Слой | Решение |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Язык | **TypeScript** (strict) |
| UI | **Tailwind CSS v4** + **shadcn/ui** (base-nova preset, Base UI primitives) |
| HTTP | **axios** (server-side) + native `fetch` (client → собственный proxy) |
| Server state | **TanStack Query (React Query) v5** + devtools |
| Формы | **react-hook-form** |
| Валидация ответа API | **zod** |
| i18n | **next-intl 4** (роуты `/[locale]/...`) |
| Иконки | **lucide-react** |
| Toast-уведомления | **sonner** |
| Error handling | **react-error-boundary** |
| Date utils | **date-fns** + локали ru/uz/en |
| Архитектура | **Feature-Sliced Design (FSD)** |

---

## Архитектура

Проект организован по принципам [Feature-Sliced Design](https://feature-sliced.design):

```
src/
├── app/                    # Next.js App Router — тонкие route-обёртки
│   ├── _providers/         # FSD-app: QueryProvider, IntlProvider, RootProvider
│   ├── globals.css
│   ├── api/cargo/route.ts  # Server proxy → api.sarbon.me (4 headers, .env-токены)
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx              # redirect → /[locale]/dispatcher/cargo
│       └── dispatcher/cargo/page.tsx
├── views/cargo-list/       # FSD-pages (переименован, чтобы не конфликтовать с Pages Router Next.js)
├── widgets/                # Композитные UI-блоки страницы
│   ├── header/
│   ├── cargo-table/        # + skeleton/empty/error states
│   ├── cargo-card-list/    # mobile fallback
│   └── cargo-filters-panel/
├── features/               # Изолированные пользовательские действия
│   ├── filter-cargo/       # RHF + URL-state, split-commit
│   ├── paginate-cargo/
│   ├── view-cargo-detail/  # drawer (Sheet) с полным грузом
│   ├── switch-language/
│   └── copy-share-link/
├── entities/cargo/         # Бизнес-модель: types, Zod schemas, API, hook, базовый UI
└── shared/                 # Переиспользуемое
    ├── ui/                 # shadcn primitives
    ├── api/server.ts       # axios server-only с интерцептором 4 headers
    ├── lib/                # formatters, search-params, cn helper
    ├── config/             # env (Zod-валидация), api-routes
    └── i18n/               # next-intl config + ru/uz/en messages
```

**Правила импорта (сверху вниз):** `views → widgets → features → entities → shared`.

### Ключевые архитектурные решения

1. **Server-side proxy.** API-токены живут только на сервере (`SARBON_USER_TOKEN`, `SARBON_CLIENT_TOKEN`) и никогда не попадают в клиентский бандл. Клиент дёргает свой origin `/api/cargo`, Next.js Route Handler добавляет 4 обязательных header-а и форвардит запрос в Sarbon. При 401 от Sarbon мапим в `code: TOKEN_EXPIRED` для отдельного UI-состояния.
2. **URL searchParams — единственный источник истины** для фильтров и пагинации. Ссылки шарятся, кнопка «копировать ссылку» работает.
3. **Split-commit фильтры:** `status / sort / page / limit` пишут в URL мгновенно (single-click controls); текстовые / диапазонные / датовые поля — через локальный RHF state и пишут в URL по «Применить» или Enter.
4. **React Query key включает `locale`** — переключение языка инвалидирует кеш, а `keepPreviousData: true` обеспечивает плавную пагинацию без миганий.
5. **i18n.** `/[locale]/...` через next-intl. Локаль из URL пробрасывается в `X-Language` header проксируемого запроса. Cookie `NEXT_LOCALE` подхватывается middleware.

---

## API-нюанс

ТЗ перечисляет 3 обязательных header-а (`X-Device-Type`, `X-Language`, `X-Client-Token`), однако реальный эндпоинт `/v1/dispatchers/cargo/all` дополнительно требует **`X-User-Token`** — JWT диспетчера (TTL ~12ч). Это подтверждено OpenAPI-спекой на `https://api.sarbon.me/docs`. JWT можно получить через:

- `POST /v1/dispatchers/auth/login/password` (`{ phone, password }`)
- `POST /v1/dispatchers/auth/phone` → `POST /v1/dispatchers/auth/otp/verify`

Тестовый токен передан заказчиком и кладётся в `.env.local` (см. ниже). Если в процессе работы получаете состояние «Токен истёк» — обновите `SARBON_USER_TOKEN` и перезапустите dev-сервер.

---

## Запуск локально

### Требования
- Node.js ≥ 20
- pnpm 10 (или npm/yarn — но `pnpm-lock.yaml` лежит для pnpm)

### Шаги

```bash
# 1) Установить зависимости
pnpm install

# 2) Подготовить .env.local
cp .env.example .env.local
#   Заполнить значения:
#     SARBON_API_BASE_URL=https://api.sarbon.me/v1
#     SARBON_CLIENT_TOKEN=<тестовый client-token>
#     SARBON_USER_TOKEN=<JWT диспетчера, выдан заказчиком>

# 3) Запустить dev-сервер
pnpm dev
# открыть http://localhost:3000/ru/dispatcher/cargo
```

### Проверочные сценарии

| Сценарий | Ожидание |
|---|---|
| Открыть `/ru/dispatcher/cargo` | Header + фильтры + таблица грузов |
| Переключить язык (ru → uz → en) | Лейблы и `cargo_type` локализуются, грузы перезагружаются |
| Применить фильтр `truck_type=TENT` | URL обновляется, в таблице — только тенты |
| Кликнуть по строке | Открывается drawer с полной карточкой груза |
| Перейти на стр. 2 | Skeleton не моргает, текущая страница остаётся видимой во время refetch |
| Скопировать URL → открыть в инкогнито | Тот же набор фильтров и страница |
| Указать в `.env.local` невалидный `SARBON_USER_TOKEN` | Видим состояние «Токен истёк» с инструкцией |
| Mobile (< 768px) | Карточный layout, фильтры в `<Sheet>` по кнопке |

### Build / lint

```bash
pnpm build        # production build
pnpm lint         # ESLint
pnpm exec tsc --noEmit   # typecheck
```

---

## Deployment (Vercel)

1. Запушить репозиторий на GitHub.
2. Vercel → Import Project → выбрать репо.
3. В **Project Settings → Environment Variables** добавить:
   - `SARBON_API_BASE_URL`
   - `SARBON_CLIENT_TOKEN`
   - `SARBON_USER_TOKEN`
4. Build command: `pnpm build` (Vercel определит автоматически).
5. Root directory: `.` (по умолчанию).

---

## Что сделано сверх ТЗ

- ✅ Drawer с полной карточкой груза по клику (фото-галерея, payment-условия, контакт, ADR, температура и т.д.)
- ✅ Sticky `<thead>` в таблице
- ✅ `keepPreviousData` при пагинации (без миганий)
- ✅ Расширенный набор фильтров под полную OpenAPI-спеку: маршрут (from/to-city), вес min/max, даты создания, with-offers, помимо упомянутых в ТЗ status/sort
- ✅ Server-side proxy — токены не попадают в клиентский бандл

## Сознательно не вошло

- Login UI (`POST /v1/dispatchers/auth/login/password`) — токен через `.env` достаточно для теста.
- Сохранение filter-presets и density-toggle — выходит за рамки ТЗ, добавит шум.
