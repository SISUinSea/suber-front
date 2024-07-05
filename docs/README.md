## commit keywords
| Tag Name | 	Description                       |
| -------- |------------------------------------|
| Feat | 	새로운 기능을 추가                        |
|Fix | 	버그 수정                             |
|Design | 	CSS 등 사용자 UI 디자인 변경               |
|!BREAKING CHANGE | 	커다란 API 변경의 경우                    |
|!HOTFIX | 	급하게 치명적인 버그를 고쳐야하는 경우             |
| Style | 	코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우  |
| Refactor	| 프로덕션 코드 리팩토링 |
| Comment |	필요한 주석 추가 및 변경 |
| Docs |	문서 수정|
|Test	|테스트 코드, 리펙토링 테스트 코드 추가, Production Code(실제로 사용하는 코드) 변경 없음|
|Chore |	빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트, Production Code 변경 없음|
| Rename |	파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우|
|Remove |	파일을 삭제하는 작업만 수행한 경우 |

# [ ] Cloud FireStore Read/Write 권한 보안 규칙 수정할 것!!@!!!!

# 
-[ ] 어떻게 firebase와 통신하는지 알아보기

-[x] 엑서스 토큰 얻기 대작전!
-[x] accessToken, refreshToken을 넘겨받기
-[x] 해당 정보들을 firestore에 저장!
    - [x] 기본적인 firestore 사용법은 기록해놓기!
-[x] idToken을 넘겨주며 call functions
-[x] verifyIdToken 이후 firestore을 통해 accessToken에 접근!
-[x] refreshAccessTokenIfRequried 작성


# FRONT TODO 

## Auth 기능 구현
 - [x] Firebase 초기화, signInWithGoogle 메소드 사용하는 버튼 만들기
 - [x] 구글 로그인 기능 구현
### Start VUEX
 - [x] store 만들기
 - [ ] store refactoring ( 별도의 파일로 관리 )
 #### Auth State 관리
 - [x] vuex로 auth state 관리, auth state에 따라 페이지 자동으로 보여주기
    -[x] 로그인 성공 시 auth state 업데이트


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
    