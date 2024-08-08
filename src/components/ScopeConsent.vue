<template>
  <div class="oauth-consent">
    <h1>로그인 된 계정으로 어떤 일을 하나요?</h1>

    <div class="scope-description">
      <h2>사용하는 OAuth(Youtube) 범위</h2>
      <ul>
        <li>
          <strong>구독 채널 리스트 요청:</strong> 사용자가 구독하고 있는 YouTube 채널 목록을 요청하여, 개인화된 추천과 관련된 정보를 제공합니다.
        </li>

        <li>
          <strong>사용자가 선택한 동영상들을 포함하는 비공개 재생목록 생성:</strong> 사용자가 선택한 동영상들을 포함하는 비공개 재생목록을 생성하여, 개인화된 시청 경험을 제공합니다.
        </li>
      </ul>
    </div>

    <div class="user-confirmation">
      <p>
        위의 정보에 대해 이해하고 동의하신다면, 아래의 "동의" 버튼을 클릭하여 서비스 사용을 계속해 주시기 바랍니다. 동의 버튼을 클릭함으로써, 본 서비스가 위에 명시된 OAuth 범위에 접근하는 것을 허용합니다.
      </p>
      <button @click="confirmConsent">동의</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OAuthConsent',

  methods: {
    confirmConsent() {

      this.$router.push('/tutorial');
    }
  }
}
</script>

<style scoped>
.oauth-consent {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin-top: 20px;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}

li {
  margin-bottom: 10px;
}

.user-confirmation {
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
