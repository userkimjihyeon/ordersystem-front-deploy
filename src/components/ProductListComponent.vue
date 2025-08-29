<template>
    <v-container>
        <v-row class="d-flex justify-content-between mt-5">
            <!-- 검색용 col 1/2 -->
            <v-col>
                <v-form>
                   <v-row>
                        <v-col cols="auto">
                            <v-select
                            v-model="searchType"
                            :items="searchOptions"
                            item-title="text"
                            item-value="value"
                            />
                        </v-col>
                        <v-col>
                            <!-- 사용자가 입력하는 순간 searchValue변수에 값이 들어감 -->
                            <v-text-field
                            v-model="searchValue" 
                            label="search"
                            @keyup.enter="searchProduct"
                            />
                        </v-col>
                        <v-col cols="auto">
                            <v-btn @click="searchProduct()">검색</v-btn>
                        </v-col>
                   </v-row> 
                </v-form>
            </v-col>
            <!-- 주문용 col 1/2 -->
             <!-- user용 -->
            <v-col cols="auto" v-if="!isAdmin">
                <v-btn @click="addCart()" color="primary">장바구니</v-btn>
                <v-btn @click="createOrder()" color="secondary">주문하기</v-btn>
            </v-col>
            <!-- admin용 -->
            <v-col cols="auto" v-if="isAdmin">
                <v-btn :to="'/product/create'" color="primary">상품등록</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title class="text-center text-h5">
                        {{ pageTitle }}
                    </v-card-title>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>제품사진</th>
                                    <th>제품명</th>
                                    <th>가격</th>
                                    <th>재고수량</th>
                                    <!-- user용 -->
                                    <th v-if="!isAdmin">주문수량</th>
                                    <th v-if="!isAdmin">주문선택</th>
                                    <!-- admin용 -->
                                    <th v-if="isAdmin">Action</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in productList" :key="product.id">
                                    <td>
                                        <v-img :src="product.imagePath"></v-img>
                                    </td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.price }}</td>
                                    <td>{{ product.stockQuantity }}</td>
                                    <td v-if="!isAdmin">
                                        <!-- v-text-field: input박스인데 다양한 옵션가능 -->
                                        <!-- input박스는 화면에서 숫자처럼 보여도, 실제 입력값은 문자열 -->
                                        <v-text-field v-model.number="product.productCount" type="number" style="width:65px" />
                                        <!-- v-model.number: 숫자로 형변환 -->
                                    </td>
                                    <td v-if="!isAdmin">
                                        <!-- 변수 selected에 상품.id 객체를 담는다 -->
                                        <input type="checkbox" v-model="product.selected">
                                    </td>
                                    <td v-if="isAdmin">
                                        <!-- 변수 selected에 상품.id 객체를 담는다 -->
                                        <v-btn color="secondary">상품삭제</v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    props: ['isAdmin', 'pageTitle'],
    data() {
        return {
            productList: [],    // []: 배열
            pageSize: 7,
            currentPage: 0,
            isLoading: false,
            isLastPage: false,
            searchType: "optional",
            searchValue: "",
            searchOptions: [{text:"선택", value:"optional"}, {text:"상품명", value:"productName"}, {text:"카테고리", value:"category"}],
        }
    },
    async created() {
        this.loadData();  
        // 스크롤을 움직이면 scrollPaging 함수가 실행
        window.addEventListener('scroll', this.scrollPaging);
    },
    methods: {
        addCart() {
            const orderProductList = this.productList
                        .filter(p=>p.selected && p.productCount > 0)
                        .map(p=>({productId:p.id, name:p.name, productCount:p.productCount}));  //name:p.name 상품이름 
            // cart.js의 actions메서드 호출
            // "키", 밸류 : 밸류를 orderProductList에서 order를 하나씩 매개변수로 전달
            orderProductList.forEach(p => this.$store.dispatch("addCart", p));
        },
        searchProduct() {
            // 변수 초기화 후 loadData() 호출
            this.productList = [];
            this.currentPage = 0;
            this.isLastPage = false;
            this.isLoading = false;
            this.loadData();
        }, 
        scrollPaging() {
            // 현재화면높이+스크롤로 이동한 거리 > 전체화면높이-n(내가원하는길이)가 성립되면 추가데이터 로드
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
            if(isBottom && !this.isLoading && !this.isLastPage) {   //isLoading과 isLastPage이 false일때만 loadData()하도록함. -> 스크롤내리자마자데이터로드되는거막기위해
                this.loadData();
            }
        },
        async loadData() {
            this.isLoading = true;  //>>>작업시작

            // 문자열로 직접 ?size=xx&page=yy 형태로도 조립가능하지만, params라는 객체를 사용하면 파라미터형식으로 url조립 
            let params={
                size: this.pageSize,
                page: this.currentPage,
            }
            // 선택박스의 상품이름/카테고리를 선택한 경우
            if(this.searchType == "productName") {
                params.productName = this.searchValue;      // 기본 키(size, page)와 달리, 동적으로 params에 새 키를 추가
            }
            if(this.searchType == "category") {
                params.category = this.searchValue;
            }
            // 서버에서 데이터 가져오기 (8080경로 : /product/list)
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product/list`, {params});
            // product에 기존 컬럼은 유지하고(...p), 컬럼 productCount=0 추가 (+selected 컬럼 추가)
            const additionalData = response.data.result.content.map(p=>({...p, productCount:0, selected:false}));
            // 추가데이터가 없으면, 마지막페이지 처리
            if(additionalData.length == 0) {
                this.isLastPage = true;
            }
            // 응답 목록에 화면용 보조 필드 추가
            this.productList = [...this.productList, ...additionalData];   //...기존데이터, ...새로운데이터
            this.currentPage++; //한번로드되고나면+1
            console.log(this.currentPage);

            this.isLoading = false; //작업끝<<<<
        },
        async createOrder() {
            try {
                // 1. 조립(필터 및 맵으로 재조립)
                const orderProductList = this.productList
                                        .filter(p=>p.selected && p.productCount > 0)
                                        .map(p=>({productId:p.id, productCount:p.productCount}));
                console.log(orderProductList);
                if(orderProductList.length > 0) {
                    // 2. 서버에 전송
                    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/ordering/create`, orderProductList);
                    alert("주문이 성공하였습니다.");
                    // 3. 새로고침
                    window.location.reload();
                }
            } catch(e) {
                console.log(e);
                alert("주문이 실패하였습니다.");
            }
        },
    },
}
</script>