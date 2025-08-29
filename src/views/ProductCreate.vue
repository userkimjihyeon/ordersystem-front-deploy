<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="6">
                <v-card>
                    <v-card-title class="text-h5 text-center">
                        상품등록
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                label="상품명"
                                v-model="name"
                            />
                            <v-text-field
                                label="카테고리"
                                v-model="category"
                            />
                            <v-text-field
                                label="가격"
                                v-model.number="price"
                            />
                            <v-text-field
                                label="재고수량"
                                v-model="stockQuantity"
                            />
                            <v-file-input
                                label="상품이미지"
                                accept="image/**"
                                @change="fileUpload"
                                multiple
                            />
                            <!-- accept="image/**" 이미지 파일만 허용
                                @change="fileUpload" 파일 선택 시 메서드 실행
                                multiple 여러 장 업로드 가능 -->
                            <v-row>
                                <v-col>
                                    <v-btn color="primary" block @click="productCreate()">
                                        등록
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default{
    data() {
        return{
            name: "",
            category: "",
            price: null,
            stockQuantity: null,
            productImage: null,
        }
    },
    methods: {
        fileUpload(event) {
            // 여러개의 상품일경우 for문을 실행하여 productImage에 값 할당
            // 파일 업로드 시 첫 번째 파일을 productImage에 저장
            this.productImage = event.target.files[0];
        },
        async productCreate() {
            try {
                // multipart-formdata 또는 url인코딩 방식인경우에 FormData클래스 사용해서 객체 조립
                // 파일 + 데이터 전송을 위한 FormData 생성
                let data = new FormData();
                data.append("name", this.name);
                data.append("category", this.category);
                data.append("price", this.price);
                data.append("stockQuantity", this.stockQuantity);
                data.append("productImage", this.productImage);
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/product/create`, data) 
                this.$router.push("/product/manage");       // 상품관리화면 로드
            } catch(e) {
                console.log(e);
            }
        },
    },
}
</script>
