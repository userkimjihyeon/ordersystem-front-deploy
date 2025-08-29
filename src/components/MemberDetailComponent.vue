<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title class="text-center text-h5">
                        {{ pageTitle }}
                    </v-card-title>
                    <v-card-text>
                        <v-table v-if="member">
                            <tbody>
                                <tr><td>ID : </td><td>{{ member.id }}</td></tr>
                                <tr><td>이름 : </td><td>{{ member.name }}</td></tr>
                                <tr><td>이메일 : </td><td>{{ member.email }}</td></tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { getResultData } from '@/utills/commmonDataHandler';
import axios from 'axios';


export default{
    // 화면간에 매개변수를 넘길때 사용하는 변수값을 props라 칭함
    props: ['isMyPage', 'pageTitle'], 
    data() {
        return {
            member: {}
        };
    },
    async created() {
        try {
            // 내정보조회
            if (this.isMyPage) {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member/myinfo`);
                this.member = getResultData(response);
            } else {
                // id로 넘어온 회원상세정보
                const memberId = this.$route.params.id;
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member/detail/${memberId}`);  //memberId의 api조회
                this.member = getResultData(response);
                console.log(memberId);
            }
        } catch(e) {
            console.log(e);
        }
    }
}
</script>