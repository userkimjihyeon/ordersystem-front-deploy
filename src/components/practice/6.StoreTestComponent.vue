<template>
    <StoreTestComponentA/>
    <StoreTestComponentB/>
</template>

<script>
import StoreTestComponentA from './6.StoreTestComponentA.vue';
import StoreTestComponentB from './6.StoreTestComponentB.vue';

export default {
    // 화면의 하나의 요소로 두개의 vue추가. 가져다가 template 태그로 화면에 뿌림.
    components:{
        StoreTestComponentA, StoreTestComponentB
    }
}
</script>
