# 스탬프 투어

## 실행 방법

### 0. 기본 설정

* **Java 17** 설치
* **MySQL** 설치 및 실행 (포트: 3306, 스키마명: `stamp_tour`)
* `DB_p/db.sql` 실행하여 db 구축
* **VS Code 확장 프로그램 (Extensions) 설치:**
    * `Extension Pack for Java` (Microsoft)
    * `Spring Boot Extension Pack` (VMware)

### 1. 프로젝트 열기 (중요 🌟)
VS Code에서 최상위 폴더가 아닌, 반드시 **`server/backend` 폴더를 직접 열어주세요.** (그래야 VS Code의 Java 확장 프로그램이 프로젝트(build.gradle)를 정상적으로 인식합니다.)

### 2. DB 환경 설정 (비밀번호 세팅)
보안을 위해 DB 설정 파일의 원본은 깃허브에 올라가지 않도록 처리되어 있습니다.
1. VS Code 탐색기에서 `src/main/resources` 폴더로 이동합니다.
2. **`application.template.properties`** 파일을 복사(Copy)하여 같은 위치에 붙여넣기(Paste) 합니다.
3. 복사된 파일의 이름을 **`application.properties`** 로 변경합니다.
4. 새로 만든 `application.properties` 파일을 열고, 3번째 줄에 본인의 로컬 MySQL 비밀번호를 입력하고 저장합니다.
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_DB_PASSWORD  # 👈 수정할 부분

### 3. 패키지 설치

cmd터미널을 열고 아래 명령어들을 실행.

```bash
npm install
npm install react-kakao-maps-sdk
```

### 4. 서버 실행

* 프론트 - `root` 폴더에서 아래 명령어를 실행.

```bash
npm run dev
```

* 백 - 다음 두 가지 방법 중 편한 방법을 선택해서 실행

* 방법 A (UI 사용 - 추천): VS Code 좌측 메뉴(또는 하단 패널)의 Spring Boot Dashboard 탭을 열고, backend (또는 BackendApplication) 옆의 재생(▶️) 버튼을 클릭합니다.

* 방법 B (터미널 사용): VS Code 터미널을 열고 아래 명령어를 입력합니다.
```bash
Windows: .\gradlew bootRun

Mac/Linux: ./gradlew bootRun

서버가 정상적으로 켜지면 터미널에 Tomcat initialized with port(s): 5000 문구가 출력되며 API 서버가 가동됩니다!
```

<br>

### 5. 실시간 카메라 실행 방법

`main.py` 실행 (웹캠 카메라 설정 `test.py`로 카메라번호 확인(0,1,2) 후 실행)

**추가 문의는 윤준희에게**
