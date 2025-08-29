<template>
    <!-- 단방향 바인딩 : 새로고침하지 않아도 값이 실시간으로 변경 -->
    <!-- 화면내에서는 this를 붙일필요 없음 -->
    <h1>hello world {{language}}</h1>
    <!-- v-model 문법을 사용하면 양방향 데이터 바인딩 ⭐사용자입력값으로 변수도 변경됨⭐ -->
    <input type="text" v-model="value">
    <button @click="changeValue()">변수변경</button>
    <button @click="showValue()">변수확인</button>
</template>

<script>
    export default{
        // data()함수는 화면에서 사용할 변수를 정의
        data(){
            return {
                language: "java",
                value: "java",
            }
        },
        // 개발자가 정의하는 함수는 methods안에 정의
        methods: {
            changeValue() {
                // this의 의미는 현재 컴포넌트객체(=이 화면자체) 자신을 의미한다.
                // this는 주로 컴포넌트 내부에 선언된 변수(data함수내)에 접근할때 주로 사용
                this.value = "C++";
            },
            showValue() {
                alert(this.value);
            }
        }
    }
</script>

