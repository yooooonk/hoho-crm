# 고객관리 (환자관리)

## 개요

`/customers` 페이지에서 고객 목록 조회/검색, 고객 기본 정보 등록·수정·삭제, 고객별 상담내역을 한 화면에서 확인한다. 좌측 목록 + 우측 상세 2단 레이아웃이며, 한약국 접수 카드에 가깝게 필드를 최소화했다. 상세 패널은 평소엔 보기 전용이고 "수정" 버튼을 눌러야 입력 가능한 보기/수정 모드 방식이다.

## 범위

- 포함:
  - 고객 목록 검색(성명/연락처/생년월일), 목록에서 고객 선택
  - 고객 등록/수정/삭제 (Server Actions)
  - 고객 상세 패널: 보기/수정 모드 전환, 필드 단위 인라인 에러 표시
  - 상담내역(과거 Consultation 기록 목록, 조회 전용)
- 포함 안 함 (Non-goals):
  - 고객 등급/그룹 분류, 담당자 배정, 사용자 정의 항목 — 필요성이 불명확해 제외 (재도입 시 활동 이력 기반 자동 분류를 우선 검토)
  - 예약/판매/쿠폰/포인트/메시지 요약 — 각 기능이 실제로 만들어질 때 해당 도메인 페이지에서 다룬다
  - 상담 등록/수정 UI (상담내역은 현재 조회 전용, 등록은 추후 상담 기능에서 구현)

## 데이터 모델

- 모델: `Customer`
  - `name` — 성명
  - `gender` (String?, 자유 텍스트) — 성별. 폼에서는 남/여 라디오 버튼 + "기타" 라디오 선택 시 옆의 텍스트박스에 직접 입력 (저장 시 하나의 문자열로 합쳐짐)
  - `phone` (unique) — 연락처
  - `birthDate` (DateTime?) — 생년월일
  - `address` (String?) — 주소
  - `constitutionTag` (String?) — 체질
  - `memo` (String?) — 메모
  - `createdAt` — 등록일로 표시 (별도 입력 필드 아님, 상세 패널에 항상 읽기 전용으로 노출)
- 마이그레이션:
  - `add-customer-crm-fields` → `simplify-customer-profile-fields`(고객그룹/고객등급/담당자/사용자항목1·2 제거, `gender` 추가)

## 서버 로직

- Server Actions: `src/features/customers/actions.ts`
  - `createCustomer(prevState, formData)`: 신규 고객 생성 후 `/customers?id=<생성된 id>`로 이동
  - `updateCustomer(prevState, formData)`: 기존 고객 정보 수정 후 동일 고객 상세로 이동
  - `deleteCustomer(formData)`: 고객 삭제(연관된 상담/예약/결제도 cascade 삭제) 후 `/customers`로 이동
  - `createCustomer`/`updateCustomer`는 `useActionState`와 함께 쓰도록 `(prevState, formData) => CustomerFormState`형태다. 유효성 검증 실패는 `throw` 하지 않고 상태 객체를 반환한다 (아래 "에러/예외 처리" 참고).
- 타입: `src/features/customers/types.ts` — `CustomerFormState`(`error`, `field`, `values`)와 `initialCustomerFormState`. `"use server"` 파일은 async 함수만 export할 수 있어서 상수/타입은 별도 파일로 분리했다.
- Queries: `src/features/customers/queries.ts`
  - `getCustomers(search?)`: 전체 고객을 최근 등록순으로 조회 후, 검색어가 있으면 메모리에서 필터링한다. 성명/연락처는 부분 일치, 생년월일은 구분자(`-`, `.`)를 무시하고 숫자만 비교해서 부분 일치시킨다 (Prisma로 DateTime 컬럼에 `contains`를 직접 걸 수 없어서 이렇게 처리). 목록의 "최종방문일" 컬럼을 위해 가장 최근 상담(Consultation) 1건도 함께 조회한다.
  - `getCustomerDetail(id)`: 고객 상세 + 상담내역(Consultation) 포함 조회

## 화면/UI

