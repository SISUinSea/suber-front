## commit keywords
| Tag Name | 	Description                       |
| -------- |------------------------------------|
| Feat | 	새로운 기능을 추가                        |
| Fix | 	버그 수정                             |
| Design | 	CSS 등 사용자 UI 디자인 변경               |
|!BREAKING CHANGE | 	커다란 API 변경의 경우                    |
|!HOTFIX | 	급하게 치명적인 버그를 고쳐야하는 경우             |
| Style | 	코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우  |
| Refactor	| 프로덕션 코드 리팩토링 |
| Comment |	필요한 주석 추가 및 변경 |
| Docs |	문서 수정|
| Test	| 테스트 코드, 리펙토링 테스트 코드 추가, Production Code(실제로 사용하는 코드) 변경 없음|
| Chore |	빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트, Production Code 변경 없음|
| Rename |	파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우|
| Remove |	파일을 삭제하는 작업만 수행한 경우 |

# [ ] Cloud FireStore Read/Write 권한 보안 규칙 수정할 것!!@!!!!

# 구현 순서
- [x] ReadyView
    - [x] dive 기간 설정할 수 있는 UI 설계
    - [x] 한 dive를 만들수 있는 로직 설계
- [ ] SearchView :
    - [x] 구독 목록 받기
    - [x] 유저가 요청할 때 추가적인 구독 목록을 받는 기능 구현

    - [x] 특정 채널의 영상 받는 기능 구현
    - [x] 유저가 요청할 때 특정 채널의 영상을 얻어오는 기능 구현
    - [ ] 유저가 요청할 때 특정 채널의 추가적인 영상을 얻어오는 기능 구현

    - [x] 영상을 firestore videos/에 저장하는 기능 구현
    - [x] 영상을 클릭했을 때 videos/에 저장하는 기능 구현

- [ ] CartView:
    - 유저가 저장한 영상들을 확인하는 ui
    - [ ] 영상을 불러오기
    - [ ] 영상의 삽입, 삭제 기능 추가

- [ ] DashBoardView
    - [ ] 유저에게 어떤 정보를 제공할 것인가?
        - 설정한 기한으로부터 얼마나 남았는지, 진행상황, 
        - 내가 선택한 영상을 볼 수 있도록 하기
        - // 같은 기한을 설정한 사람들의 진행 상황도
        - 얼마나 빈번하게 들어오고 있는지, 얼마나 사용하고 있는지?
- [ ] SelectView
    - 실제로 youtube playlist 만들기
    - 총 영상 길이와 설정한 시간을 비교해서 얼마나 초과하였는지


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
### ReadyView 기능 명세
- [x] 사용자가 날짜와 시간을 선택할 수 있어야 함.
- [x] 사용자가 선택한 날짜와 시간을 이용해서 다음과 같은 string을 만듦 : "나는 (사용자가 선택한 날짜) (사용자가 선택한 시간) 까지 쾌락을 위한 유튜브 영상을 시청하지 않겠습니다."
- [x] 사용자의 입력을 받는 string과 비교해서 두 string이 같은지 피드백. 즉 사용자는 설정한 문장과 같은 문장을 따라치도록 유도당해야 함.
- [x] 두 string이 같을 때 button을 활성화. 해당 버튼은 firestore에 새로운 dives collection에 문서(doc)를 만듦.
- [x] 사용자가 날짜와 시간을 선택하는 요소와 string을 작성하는 요소는 서로 순서대로 나타나야 함.
- [x] string을 작성하는 요소에서 날짜와 시간을 선택하는 요소로 접근해 날짜와 시간을 재설정할 수 있어야 함.

