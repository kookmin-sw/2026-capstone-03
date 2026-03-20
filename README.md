# 스탬프 투어

## 실행 방법

### 1️. 사이트 실행

필요한 패키지들을 설치하고, `server` 폴더에 `.env` 파일을 추가.

**1. 패키지 설치**

터미널을 열고 아래 명령어들을 실행.

```bash
npm install
npm install react-kakao-maps-sdk
npm install axios
```

**2. 환경 변수 (.env) 설정**

`server` 폴더 안에 `.env` 파일을 생성하고 아래 양식에 맞게 내용 작성

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=본인의_로컬_DB_비밀번호_입력
DB_NAME=stamp_tour
```

**3. 서버 실행**

`server` 폴더와 `root` 폴더 두 곳에서 각각 아래 명령어를 실행.

```bash
npm run dev
```

<br>

### 2. 실시간 카메라 실행 방법

`main.py` 실행 (웹캠 카메라 설정 `test.py`로 카메라번호 확인(0,1,2) 후 실행)

**추가 문의는 윤준희에게**
