# CursorPegSolitare

Cursor IDE agent를 이용하여 페그 솔리테어 게임을 구현하는 프로젝트.

## 요구사항 (브레이크다운 중)

- 프로젝트 환경/규칙 정의
  - 구현 환경
    - Vite + React + TypeScript + Zustand를 사용한다.
    - Vite, React, TypeScript, Zustand는 반드시 최신 버전을 사용한다.
    - 모듈은 되도록 TypeScript 파일로 작성한다. 즉, `.ts` 파일과 `.tsx` 파일로 작성한다.
    - CSS Modules를 사용한다. 각 TypeScript 모듈과 같은 폴더에 놓아 TypeScript 모듈이 import할 수 있게끔 한다.
  - 테스트 환경
    - Vitest + React Testing Library를 사용한다.
    - Vitest와 React Testing Library는 반드시 최신 버전을 사용한다.
    - `src/` 내에 있는 각 모듈마다 해당하는 테스트 파일이 있어야 하며, 요구사항에 명시된 스펙을 테스트할 수 있어야 한다.
  - 프로젝트 구조
    - Feature-Sliced Design 구조를 사용한다.
      - [Feature-Sliced Design의 규칙은 이 링크를 참조한다.](https://feature-sliced.design/docs/get-started/overview#concepts)
  - 그 외의 규칙
    - React 컴포넌트는 특별한 이유가 없으면 반드시 function 키워드 함수로 선언한다.
    - IIFE나 React JSX 이벤트 핸들러 함수같이 익명 함수를 사용해야 하는 곳에는 반드시 화살표 함수를 사용한다.
    - Path Aliasing을 사용한다. `src/`로 시작하는 경로는 `^/`로 시작해야 한다.
    - JSX의 속성값 등등에 들어가는 문자열은 큰따옴표로 감싸고, 그 외(주로 JavaScript 부분) 문자열은 작은따옴표로 감싼다.
    - React 커스텀 훅을 만들 때, 훅의 이름은 무조건 `use`로 시작한다.
      - 예: 보드게임의 진행 상황에 관한 커스텀 훅의 이름을 `useGameStatus`로 정한다.
    - 아래는 카멜케이스를 사용한다.
      - 함수 내 지역 변수명
        - boolean 타입을 가지는 변수명은 무조건 `is`로 시작한다.
          - 예: 코메이지 코이시인지 여부를 boolean 타입으로 저장해놓은 변수는 `isKoishiKomeiji`로 명명한다.
      - 원시값을 가지지 않는 const 전역 변수의 이름
      - React 컴포넌트를 제외한 함수명
    - 아래는 파스칼케이스를 사용한다.
      - 사용자 정의 타입
      - React 컴포넌트 이름
      - enum 타입의 멤버 이름
    - 아래는 스크리밍스네이크케이스를 사용한다.
      - 원시값을 가지는 const 전역 변수의 이름 (즉, constant)
      - 환경 변수의 이름
    - 아래는 케밥케이스를 사용한다.
      - 모듈의 파일명
- 페그 솔리테어 게임 구현
  - 게임 룰
    - 다음과 같이, 두 3\*7칸 직사각형을 서로 수직으로 포갠 십자 모양 보드에서, 정중앙만 빈 공간으로 남고 나머지는 모두 구슬로 채워져 있다. (참고로, `#`는 플레이 영역이 아닌 곳, `.`는 빈 공간, `O`는 구슬)
      ```
      ##OOO##
      ##OOO##
      OOOOOOO
      OOO.OOO
      OOOOOOO
      ##OOO##
      ##OOO##
      ```
    - 어떤 구슬 A에 상하좌우로 인접한 다른 구슬이 있고, 그 인접한 구슬을 동일한 방향으로 한 칸 건너뛴 곳이 빈 공간이라면, 구슬 A는 움직일 수 있는 구슬이다.
      - 이해를 돕기 위해 예시로 설명 (가로 0~6과 세로 A~G의 좌표로 위치 설명)

        ```
          | 0123456
        --+--------
        A | ##O.O##
        B | ##.OO##
        C | ..OO.OO
        D | .OOO.O.
        E | OOO.OO.
        F | ##.O.##
        G | ##.OO##
        ```

        - 움직일 수 있는 구슬 예시
          - 4A: 아래에 인접한 구슬 4B가 있으며, 한 칸 뛰어넘은 4C도 빈 공간이기 때문에, 4A는 4C로 움직일 수 있다.
          - 2D: 상하좌우 모두 인접한 구슬(2C, 2E, 1D, 3D)이 있으며, 각각 한 칸 뛰어넘은 곳(2B, 2F, 0D, 4D)이 모두 빈 공간이기 때문에, 2D는 넷(2B, 2F, 0D, 4D) 중 하나를 골라 움직일 수 있다.
          - 5E: 위와 왼쪽에 인접한 구슬(5D, 4E)이 있으며, 그 중 5D를 한 칸 뛰어넘은 5C는 이미 구슬이 있어 움직일 수 없지만, 4E를 한 칸 뛰어넘은 3E는 빈 공간이기 때문에, 5E는 3E로 움직일 수 있다.
          - 1E: 위와 왼쪽과 오른쪽에 인접한 구슬(1D, 0E, 2E)이 있으며, 그 중 0E를 한 칸 뛰어넘은 곳은 좌표 밖이라 움직일 수 없지만, 1D와 2E를 각각 한 칸 뛰어넘은 1C와 3E는 빈 공간이기 때문에, 1E는 1D와 2E 중 하나를 골라 움직일 수 있다.
          - 3G: 위와 오른쪽에 인접한 구슬(3F, 4G)이 있으며, 그 중 4G를 한 칸 뛰어넘은 5G는 플레이 영역이 아니라 움직일 수 없지만, 3F를 한 칸 뛰어넘은 3E는 빈 공간이기 때문에, 3G는 3E로 움직일 수 있다.
        - 움직일 수 없는 구슬 예시
          - 5C: 아래와 오른쪽에 인접한 구슬(5D, 6C)이 있지만, 그 중 5D를 한 칸 뛰어넘은 5E는 이미 구슬이 있어 움직일 수 없고, 6C를 뛰어넘은 곳도 좌표 밖이라 움직일 수 없어, 5C는 움직일 수 없다.
          - 3A: 상하좌우 어느 곳으로도 인접한 구슬이 없어, 3A는 움직일 수 없다.
          - 0E: 오른쪽에 인접한 구슬 1E가 있지만, 1E를 한 칸 뛰어넘은 2E는 이미 구슬이 있어 움직일 수 없기에, 0E는 움직일 수 없다.
          - 1D: 아래와 오른쪽에 인접한 구슬(1E, 2D)이 있지만, 그 중 1E를 한 칸 뛰어넘은 1F는 플레이 영역이 아니라 움직일 수 없고, 2D를 한 칸 뛰어넘은 3D도 이미 구슬이 있어 움직일 수 없기에, 1D는 움직일 수 없다.

    - 어떤 구슬을 골라 상하좌우로 인접한 다른 한 구슬을 뛰어넘어 빈 공간으로 옮겼을 때, 그 뛰어넘은 구슬은 제거하여 빈 공간으로 만든다.
      - 이해를 돕기 위해 예시로 설명 (가로 0~8과 세로 A~I의 좌표로 위치 설명)
        - 2D에 인접한 구슬 중 2E를 뛰어넘어 이동하면, 2D에 있던 구슬은 2F로 이동하고, 2E에 있던 구슬은 제거되어 빈 공간으로 변한다.

          ```
          이동 전
            | 0123456
          --+--------
          A | ##O.O##
          B | ##.OO##
          C | ..OO.OO
          D | .OOO.O.
          E | OOO.OO.
          F | ##.O.##
          G | ##.OO##

          이동 후
            | 0123456
          --+--------
          A | ##O.O##
          B | ##.OO##
          C | ..OO.OO
          D | .O.O.O.
          E | OO..OO.
          F | ##OO.##
          G | ##.OO##
          ```

    - 움직일 수 있는 구슬이 없을 때까지 게임을 진행한다. 움직일 수 있는 구슬이 없으면 조건에 따라 결과를 도출한다.
      - 남은 구슬이 1개이고, 그 하나의 구슬이 보드 정중앙에 있는 경우: `MAVERICK END`
      - 남은 구슬이 1개이지만, 그 하나의 구슬이 보드 정중앙에 있진 않은 경우: `KOISHI END`
      - 그 외의 경우: `YASUO END`

- 모듈 정의
  - 앱 상태 정의
    - Zustand의 store를 활용하여 구현하도록 한다.
    - 반드시 포함되어야 하는 스토어의 상태는 다음과 같다.
      - `board`: Enumuration `BoardState`의 7행 7열 배열. 보드의 각 칸이 어떠한지를 담는다.
        - 이 때, Enumuration `BoardState`는 다음과 같다.
          - `NOT_APPLICABLE`(= `-1`): 플레이 영역이 아님
          - `EMPTY`(= `0`): 빈 공간 (즉, 구슬이 없음)
          - `BALL`(= `1`): 구슬이 있는 곳
        - 초기 상태는 다음 모습과 같다. (참고로, `#`는 플레이 영역이 아닌 곳, `.`는 빈 공간, `O`는 구슬)
          ```
          ##OOO##
          ##OOO##
          OOOOOOO
          OOO.OOO
          OOOOOOO
          ##OOO##
          ##OOO##
          ```
      - `history`: `{ orig: Coords; dest: Coords }`의 배열. 게임 중 어디서 어디로 구슬을 옮겼는지를 담는다. 이는 실행 취소 등등에 활용된다.
        - 이 때, `Coords`는 `{ row: number; col: number }`이다.
        - 초기 상태는 빈 배열이다. 즉, `[]`이다.
      - `undoCount`: 후술할 `move`가 호출되기 전, 후술할 `undo`를 마지막으로 호출한 횟수. `number`이다.
        - 초기 상태는 `0`이다.
      - `selected`: `Coords`이며, 선택된 구슬의 위치를 나타낸다.
        - 초기 상태는 `{ row: -1000, col: -1000 }`이다.
    - 반드시 포함되어야 하는 스토어의 액션은 다음과 같다.
      - `move(orig: Coords, dest: Coords): void`
        - `orig`로 명시된 좌표에서 `dest`로 명시된 좌표로 이동시키는 함수.
        - 반드시 다음 조건을 만족시킬 때 이동시켜야 한다.
          - `orig`와 `dest` 모두 좌표 범위 내에 있어야 한다.
          - `orig.row === dest.row && (orig.col === dest.col - 2 || orig.col === dest.col + 2)` 또는 `orig.col === dest.col && (orig.row === dest.row - 2 || orig.row === dest.row + 2)`
          - `orig`와 `dest` 사이의 그 한 칸에는 반드시 구슬이 있어야 한다.
        - 구슬이 성공적으로 이동했을 경우 다음과 같은 작업을 한다.
          - `dest`에 해당하는 좌표는 빈 공간으로 전환시킨다.
          - `history[history.length - undoCount - 1]` 바로 뒷부분에 이 움직임에 대해 기록한다.
          - `undoCount`를 `0`으로 초기화한다.
          - `selected`를 `{ row: -1000, col: -1000 }`으로 초기화한다.
      - `undo(): void`
        - `history`를 기반으로 구슬의 움직임을 되돌리는 함수.
        - `history`의 `length`가 `0`이라면 (즉, `history`가 비어있다면) 실행 취소를 하지 않아도 된다.
        - `history.length - undoCount - 1`가 `-1`인 경우에도 실행 취소를 하지 않아도 된다.
        - `history[history.length - undoCount - 1]`에 있는 엘리먼트를 바탕으로, `dest`에 있었던 구슬을 `orig`로 다시 되돌아가게 하고, `orig`와 `dest` 사이의 그 한 칸에는 구슬을 다시 되돌려놓는다.
        - 성공적으로 되돌렸다면 다음과 같은 작업을 한다.
          - `undoCount`를 `1` 증가시킨다.
          - `selected`를 `{ row: -1000, col: -1000 }`으로 초기화한다.
        - 후술할 `redo` 함수도 `history`를 활용해야 하기 때문에, `undo`를 했다고 해서 바로 `history`를 `pop`해서는 안 된다.
      - `redo(): void`
        - `history`를 기반으로 구슬의 움직임을 다시 실행하는 함수.
        - `undoCount`가 `0`이라면 (즉, 이미 최신 상태라면) 다시 실행을 하지 않아도 된다.
        - `history[history.length - undoCount]`에 있는 엘리먼트를 바탕으로, `orig`에 있었던 구슬을 `dest`로 다시 되돌아가게 하고, `orig`와 `dest` 사이의 그 한 칸에는 빈 공간으로 다시 만든다.
        - 성공적으로 재실행했다면 다음과 같은 작업을 한다.
          - `undoCount`를 `1` 감소시킨다.
          - `selected`를 `{ row: -1000, col: -1000 }`으로 초기화한다.
      - `reset(): void`
        - 게임을 다시 시작할 목적으로 게임의 모든 상태를 초기화시키는 함수.
        - 모든 상태를 초기 상태로 되돌려놓는다.
  - 전반적인 앱 렌더링 정의
    - `1rem`이 `16px`가 되도록 한다.
    - 모든 엘리먼트의 스타일은 다음과 같다.
      - `box-sizing: border-box`
      - `margin: 0`
    - `body`의 스타일은 다음과 같다.
      - `background-color: white`
      - `color: black`
      - `width: 100vw`
      - `height: 100dvh`
      - `display: flex`
      - `justify-content: center`
      - `align-items: center`
    - `main`은 `body`의 직속 자식 엘리먼트이며, 아래 특성을 가지고 있다.
      - 스타일링
        - `100vw`와 `100dvh` 중 더 낮은 값을 한 변의 길이로 가지는 정사각형이다.
        - `display: flex`
        - `flex-direction: column`
        - `justify-content: center`
        - `align-items: center`
      - 하위 엘리먼트
        - 어떤 컴포넌트가 들어가는가? (컴포넌트의 특징은 "컴포넌트 정의"에서 기술한다)
          - 타이틀
          - 보드
          - 하단 컨트롤 패널
        - 하위 엘리먼트끼리의 간격은 `1rem`으로 한다.
  - 컴포넌트 요구사항
    - 타이틀
      - `h1` 엘리먼트이다.
      - `CursorPegSolitare`라는 Text Content를 가진다.
      - `font-weight: 700`이다.
      - 스크린이 640px 미만일 경우 폰트 사이즈는 `1rem`, 그 이상일 경우 `1.5rem`이어야 한다.
    - 보드
      - `div` 엘리먼트이다.
      - 다음과 같은 스타일을 가진다.
        - `width: 75%`
        - `height: 75%`
        - `display: grid`
        - `grid-template-rows: repeat(7, 1fr)`
        - `grid-template-columns: repeat(7, 1fr)`
      - 총 49개의 타일 버튼을 가진다. (타일 버튼의 특징은 "타일 버튼"에서 기술한다)
    - 하단 컨트롤 패널
      - `div` 엘리먼트이다.
      - 다음과 같은 스타일을 가진다.
        - `display: flex`
        - `flex-direction: row`
        - `justify-content: center`
        - `align-items: center`
        - `gap: 0.5rem`
        - `border-radius: 0.5rem`
      - 다음 엘리먼트를 가진다.
        - 실행 취소 UI 버튼
          - 스토어의 `undo`를 실행한다.
          - 스토어의 액션에서 상술한 `undo`를 실행하지 않는 조건에서는 비활성화한다.
        - 다시 실행 UI 버튼
          - 스토어의 `redo`를 실행한다.
          - 스토어의 액션에서 상술한 `redo`를 실행하지 않는 조건에서는 비활성화한다.
        - 리셋 UI 버튼
          - 스토어의 `reset`을 실행한다.
    - UI 버튼
      - `button` 엘리먼트이다.
      - 다음과 같은 스타일을 가진다.
        - 우선 `all: unset`으로 모든 기존 속성을 초기화한다.
        - `color: white`
        - `font-size: 1rem`
        - `padding: 0.5rem 0.75rem`
        - `background-color: #006814`
        - hover 시 `background-color: #39fd72`
        - `cursor: pointer`
        - disalbled 됐을 경우 `background-color: #7e7e7e`
    - 타일 버튼
      - 공통
        - `button` 엘리먼트이다.
        - 다음과 같은 스타일을 가진다.
          - 우선 `all: unset`으로 모든 기존 속성을 초기화한다.
          - `width: 100%`
          - `height: 100%`
        - 좌표상의 행을 의미하는 `row`와 좌표상의 열을 의미하는 `col`을 Props로 받아들인다.
        - 스토어로부터 `board[row][col]`를 받아와, 보드의 해당 칸의 상태를 가져온다.
        - 스토어로부터 `selected`를 받아와, 선택한 타일의 위치를 확인한다.
      - `NOT_APPLICABLE` 상태
        - `disalbled`이다.
        - 다음과 같은 스타일을 가진다.
          - `background-color: white`
      - `EMPTY` 상태
        - Text Content가 비어있고, 자식 엘리먼트가 없다.
        - 다음과 같은 스타일을 가진다.
          - `background-color: #006814`
          - hover 시 `background-color: #39fd72`
          - `cursor: pointer`
          - `BALL`인 어떤 타일이 선택되었을 때, 선택된 구슬이 이동 가능한 곳이라면, `background-color: #39e6fd`
        - `BALL`인 어떤 타일이 선택되었을 때, 선택된 구슬이 이동 가능한 곳에 해당할 때 클릭하면 스토어의 `move(selected, { row, col })`를 호출한다.
      - `BALL` 상태
        - 노랑 동그라미를 자식 엘리먼트로 가진다.
        - 다음과 같은 스타일을 가진다.
          - `background-color: #006814`
          - hover 시 `background-color: #39fd72`
          - `cursor: pointer`
          - 선택되었을 때, `background-color: #fafd39`
        - 클릭 시 해당 타일이 선택된다.
    - 게임 오버 오버레이
      - `section` 엘리먼트이다.
      - 더 이상 움직일 수 있는 구슬이 없을 때 등장한다. 그 외의 경우 사라져 있는다.
      - 다음과 같은 스타일을 가진다.
        - `position: fixed`
        - `left: 0`
        - `top: 0`
        - `width: 100vw`
        - `height: 100dvh`
        - `display: flex`
        - `flex-direction: column`
        - `justify-content: center`
        - `align-items: center`
        - `color: white`
        - `pointer-events: none`
        - 검은 반투명 배경
        - 2초 뒤 1초동안 페이드 아웃으로 투명화된다.
      - Text Content는 아래와 같다.
        - 남은 구슬이 1개이고, 그 하나의 구슬이 보드 정중앙에 있는 경우: `MAVERICK END!!!`
        - 남은 구슬이 1개이지만, 그 하나의 구슬이 보드 정중앙에 있진 않은 경우: `KOISHI END!`
        - 그 외의 경우: `YASUO END...`

## 1차 피드백

- 지금 React 최신 버전은 `19.2.3`이야. 이에 맞게 패키지를 업그레이드 해줘. 그리고, 이에 영향을 받는 다른 패키지도 업그레이드를 해주면 좋겠어.
- 지금 Zustand 최신 버전은 `5.0.10`이야. 이에 맞게 패키지를 업그레이드 해줘. 그리고, 이에 영향을 받는 다른 패키지도 업그레이드를 해주면 좋겠어.
- 지금 Vite 최신 버전은 `7.3.1`이야. 이에 맞게 패키지를 업그레이드 해줘. 그리고, 이에 영향을 받는 다른 패키지도 업그레이드를 해주면 좋겠어.
- `main`의 스타일링에는 `.main`이라는 클래스가 아닌 그냥 `main`이라는 태그를 선택해도 돼.
- `src/entities/game-store.ts`는 Entity 레이어에 해당돼서, 동일한 슬라이스 내 또는 그 아래 레이어의 모듈만 import할 수 있어. `src/features/game-logic/is-valid-move.ts`를 import할 수 밖에 없다면 이걸 Shared 레이어의 유틸리티 쪽으로 내려봐.
- import했지만 쓰이지 않은 모듈, 선언되었지만 사용되지 않은 변수나 함수 등등은 제거해줬으면 좋겠어.
- 게임 오버 오버레이 텍스트의 크기가 `4rem`, 굵기가 `700`이었으면 좋겠어.
- `if-else`문보단 `switch-case`문을 사용해줬으면 하는 곳이 있어.
  - `src/widgets/game-over-overlay.tsx`의 37~44번째 줄은, `text`는 `let` 키워드로 선언하지 않으면서, `gameResult`의 값에 대한 여러 분기는 `switch-case`문을 사용하도록 해줘.
    - 예를 들면, 아래 TypeScript 유사 코드와 같이.
      ```typescript
      const text = (() => {
        switch (gameResult) {
          case ...:
            ...;
        }
      }){};
      ```
  - `src/widgets/tile-button.tsx`에서 `boardState`의 값에 대한 분기 역시, `switch-case`문을 사용하도록 해줘.
  - 이외에도 이런 식으로, `boolean` 타입을 제외한 원시값 변수 하나에 대한 여러 분기를 나누고자 한다면, `if-else`보단 `switch-case`문을 사용했으면 좋겠어.
- 내가 잘못 결정한 색이 있어.
  - 선택된 타일의 `background-color`를 ` #fafd39`가 아닌 `rgb(253, 57, 237)`로 바꿔줘.
- 테스트가 실패하고 있어 아래를 확인하고 다시 시도해볼래?
  - `src/entities/game-store/game-store.test.ts:80:25`
    - 분명 `move` -> `undo` -> `move`를 했는데, `undoCount`가 `0`이 아닌 `1`이라고 되어 있어.
  - `src/entities/game-store/game-store.test.ts:153:24`
    - `boardAfterMove`가 `move` 이전의 `board`를 기반으로 하고 있던데, 이 `board`를 `move` 이후의 `useGameStore.getState()`에서 받아와볼래? 다름이 아니라, 배열을 받은 이후에 갱신이 이루어졌다 하더라도, 스토어는 변경된 기존 배열이 아닌 아예 새로운 배열을 가진 거라, `board`의 배열 주소값은 갱신 이전 그대로거든.

## 그러나...

- 현재 시점(`2026년 1월 28일`)에 1차 피드백을 주려고 했더니, 사용량 제한을 초과했다며 Cursor Pro를 결제하라고 한다.
- 그러나 지금 여러 개인 사정으로 인해 결제할 돈이 없으니, 당분간은 직접 코딩하여 바꿀 수 밖에 없다. CS 기초지식 복습과 문제 정의 및 해결 능력 향상에 집중하자.

## 직접 보정할 것들

- ~~패키지 업그레이드~~ (완료)
  - ~~React `19.2.3`~~ (완료)
  - ~~Vite `7.3.1`~~ (완료)
  - ~~Zustand `5.0.10`~~ (완료)
  - `npx npm-check-updates -u` 후 `npm install`을 사용하여 해결.
- ~~`main` 엘리먼트 스타일링에 `.main`이라는 클래스가 아닌 그냥 `main`이라는 태그를 선택~~ (완료)
- ~~게임 오버 오버레이 텍스트~~ (완료)
  - ~~크기 `4rem`~~ (완료)
  - ~~굵기 `700`~~ (완료)
- ~~`if-else`문보단 `switch-case`문을 사용~~ (완료)
  - ~~`src/widgets/game-over-overlay.tsx`의 37~44번째 줄~~ (완료)
  - ~~`src/widgets/tile-button.tsx`의 `boardState`의 값에 대한 모든 분기~~ (완료)
- ~~선택된 타일의 `background-color`를 ` #fafd39`가 아닌 `#fd39ed`로~~ (완료)
- ~~테스트 실패 현상 해결하기~~ (완료)
  - ~~`src/entities/game-store/game-store.test.ts:80:25`~~ (완료)
    - 두번째 `move`에서, 초기 상태로 돌아온 `board`에 대해, 움직일 수 없는 구슬인 3행 4열 구슬을 옮기는 코드를 썼나 봄.
    - 즉, AI가 테스트할 요소를 잘못 썼다는 이야기.
    - 그래서, 3행 4열 구슬이 아닌, 3행 5열 구슬을 3행 3열 구슬로 옮기는 것으로 테스트하여 해결.
  - ~~`src/entities/game-store/game-store.test.ts:153:24`~~ (완료)
    - `boardAfterMove`가 `move` 이전의 `board`를 기반으로 하고 있음.
    - 이렇게 될 경우, 배열을 받은 이후엔, 액션으로 인해 갱신이 이루어졌다 하더라도, 스토어는 변경된 기존 배열이 아닌 아예 새로운 배열을 가진 거라, `board`의 배열 주소값은 갱신 이전 그대로이기 때문에 `board`의 내용에 변함이 없다.
    - 그래서, `boardAfterMove`가 `move` 이후의 `board`를 기반으로 하도록 변경하여 해결.
- ~~사용하지 않은 import 또는 변수/함수 선언 지우기~~ (완료)
- ~~import할 레이어 순서가 역전되었거나 동일 레이어 내 다른 슬라이스를 import한 부분 조정하기~~ (완료)
- ~~`undo`와 `redo`가 제대로 작동하지 않음. 연관된 멤버 함수 또는 컴포넌트 확인 후 해결.~~ (완료)
  - `move`를 완료했을 때 `history`를 `history.length - undoCount`부터는 모두 덮어씌워져야 했는데, 그 덮어씌워지고 없어져야 했을 부분이 계속 이어져 남아있었음.
