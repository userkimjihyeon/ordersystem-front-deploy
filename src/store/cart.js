function initState() {
    return {
        // 초기상태값
        totalQuantity: localStorage.getItem("totalQuantity") || 0,  //localStorage쓰는 이유: api없이 프론트로만 상태관리하기위함.
        productsInCart: JSON.parse(localStorage.getItem("productsInCart")) || [], //배열형식의 문자열을 json으로 직접 파싱(localstorage는 문자열이므로 파싱). 있으면 productsInCart가져오고, 없으면 초기값 배열[]
    }
}

export const cart = {
    state: initState,
    mutations: {
        addCart(state, product) {
            // 전체 장바구니 수량
            state.totalQuantity = parseInt(state.totalQuantity) + product.productCount; //기존값을 꺼내와서(localstorage는 문자열이므로 파싱) + 주문개수 합.
            localStorage.setItem("totalQuantity", state.totalQuantity); //localstorage에 저장("키", 밸류)

            // 장바구니 안의 상품목록
            const existProduct = state.productsInCart.find(p => p.productId === product.productId); //기존상품id와 새로추가된상품id가 일치하는지 확인
            if (existProduct) {
                // 기존에 일치하는 상품id가 있다면 -> 상품개수 누적
                existProduct.productCount += product.productCount;
            } else {
                // 기존에 일치하는 상품id가 없다면 -> 새로 추가
                state.productsInCart.push(product);
            }
            localStorage.setItem("productsInCart", JSON.stringify(state.productsInCart));   //json으로 직렬화해서 매개변수로 보내기
        },
        clearCart(state) {
            state.productsInCart = [];
            state.totalQuantity = 0;
            localStorage.removeItem("totalQuantity");
            localStorage.removeItem("productsInCart");
        },
    },
    actions: {
        addCart(context, product) {
            // context.commit → 현재 모듈(cart)의 mutations.addCart 실행
            // product는 컴포넌트에서 dispatch("addCart", product)로 전달된 데이터
            context.commit("addCart", product)
        },
        clearCart(context) {
            context.commit("clearCart");
        }
    },
    getters: {
        getTotalQuantity: state => state.totalQuantity,
        getProductsInCart: state => state.productsInCart
    },
}   