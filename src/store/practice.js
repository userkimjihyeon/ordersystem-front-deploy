function initState() {
    return {
        count: 0
    }
}

// 상태 유효 범위와 리셋 시점
// 리셋시점 : 페이지 새로고침, 브라우저 종료시
// 유효시점 : SPA라우팅시
export const practice = {
    // 상태초기화
    state: initState,
    // 상태값을 변경하는 메서드
    mutations: {
        incrementCount(state){
            state.count++;
        }   
    },
    // 컴포넌트에서 mutation을 직접 호출하기 보다는, actions를 통해 mutation을 호출
    actions: {
        incrementCount(context) {
            // vuex에서 actions에서 mutations를 호출할때는 commit함수를 사용
            // 이와 같은 구조는 여러 mutations의 조합을 actions에서 호출할 수 있기 때문이다
            context.commit("incrementCount");
        }
    },
    // 상태값을 가져가기 위한 메서드
    getters: {
        getCount: state => state.count,
    },
}