<template>
  <div class="bullshit">
    <div class="bullshit__oops">OOPS!</div>
    <div class="bullshit__info">
      C版权所有
      <a class="link-type" href="http://www.yihut.cn/" target="_blank"
        >医护通科技(云南)有限责任公司</a
      >
    </div>
    <div class="bullshit__headline">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "error",
  computed: {
    message() {
      return "当前页面暂未开放......";
    },
  },
};
</script>

<style lang="less" scoped>
.bullshit {
  margin: 200px auto;
  width: 300px;
  padding: 30px 0;
  overflow: hidden;
  &__oops {
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    color: #1482f0;
    opacity: 0;
    margin-bottom: 20px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }
  &__headline {
    font-size: 20px;
    line-height: 24px;
    color: #222;
    font-weight: bold;
    opacity: 0;
    margin-bottom: 10px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.1s;
    animation-fill-mode: forwards;
  }
  &__info {
    font-size: 13px;
    line-height: 21px;
    color: grey;
    opacity: 0;
    margin-bottom: 30px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.2s;
    animation-fill-mode: forwards;
  }
  &__return-home {
    display: block;
    float: left;
    width: 110px;
    height: 36px;
    background: #1482f0;
    border-radius: 100px;
    text-align: center;
    color: #ffffff;
    opacity: 0;
    font-size: 14px;
    line-height: 36px;
    cursor: pointer;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.3s;
    animation-fill-mode: forwards;
  }
  @keyframes slideUp {
    0% {
      transform: translateY(60px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>