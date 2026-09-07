@AGENTS.md

# hoho-crm 프로젝트 규칙

호호 한약국 CRM. Cursor의 Claude Code(또는 다른 AI 코딩 도구)가 작업할 때 이 파일의 규칙을 항상 따른다.

## 스택

- Next.js (App Router, TypeScript, Tailwind CSS)
- Prisma ORM + SQLite (로컬 파일 DB, 클라우드 사용 안 함)
- 패키지 매니저: pnpm (npm/npx 명령어 사용 금지)

## 폴더 구조

기능(도메인) 단위로 묶는다. 하나의 기능은 하나의 폴더 안에서 관련 파일을 함께 관리한다.

```
src/
  app/                    # 라우트 (페이지, layout)
    customers/
    appointments/
    inventory/
    payments/
  features/               # 도메인 로직 (기능 단위)
    customers/
      actions.ts          # 서버 액션 (생성/수정/삭제)
      queries.ts          # 조회 함수
      types.ts            # 이 기능에서만 쓰는 타입
      components/         # 이 기능 전용 컴포넌트
  components/             # 여러 기능에서 공용으로 쓰는 컴포넌트
  lib/                    # 공용 유틸리티 (날짜 계산, 포맷 등)
  db/                     # Prisma client 싱글턴 등 DB 연결 관련
prisma/
  schema.prisma
  migrations/
docs/
  features/               # 기능별 문서 (아래 "문서화 규칙" 참고)
```

## 네이밍 규칙

- 파일명: kebab-case (`customer-list.tsx`, `expected-run-out-date.ts`)
- React 컴포넌트: PascalCase (`CustomerList`)
- 함수/변수: camelCase
- Prisma 모델/필드: PascalCase 모델명, camelCase 필드명 (Prisma 관례 그대로 따름)
- 코드(변수/함수명)는 영어로, 도메인 용어 주석은 한글로 병기 가능
  - 예: `// 예상 소진일 (재구매 알림 기준일)`  `const expectedRunOutAt = ...`

## 데이터/서버 로직 규칙

- 폼 제출·데이터 변경(생성/수정/삭제)은 **Server Actions**를 기본으로 사용한다.
- 외부에서 호출해야 하거나(예: 나중에 태블릿 전용 앱, 웹훅) REST 형태가 필요한 경우에만 Route Handler(`app/api/...`)를 만든다.
- DB 접근은 반드시 `src/db`의 Prisma client 싱글턴을 통해서만 한다. 컴포넌트/액션 안에서 `new PrismaClient()`를 직접 생성하지 않는다.
- 사용자에게 보이는 에러 메시지는 한국어로, 무슨 문제인지와 어떻게 해야 하는지를 함께 안내한다. (예: "전화번호를 입력해주세요" O, "Invalid input" X)

## 스키마 변경 규칙

- `schema.prisma`를 수정한 뒤에는 항상 `pnpm dlx prisma migrate dev --name <변경-요약>`으로 마이그레이션을 남긴다. DB 파일을 직접 수정하지 않는다.
- 마이그레이션 이름은 영어 kebab-case로 짧게 (`add-appointment-status`, `add-reorder-point`).

## 커밋 규칙

- [Conventional Commits](https://www.conventionalcommits.org/) 형식: `feat:`, `fix:`, `docs:`, `refactor:`
- 커밋 메시지 설명은 한국어로 작성 가능. 예: `feat: 고객 상담 이력 등록 기능 추가`
- 기능 하나가 끝날 때마다 커밋한다 (여러 기능을 한 커밋에 몰아넣지 않는다).

## 문서화 규칙

기능을 하나 완성할 때마다 `docs/features/`에 문서를 하나 추가한다. 템플릿은 `docs/features/_template.md` 참고. 파일명은 기능 슬러그로: `docs/features/customer-consultation-history.md` 형태.

문서 없이 기능을 "완료"로 간주하지 않는다 — 코드를 다 짠 다음 마지막 단계로 반드시 문서를 작성한다.

## 하지 않을 것 (Non-goals)

- 클라우드 배포/호스팅 설정 (Vercel 등) — 로컬 전용이 원칙
- 인증/로그인 시스템 — 별도 요청 전까지는 만들지 않는다 (1인/소수 직원이 매장 안에서만 접근하는 전제)
- 과도한 테스트 코드 작성 — 지금 단계에서는 핵심 로직(예상 소진일 계산 등) 위주로만 최소한의 검증