### SearchView
- dive 동안 유튜브 영상을 선택해 저장할 수 있는 UI를 제공하는 클래스
- [ ] 구독한 유튜브 채널을 정사각형 형태 안에 채널 썸네일을 원형으로 배치해서 좌우로 스와이핑 할 수 있게끔 해야 함.
- [ ] fetch해온 구독 채널 목록의 끝에 도달했는데 아직 구독한 모든 채널을 가져온 것이 아니라면, 추가적인 구독 채널을 요청, 반환값을 현재 리스트에 추가해서 사용자에게 제공해야 함. 
- [ ] fetch해온 구독 채널의 영상 목록의 끝에 도달했는데 아직 모든 동영상을 가져온 것이 아니라면, 추가 영상을 요청, 반환값을 현재 리스트에 추가해서 사용자에게 제공해야 함. 
- [ ] 로딩되었을 때 가장 첫 번째 구독 채널 리스트 요소의 영상들이 메인 화면에 떠야 함.
- [ ] 유튜브 모바일 환경에서 '구독' 탭과 비슷한 사용자 경험을 제공, 위 아래로 스와이프 하여 영상들을 확인할 수 있어야 함.
- [ ] 채널을 선택하면 그 채널의 동영상들을 검색해서 가져와야 함.
    //- [ ] functions에서 먼저 기능을 구현해야 함.
- [ ] 동영상을 클릭(선택) 한다면 해당 영상 정보를 Firestore의 videos collection에 저장. 그 이후 해당 동영상을 리스트에서 삭제시켜서 사용자에게 보이지 않게끔 해야 함.
- [ ] 사용자가 선택한 영상들을 저장한 videos를 사용자가 확인할 수 있는 별도의 페이지가 있어야 함.
- [ ] 사용자가 현재 상태에서 더 많은 영상을 리스트에 추가하거나 추가적인 영상 fetch요청은 energy를 소모하고, 해당 energy가 전부 소모되면 피드백을 주어야 함.
- [ ]
- [ ]
- [ ]

### SignInView
- 사용자가 로그인 기능을 사용하도록 돕는 클래스
### DashBoardView
- 현재 유튜브 통제 진행 상황을 보여주는 클래스
### SelectView
- dive가 끝났을 때 시청할 유튜브 영상을 선택하는 UI를 제공하는 클래스
### SearchView
- dive 동안 유튜브 영상을 선택해 재생목록에 담을 수 있는 UI를 제공하는 클래스
### LookUpVideosView


# BACK TODO
## Youtube Data Api
-[x] 통신 성공하기
-[ ] 필요한 api 사용 검증
    -[x] 구독한 채널을 검색해서 반환하는 api
    -[ ] 구독한 채널의 동영상들을 반환하는 api
    
    - playlist
        -[ ] C: playlist insert 하는 api 
        -[ ] R: playlist의 동영상들을 검색해서 반환하는 api
        -[ ] U: playlist에 동영상을 추가하는 api
        -[ ] D: playlist를 삭제하는 api

        -[ ] 특정 영상을 재생목록에 저장하는 api
        -[ ] 특정 영상을 재생목록에서 삭제하는 api

## [ ] Youtube data api에서 반환받은 결과 중 어떤 것들을 저장할 것인가? 어떤 것까지 저장할 것인가?
- 유저가 클릭한 동영상
- 유저가 선택한 동영상 채널
- 유저의 플레이리스트

## Firestore Data structure
- users/
    - user의 id로 doc 생성
        - accessToken, refreshToken, timeOut(?)
        - current dive를 가리키는 포인터 currentDiveDocRef
        - dives/
            - doc 생성
                - 생성 날짜, dive 기간, dive 이후 youtube 시청 시간, 성공 여부(진행 중, 성공, 실패)
                - videos/
                    - video 정보를 담은 docs...
                    - Tumbnail image url, title, channel info, 
                - finalVideos/
                    - Select 된 video 정보를 담은 docs
        - // logs
            - favoriteChannels/



## MODEL 구현
### 

# 막연하지만 언젠가는 구현해보고 싶은 기능들
<!-- - 사용자에게 다음  -->
    