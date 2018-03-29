<template>
    <!--话术开始-->
    <div id="verbal" style="overflow-y: auto;">
        <h3 style="font-size: 14px">话术提示(您好，接下来向您提问4个问题，请回答，是 或 不是)</h3>
        <div id="verbalinfo" :visible.sync="isShowed" v-html="verbalInfo">
        </div>
    </div>
    <!--话术结束-->



</template>

<script>
export default {
    data() {
        return {
            isShowed:false,
            verbalInfo:"<p style='margin: 3px 0px;'>1、您是XXX先生/女士吗？</p>" +
                        "<p style='margin: 3px 0px;'>2、您是否已完整观看关于创业板风险揭示的视频文件并已清楚了解创业板可能面临的所有风险？</p>" +
                        "<p style='margin: 3px 0px;'>3、您在营业部办理权限开通时，经办人员将根据创业板开通流程审核您的资质，若您的风险承受能力未达到稳健型或以上；或者股票交易经验未超过两年，原则上不允许开通创业板权限。您是否充分了解？</p>"+
                        "<p style='margin: 3px 0px;'>4、开通创业板交易权限，是否为您本人自主、真实的意思？</p>"
        };
    },
    mounted() {


    },
    methods: {

    }
};
</script>
<style scoped>
#verbalinfo{
    font-size: 12px;
    line-height: 24px;
}
#verbalinfo p{
    margin: 3px 0px;
}

</style>
