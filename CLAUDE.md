# 발주서 앱

React + Vite로 만든 건설 자재 발주서 작성/출력 앱.

## 기술 스택

- React 19, Vite 8, Tailwind CSS 4
- PDF 출력: jsPDF + html2canvas
- 엑셀 출력: xlsx
- 빌드/실행: `npm run dev`

## 구조

```
src/
  App.jsx                  # 메인 폼 (상태 관리, 레이아웃)
  components/
    FormInput.jsx          # 공통 입력 컴포넌트
    ItemRow.jsx            # 품목 행 (이름/규격/단위/수량/단가/비고)
    PreviewModal.jsx       # 미리보기 + PDF/엑셀 저장 + 서명
    SmartDateInput.jsx     # 날짜 입력 (자동 포맷)
    OrderNumberInput.jsx   # 발주번호 입력
  utils/
    exportPdf.js           # PDF 출력 로직
    exportExcel.js         # 엑셀 출력 로직
    format.js              # 발주번호 기본값, 날짜 포맷
```

## 주요 데이터 구조

`App.jsx`의 `initialState()`가 폼 전체 상태. 품목은 최대 6개(`MAX_ITEMS`), 미입력 행은 "이하여백"으로 표시.

공장 선택: 보령공장 / 순천공장 / 하동공장

## 작업 규칙

- 컴포넌트 추가 시 `src/components/`에 작성
- 유틸 함수는 `src/utils/`에 분리
- CSS는 Tailwind 클래스 사용 (별도 CSS 파일 최소화)
