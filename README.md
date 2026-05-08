# 스탬프 투어

## 실행 방법

### 0. 기본 설정

* **Java 17** 설치
* **MySQL** 설치 및 실행 (포트: 3306, 스키마명: `stamp_tour`)
* `DB_p/db.sql` 실행하여 db 구축
* **VS Code 필수 확장 프로그램 (Extensions) 설치:**
    * `Extension Pack for Java` (Microsoft)
    * `Spring Boot Extension Pack` (VMware)

### 1. 프론트엔드 (Frontend) 설정 및 실행

1. 터미널을 열고 프로젝트 최상위 폴더(`root`)에서 **`Frontend` 폴더로 이동**한 후, 아래 명령어를 실행하여 패키지를 설치합니다.

   ```bash
   cd Frontend
   npm install

```
   *(참고: `react-kakao-maps-sdk` 등 필요한 패키지는 `package.json`에 명시되어 있어 `npm install` 한 번으로 모두 설치됩니다.)*

2. 아래 명령어를 실행하여 프론트엔드 서버를 구동합니다.

   ```bash
   npm run dev
   
```

### 2. 백엔드 (Backend) 설정 및 실행 (중요 🌟)

**① 백엔드 전용으로 폴더 열기**
IDE(VS Code 또는 IntelliJ) 상단 메뉴에서 `파일(File) > 폴더 열기(Open Folder)`를 클릭한 후, 최상위 폴더가 아닌 반드시 **`capstone/server/backend` 폴더를 직접 선택해서 열어주세요.** *(주의: 최상위 폴더를 열면 Spring Boot 확장 프로그램이나 Gradle이 프로젝트를 정상적으로 인식하지 못합니다.)*

**② DB 환경 설정 (비밀번호 세팅)**
보안을 위해 DB 설정 파일의 원본은 깃허브에 올라가지 않습니다. 아래 순서대로 로컬 DB를 연결해 주세요.

1. 좌측 탐색기에서 `src/main/resources` 폴더로 이동합니다.
2. **`application.template.properties`** 파일을 복사(Copy)하여 같은 위치에 붙여넣기(Paste) 합니다.
3. 복사된 파일의 이름을 **`application.properties`** 로 변경합니다.
4. 새로 만든 `application.properties` 파일을 열고, 3번째 줄에 본인의 로컬 MySQL 비밀번호를 입력하고 저장합니다.

   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_DB_PASSWORD  # 👈 본인의 로컬 DB 비밀번호로 수정

```

**③ 백엔드 서버 실행**

* **방법 A (UI 사용 - 🌟 추천):** 
  * **VS Code:** 좌측 액티비티 바에서 잎사귀 모양의 **Spring Boot Dashboard**를 클릭 후, `backend` 우측의 **재생(Play) 버튼**을 누릅니다.
  * **IntelliJ:** 우측 `Gradle` 탭에서 동기화(새로고침)를 한 번 진행한 뒤, `BackendApplication.java` 파일의 `main` 메서드 옆 **재생 버튼**을 누릅니다.

* **방법 B (터미널 사용):** 터미널을 열고 백엔드 폴더 위치에서 아래 명령어를 입력합니다.

   ```bash
   # Windows
   .\gradlew bootRun

   # Mac/Linux
   ./gradlew bootRun
   
```

서버가 정상적으로 켜지면 터미널에 `Tomcat initialized with port(s): 5000` 문구가 출력되며 API 서버가 가동됩니다!

### 3. 실시간 카메라 실행 방법

`main.py` 실행 (웹캠 카메라 설정 `test.py`로 카메라번호 확인(0,1,2) 후 실행)

**추가 문의는 윤준희에게**