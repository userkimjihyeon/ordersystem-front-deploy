<template>
    <v-app-bar>
        <v-container>
            <v-row>
                <!-- justify-start : 왼쪽 기준 정렬 -->
                <v-col class="d-flex justify-start">
                    <div v-if="userRole==='ADMIN'">
                        <v-btn :to="'/member/list'">회원관리</v-btn>
                        <v-btn :to="'/product/manage'">상품관리</v-btn>
                        <v-btn href="/order/list">실시간주문건수 {{ liveOrderCount }}</v-btn>
                        <!-- <v-btn :to="'/practice/store'">스토어테스트</v-btn> -->
                    </div>
                </v-col>
                <v-col clss="text-center">
                    <v-btn :to="'/'">devops shop automation</v-btn>
                </v-col>
                <!-- justify-end : 오른쪽 기준 정렬 -->
                <v-col class="d-flex justify-end">
                    <v-btn v-if="isLogined" :to="'/order/cart'">장바구니 {{ totalQuantity }}</v-btn>
                    <v-btn :to="'/product/list'">상품목록</v-btn>
                    <v-btn v-if="isLogined" :to="'/member/mypage'">마이페이지</v-btn>
                    <v-btn v-if="!isLogined" :to="'/member/create'">회원가입</v-btn>
                    <v-btn v-if="!isLogined" :to="'/member/login'">로그인</v-btn>
                    <v-btn v-if="isLogined" @click="doLogout()">로그아웃</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>
</template>


<script>
import { EventSourcePolyfill } from 'event-source-polyfill';
import { jwtDecode } from 'jwt-decode';

export default {
    data() {
        return {
            userRole: null,
            isLogined: false,
            cartProductCount: 0,
            liveOrderCount: 0,
        }
    },
    created() {
        // 홈화면 로딩시, 토큰이 있으면, 로그인버튼 대신 로그아웃버튼
        const accessToken = localStorage.getItem("accessToken");
        if(accessToken) {
            const payload = jwtDecode(accessToken);
            console.log(payload);
            this.userRole = payload.role;
            this.isLogined = true;
        }
        // sse 연결 및 메시지 수신
        if(this.userRole === "ADMIN") {
            // sse연결요청을 위한 event-source-polyfill라이브러리 사용
            let sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/sse/connect`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // 서버에서 'connect'라는 이벤트를 보냈을 때 실행할 콜백 등록
            sse.addEventListener ('connect', (event)=>{     // connect: 이벤트명
                console.log(event);
            })
            // 서버에서 'ordered'라는 이벤트를 보냈을 때 실행할 콜백 등록
            sse.addEventListener ('ordered', (event)=>{
                console.log(event);
                this.liveOrderCount++;  // 실시간 주문 건수 카운터 증가
            })
        }
    },
    computed: {
        totalQuantity() {
          return this.$store.getters.getTotalQuantity;
        }
    },
    methods:{
        doLogout() {
            localStorage.clear();       // 로컬에서 토큰 삭제 (서버에는 rt남아있음)
            this.isLogined = false;
            this.userRole = null;
            this.$router.push("/");
        }
    },
}
</script>

