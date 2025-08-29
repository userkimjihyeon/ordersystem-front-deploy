<template>
    <v-container>
        <v-row justify="center">
            <v-col class="text-center text-h5">
                장바구니 목록
            </v-col>
        </v-row>
        <v-row justify="space-between">
            <v-col cols="auto">
                <v-btn color="secondary" @click="clearCart()">장바구니 비우기</v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn color="primary" @click="orderCreate()">주문하기</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table>
                    <thead>
                        <tr>
                            <th>제품ID</th>
                            <th>제품명</th>
                            <th>주문수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- getProductsInCart는 로컬스토리지에서 가져와서 상태관리 -->
                        <tr v-for="product in getProductsInCart" :key="product.productId">
                            <td>{{ product.productId }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.productCount }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default{
    computed: {
        getProductsInCart() {
            return this.$store.getters.getProductsInCart;
        }
    },
    methods: {
        clearCart() {
            this.$store.dispatch("clearCart");
        },
        async orderCreate() {
            try {   
                // 1. 장바구니에서 서버에 보낼 데이터만 추출 (상품 ID, 주문 수량)
                const orderData = this.getProductsInCart.map(p => {
                    return {
                        productId:p.productId,      // 상품 고유 ID
                        productCount:p.productCount // 주문 수량
                    }
                });
                // 2. 주문 생성 API 호출 (POST 방식, orderData를 요청 본문에 담아 전송)
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/ordering/create`, orderData)
                // 3. 주문이 성공하면 장바구니 비우기 (Vuex state & localStorage 초기화)
                this.clearCart();
                // 4. 사용자에게 주문 성공 알림
                alert("주문 완료");
            } catch(e) {
                console.log(e);
            }
        },
    }
}
</script>
