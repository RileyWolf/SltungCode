<template>
  <div>
    <div class="tabbase">
      <div class="logo">
        <img src= "../assets/Logo.png" />
      </div>
      <div class="hoverState">
          <div class="back">
          <font-awesome-icon
            :icon="['fas','chevron-left']"
            class="icon"
          />
          <p> Back </p>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
    };
  },
  methods: {},
};
</script> 
<style scoped>
.tabbase {
  width: 1920px;
  height: 55px;
  background-color: #233044;
  position: relative;
}
.logo {
  width: 122.4px;
  height: 37px;
  position: absolute;
  left: 23.37px;
  top: 9px;
}
.hoverState{
    width: 90px;
    height: 55px;
    left: 246px;
    position: relative;
}
.hoverState:hover{ 
    width: 90px;
    height: 55px;
    left: 246px;
    position: relative;
    background-color:#466086;
    cursor: pointer;
}
.hoverState:hover p{ 
    color: #FFFFFF;
    font-family:Arial;
    position: absolute;
    margin:0px auto;
    margin-left: 16px;
}
.hoverState:hover .icon{ 
    width: 5.89px;
    height: 10.31px;
    margin:0px auto;
    margin-top: 4px;
    position: absolute;
    color: #FFFFFF;
}
.back{
    width: 54px;
    height: 19px;
    top: 18px;
    left: 18px;
    position: relative;
}
.back p{
    color: #466086;
    font-family:Arial;
    position: absolute;
    margin:0px auto;
    margin-left: 16px;
}
.icon{
    width: 5.89px;
    height: 10.31px;
    margin:0px auto;
    margin-top: 4px;
    position: absolute;
    color: #466086;
}
div {
  list-style: none;
}
</style>