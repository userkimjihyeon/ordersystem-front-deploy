<template>
    <h1>vue 조건식</h1>

    <button v-if="!isLogined" @click="doLogin()">로그인버튼</button>
    <button v-if="isLogined" @click="doLogout()">로그아웃버튼</button>
    <div v-if="!isLogined">로그인해주세요</div>
    <div v-if="isLogined">환영합니다</div>

    <h1>상품목록조회</h1>
    <table>
        <thead>
            <tr>
                <th>id</th>
                <th>name</th>
                <th>price</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in productList" :key="product.id">
                <td>{{product.id}}</td>
                <td>{{product.name}}</td>
                <td>{{product.price}}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import axios from 'axios';

export default{
    data() {
        return{
            isLogined: true,
            productList: []
        }
    },
    // 화면이 열림과 동시에 실행되는 hook함수 : created
    async created() {
        const response = await axios.get("http://localhost:8080/product/list");     // axios 쓰면 try-catch로 감싸서 alert창이라도 띄우기
        console.log(response);
        this.productList = response.data.result.content;    //서버 응답(response)에서 data.result.content 위치에 있는 상품 목록 배열을 꺼내서, Vue data()에 정의된 productList에 넣어 v-for로 화면에 표시
    },
    methods: {
        doLogin() {
            this.isLogined = true;
        },
        doLogout() {
            this.isLogined = false;
        }
    }
}
</script>