- 라우트: `src/app/customers/page.tsx` (`?q=` 검색어, `?id=` 선택 고객, `?new=1` 신규 등록 모드를 쿼리 파라미터로 관리)
- 주요 컴포넌트: `src/features/customers/components/`
  - `customer-list-panel.tsx`: 검색폼 + 고객 목록 테이블 (#, 성명, 성별, 생년월일, 연락처, 최종방문일 — 전부 가운데 정렬). 행 클릭으로 상세 선택. 별도 "관리" 컬럼은 없고 삭제는 상세 패널에서만 가능. 우측 상단 "고객등록" 버튼(글자 버튼)으로 신규 등록 모드 진입.
  - `customer-detail-panel.tsx`: 보기/수정 모드가 있는 고객 정보 패널.
    - 보기 모드: 모든 항목이 읽기 전용 텍스트(`text-base font-medium`)로 표시. 버튼은 "수정"·"삭제"(둘 다 글자 버튼).
    - 수정 모드: 성명/성별/연락처/생년월일/주소/체질/메모가 입력 필드로 바뀐다. 등록일은 항상 읽기 전용. 버튼은 "저장"(기존 고객) 또는 "등록"(신규 고객).
    - 신규 고객 등록 화면(`customer === null`)은 처음부터 수정 모드로 시작.
    - 고객을 전환하면 `key={customer.id}`로 `CustomerDetailPanel` 자체가 리마운트되어 상태가 깨끗하게 초기화된다 (부모: `src/app/customers/page.tsx`).
    - 검증 실패로 폼이 다시 그려질 때, React가 `<form action>`의 미제어(uncontrolled) 입력값을 자동으로 초기화해버리는 문제가 있어 — 제출이 끝날 때마다(`pending` true→false 전환) `resetToken`을 올려 입력 필드 그룹을 리마운트하고, 서버가 돌려준 `state.values`(방금 제출했던 원본 문자열)를 `defaultValue`로 다시 채워 넣는 방식으로 우회했다.
  - `birth-date-input.tsx`: 생년월일 입력 — 숫자만 이어 입력하면(`19920512`) 자동으로 `1992-05-12` 형태로 하이픈이 붙는 클라이언트 컴포넌트 (네이티브 `<input type="date">`의 연/월/일 분리 입력 UX 대신 사용)
  - `consultation-history.tsx`: 상담내역을 방문일 역순으로 보여주는 목록 (조회 전용)
  - `delete-customer-button.tsx`: 삭제 확인 다이얼로그를 띄우는 클라이언트 컴포넌트. `children`을 넘기면 그 내용을(예: "삭제" 글자) 아이콘 대신 렌더링한다.
- 날짜 표시 포맷: `src/lib/format.ts`의 `formatDate`가 `YYYY.MM.DD`(점 구분) 형식으로 통일해서 보여준다. 생년월일 입력 필드 자체의 내부 값(`YYYY-MM-DD`, 서버 검증용)과는 별개다.

## 에러/예외 처리

입력값 검증 오류(성명/연락처/생년월일)는 서버 액션에서 `throw` 하지 않고 `{ error, field, values }` 상태를 반환한다. `customer-detail-panel.tsx`가 `useActionState`로 이 상태를 받아 해당 입력 필드 바로 아래에 인라인으로 표시한다 — Next.js 에러 오버레이(크래시 화면)로 튀지 않고, 사용자가 입력하던 나머지 값도 그대로 유지된다.

- 성명이 비어있음 → "성명을 입력해주세요." (성명 필드 아래 표시)
- 연락처가 비어있음 → "연락처를 입력해주세요." (연락처 필드 아래 표시)
- 이미 등록된 연락처로 저장 시도(Customer.phone unique 제약 위반) → "이미 등록된 연락처입니다." (연락처 필드 아래 표시)
- 생년월일이 8자리(YYYYMMDD) 형식이 아니거나 실제로 존재하지 않는 날짜 → "생년월일을 8자리 숫자로 입력해주세요." / "생년월일이 올바르지 않습니다." (생년월일 필드 아래 표시)
- 삭제 대상을 찾지 못함(id 누락) → "고객 정보를 찾을 수 없습니다." (정상 UI 흐름에서는 발생할 수 없는 상태라 그대로 throw)

## 확인한 시나리오

- [x] 고객 목록에서 검색어(성명/연락처/생년월일, 구분자 유무 무관)로 필터링
- [x] 신규 고객 등록 후 자동으로 해당 고객 상세로 이동, 등록 완료 시 보기 모드로 표시
- [x] 기존 고객 정보 수정 저장 후 보기 모드로 복귀
- [x] 고객 목록에서 다른 고객으로 전환 시 상세 패널이 이전 고객 값에 머무르지 않고 올바르게 갱신됨
- [x] 생년월일을 잘못된 형식으로 저장 시도 시 에러 오버레이 없이 생년월일 필드 아래에 인라인 에러만 표시되고, 다른 필드에 입력했던 값(메모 포함)도 그대로 유지됨
- [x] 고객 삭제 시 확인창 후 삭제, 연관 예약/상담/결제도 함께 삭제됨
- [x] 중복 연락처로 등록/수정 시 에러 메시지 노출
- [x] 상담내역이 없는 고객은 "상담 이력이 없습니다." 안내 표시
- [x] 목록의 최종방문일이 상담 이력이 있으면 최근 상담일, 없으면 등록일을 보여줌

## 관련 문서/이슈

- 없음
