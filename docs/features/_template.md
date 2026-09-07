# 기능명

## 개요

이 기능이 무엇이고 왜 필요한지 2~3문장으로.

## 범위

- 포함:
- 포함 안 함 (Non-goals):

## 데이터 모델

관련 Prisma 모델/필드 변경. 마이그레이션 이름도 함께 기록.

- 모델: `Model`
- 마이그레이션: `add-xxx` (`prisma/migrations/...`)

## 서버 로직

- Server Actions: `src/features/<domain>/actions.ts`
  - `actionName(...)`: 무슨 일을 하는지
- Queries: `src/features/<domain>/queries.ts`
  - `queryName(...)`: 무엇을 조회하는지

## 화면/UI

- 라우트: `src/app/<route>/page.tsx`
- 주요 컴포넌트: `src/features/<domain>/components/...`

## 에러/예외 처리

사용자에게 노출되는 한국어 에러 메시지와 발생 조건.

- 조건 → 메시지

## 확인한 시나리오

- [ ] 정상 입력으로 생성/수정/삭제 확인
- [ ] 잘못된 입력(빈 값, 중복 등) 시 에러 메시지 확인

## 관련 문서/이슈

- 관련된 다른 `docs/features/*.md` 링크
