<template>
    <div class="consent-container">
      <h1>서비스 약관</h1>
      <div class="terms-content">
        <p v-html="termsOfService"></p>
      </div>
      <button class="consent-button" @click="giveConsent">동의</button>
    </div>
  </template>
  
  <script>
  import { doc, setDoc, getFirestore } from 'firebase/firestore';
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        termsOfService: `
        <div>
          <h2><strong>Suber 서비스 약관</strong></h2>

          <h3><strong>1. 서문</strong></h3>
          <p>Suber(이하 "서비스")는 사용자의 유튜브 경험을 향상시키기 위해 특정 데이터를 수집, 저장 및 활용합니다. 본 약관은 사용자 데이터의 수집 및 사용과 관련된 규정을 설명하며, 사용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.</p>

          <h3><strong>2. 수집되는 정보의 범위</strong></h3>
          <p>본 서비스는 다음과 같은 사용자 정보를 수집합니다:</p>

          <h4><strong>2.1 유튜브 구독 채널 정보</strong></h4>
          <ul>
            <li>사용자가 구독한 유튜브 채널 중 사용자가 선택한 채널의 정보를 수집합니다.</li>
            <li>수집된 정보는 사용자에게 채널 관련 정보를 제공하고, 개인화된 콘텐츠 및 서비스 추천을 포함한 다양한 목적으로 사용될 수 있습니다.</li>
          </ul>

          <h4><strong>2.2 유튜브 동영상 정보</strong></h4>
          <ul>
            <li>사용자가 선택한 유튜브 동영상에 대한 정보를 수집하고 저장합니다.</li>
            <li>이 정보는 사용자의 관심사에 맞춘 콘텐츠 및 서비스 추천, 새로운 기능 개발, 서비스 품질 향상을 위한 목적으로 사용됩니다.</li>
          </ul>

          <h4><strong>2.3 유튜브 시청 시각 및 시간 정보</strong></h4>
          <ul>
            <li>사용자가 유튜브를 시청하기로 계획한 시각과 시간에 대한 정보를 수집합니다.</li>
            <li>이 정보는 사용자의 시청 패턴을 분석하여 개인화된 서비스 제공, 새로운 기능 개발, 서비스 품질 향상 등의 목적으로 사용됩니다.</li>
          </ul>

          <h4><strong>2.4 유튜브 시청 결정 시각 정보</strong></h4>
          <ul>
            <li>사용자가 유튜브 시청을 결정한 시각에 대한 정보를 수집합니다.</li>
            <li>이 정보는 개인화된 서비스 제공, 새로운 기능 개발, 서비스 품질 향상 등의 목적으로 사용됩니다.</li>
          </ul>

          <h4><strong>2.5 사용자 프로필 데이터</strong></h4>
          <ul>
            <li>사용자의 닉네임, 프로필 사진 및 기타 프로필 설정 정보(이하 "프로필 데이터")를 수집합니다.</li>
            <li>수집된 프로필 데이터는 서비스 내에서 사용자 식별, 개인화된 서비스 제공, 그리고 새로운 기능 개발 및 서비스 품질 향상을 위한 목적으로 사용될 수 있습니다.</li>
          </ul>

          <h3><strong>3. 정보 사용의 목적과 범위</strong></h3>
          <p>Suber는 수집된 정보를 서비스 제공, 개인화된 사용자 경험 제공, 서비스 품질 향상, 새로운 기능 개발을 포함한 다양한 목적으로 사용합니다.</p>
          <p>수집된 모든 정보는 Suber의 제휴 파트너와 공유될 수 있으며, 개인화된 콘텐츠 및 서비스 추천을 포함한 다양한 목적에 활용될 수 있습니다.</p>

          <h3><strong>4. 데이터 활용에 대한 동의</strong></h3>
          <p>사용자는 Suber가 수집한 데이터를 위에 명시된 목적을 위해 활용하는 데 동의합니다.</p>
          <p>사용자는 언제든지 데이터 활용에 대한 동의를 철회할 수 있으며, 이는 Suber의 고객 지원팀을 통해 가능합니다.</p>

          <h3><strong>5. 정보 보안</strong></h3>
          <p>Suber는 사용자의 개인정보를 보호하기 위해 최선을 다하고 있으며, 적절한 기술적 및 조직적 보안 조치를 취하고 있습니다.</p>
          <p>사용자의 정보는 암호화된 형태로 저장되며, 무단 접근, 변조, 공개, 파기로부터 보호됩니다.</p>

          <h3><strong>6. 약관 변경</strong></h3>
          <p>Suber는 본 약관을 변경할 권리를 보유하며, 약관 변경 시 사전에 사용자에게 공지합니다.</p>
          <p>변경된 약관에 동의하지 않을 경우, 사용자는 서비스를 중단할 수 있으며, 계속해서 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.</p>

          <h3><strong>7. 문의</strong></h3>
          <p>본 약관에 대한 문의 사항이 있는 경우, Suber의 고객 지원팀에 연락해 주시기 바랍니다.</p>

          <hr>

          <h3><strong>8. 최종 동의</strong></h3>
          <p>본 약관을 읽고 이해한 후, 서비스 이용을 위해 동의해 주시기 바랍니다.</p>
          <p>"동의" 버튼을 클릭함으로써, 사용자는 본 약관에 동의하며, Suber가 명시된 범위 내에서 정보를 수집, 저장, 서비스 품질 향상 및 개인화된 서비스 제공을 포함한 다양한 목적으로 사용할 수 있음을 허용합니다.</p>
        </div>

          `,
      };
    },
    computed: {
      ...mapGetters([
        'getUserState',
      ]),
      userUID() {
        return this.getUserState.uid;
      }
    },
    methods: {

      async giveConsent() {
        const db = getFirestore();

        try {
          if (this.userUID) {
            const userDoc = doc(db, 'users', this.userUID);
            await setDoc(userDoc, { consentGiven: true, consentTimestamp: new Date() }, { merge: true });
            this.$router.go(-1);
          } else {
          }
        } catch (error) {
          console.error('Error giving consent:', error);
          alert('동의 중 오류가 발생했습니다.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .consent-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  
  .terms-content {
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;
  }
  
  .consent-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    text-align: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .consent-button:hover {
    background-color: #0056b3;
  }
  </style>
  