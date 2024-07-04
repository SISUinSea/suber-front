# suber-front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# FRONT TODO 

## Auth 기능 구현
 - [x] Firebase 초기화, signInWithGoogle 메소드 사용하는 버튼 만들기
 - [x] 구글 로그인 기능 구현
### Start VUEX
 - [x] store 만들기
 - [ ] store refactoring ( 별도의 파일로 관리 )
 #### Auth State 관리
 - [ ] vuex로 auth state 관리, auth state에 따라 페이지 자동으로 보여주기
    -[ ] 로그인 성공 시 auth state 업데이트


## View 구현
### SignInView
- 사용자가 로그인 기능을 사용하도록 돕는 클래스
### DashBoardView
- 현재 유튜브 통제 진행 상황을 보여주는 클래스
### ReadyView
- 새 jump 전 jump의 목표 설정을 입력할 수 있는 UI를 제공하는 클래스 
### SelectView
- jump가 끝났을 때 시청할 유튜브 영상을 선택하는 UI를 제공하는 클래스
### SearchView
- jump 동안 유튜브 영상을 선택해 재생목록에 담을 수 있는 UI를 제공하는 클래스


# BACK TODO
## Youtube Data Api
-[ ] 통신 성공하기
-[ ] 필요한 api 사용 검증
    -[ ] 구독한 채널을 검색해서 반환하는 api
    -[ ] 구독한 채널의 동영상들을 반환하는 api
    
    -[ ] playlist insert 하는 api
    -[ ] playlist의 동영상들을 검색해서 반환하는 api

## MODEL 구현
### 
    