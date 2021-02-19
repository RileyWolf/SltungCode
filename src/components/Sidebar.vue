<template>
  <div>
    <div class="sidebarbase">
      <div class="user-area">
        <div class="icon" @click="ShowUser()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35.004"
            height="34.998"
            viewBox="0 0 35.004 34.998"
          >
            <path
              class="user_a"
              d="M17992.5,16622a17.5,17.5,0,1,1,12.375-5.125A17.385,17.385,0,0,1,17992.5,16622Zm-4.072-16.086a4.059,4.059,0,0,0-4.055,4.055v.506a1.523,1.523,0,0,0,1.523,1.52h13.172a1.52,1.52,0,0,0,1.518-1.52v-.506a4.059,4.059,0,0,0-4.055-4.055h-1.744a5.516,5.516,0,0,1-4.615,0Zm4.055-10.129a4.559,4.559,0,1,0,4.561,4.557A4.562,4.562,0,0,0,17992.482,16595.783Z"
              transform="translate(-17974.998 -16587)"
            />
          </svg>
        </div>
      </div>
      <div class="cative-line" v-if="show=='work'" ></div>
      <div
        :class="(classname == 'work')?'new-but-base-s':'but-base-s'"
        @click="Show('work')"
      >
        <div class="icon-s">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
          >
            <g transform="translate(-19 -169)">
              <rect
                class="work_a"
                width="23"
                height="23"
                transform="translate(19 169)"
              />
              <path
                class="work_b"
                d="M14228.2,16727a2.255,2.255,0,0,1-2.249-2.25v-13.5a2.251,2.251,0,0,1,2.249-2.25h2.6a3.6,3.6,0,0,1,7.1,0h2.9a2.25,2.25,0,0,1,2.248,2.25v13.5a2.254,2.254,0,0,1-2.248,2.25Zm-.749-15.748v13.5a.751.751,0,0,0,.749.75h12.6a.752.752,0,0,0,.75-.75v-13.5a.751.751,0,0,0-.75-.75h-3.607a.749.749,0,0,1-.545-.234.758.758,0,0,1-.205-.557l0-.061v-.051a2.1,2.1,0,1,0-4.2,0v.051l0,.061a.751.751,0,0,1-.749.791h-3.308A.75.75,0,0,0,14227.454,16711.248Zm2.661,11.563a.928.928,0,1,1,.93-.93.927.927,0,0,1-.93.93Zm3.038-.027a.9.9,0,0,1,0-1.8h5.7a.9.9,0,1,1,0,1.8Zm-3.038-3.855a.928.928,0,1,1,.93-.932.929.929,0,0,1-.93.932Zm3.038-.029a.9.9,0,0,1,0-1.8h5.7a.9.9,0,1,1,0,1.8Zm-3.038-3.932a.928.928,0,1,1,.93-.926.924.924,0,0,1-.93.926Zm3.038-.025a.9.9,0,0,1,0-1.8h5.7a.9.9,0,1,1,0,1.8Zm.152-5.346a1.05,1.05,0,1,1,1.051,1.049A1.048,1.048,0,0,1,14233.306,16709.6Z"
                transform="translate(-14203.955 -16535.996)"
                :style="(style=='work')?getFill():''"
              />
            </g>
          </svg>
        </div>
        <div class="child">
          <p>任務清單</p>
        </div>
      </div>
      <div class="cative-line" v-if=" show =='pro'"></div>
      <div
        :class="(classname == 'pro')?'new-but-base-s':'but-base-s'" 
        @click="Show('pro')"
      >
        <div class="icon-s">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
          >
            <g transform="translate(-19 -169)">
              <rect
                class="pro_a"
                width="23"
                height="23"
                transform="translate(19 169)"
              />
              <path
                class="pro_b"
                d="M16464.2,16663.078h-11.182a2.019,2.019,0,0,1-2.021-2.02v-12.094a2.023,2.023,0,0,1,2.021-2.02h1.045v-1.158a2.061,2.061,0,0,1,2.057-2.062h7.637a2.066,2.066,0,0,1,2.063,2.063v3.559h.4a2.016,2.016,0,0,1,2.016,2.016v.777a1.546,1.546,0,0,1,.652.516,1.692,1.692,0,0,1,.205,1.539l-2.3,7.1a2.709,2.709,0,0,1-2.449,1.781Zm-9.137-8.885-2.3,7.1a.369.369,0,0,0,0,.307.36.36,0,0,0,.293.1h11.279a1.329,1.329,0,0,0,1.141-.828l2.3-7.105a.27.27,0,0,0-.3-.41h-11.279A1.335,1.335,0,0,0,16455.064,16654.193Zm-2.689-5.229v9.074l1.379-4.27a2.309,2.309,0,0,1,.311-.605v-4.844h-1.045A.645.645,0,0,0,16452.375,16648.965Zm3.061-3.178v6.336a2.436,2.436,0,0,1,.77-.135h8.238v-6.2a.683.683,0,0,0-.686-.686h-7.637A.686.686,0,0,0,16455.436,16645.787Zm10.385,6.2h1.041v-.627a.645.645,0,0,0-.645-.645h-.4Zm-7.754-1.525a.689.689,0,0,1,0-1.377h3.922a.688.688,0,0,1,0,1.377Zm0-2.4a.686.686,0,0,1,0-1.371h3.922a.686.686,0,0,1,0,1.371Z"
                transform="translate(-16428.998 -16472.725)"
                :style="(style=='pro')?getFill():''"
              />
            </g>
          </svg>
        </div>
        <div class="child">
          <p>專案設定</p>
        </div>
      </div>
      <div class="cative-line" v-if="show=='search'"></div>
      <div
        :class="(classname == 'search')?'new-but-base-s':'but-base-s'" 
        @click="Show('search')"
      >
        <div class="icon-s">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18.999"
            height="19"
            viewBox="0 0 18.999 19"
          >
            <path
              class="search_a"
              d="M14384.41,16664.465l-3.765-3.764a8.542,8.542,0,1,1,1-1.006l3.761,3.762a.713.713,0,0,1,0,1.008.708.708,0,0,1-1,0Zm-16.368-10.27a7.1,7.1,0,0,0,12.087,5.055c.012-.01.02-.027.031-.039s.028-.02.04-.031a7.1,7.1,0,1,0-12.158-4.984Zm11.467,0a4.369,4.369,0,0,0-4.364-4.365.711.711,0,1,1,0-1.422,5.792,5.792,0,0,1,5.786,5.787.711.711,0,1,1-1.422,0Z"
              transform="translate(-14366.621 -16645.672)"
              :style="(style=='search')?getFill():''"
            />
          </svg>
        </div>
        <div class="child">
          <p>進階搜尋</p>
        </div>
      </div>
      <div class="cative-line" v-if="show== 'stt'"></div>
      <div 
        :class="(classname == 'stt')?'new-but-base-s':'but-base-s'"
        @click="Show('stt')">
        <div class="icon-s">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
          >
            <g transform="translate(-19 -169)">
              <rect
                class="stt_a"
                width="23"
                height="23"
                transform="translate(19 169)"
              />
              <path
                class="stt_b"
                d="M308.864,236.047h0l-1.117-1.117,1.148-1.989a1.508,1.508,0,0,0-.38-1.909l0,0-1.331-1.04c.007-.12.01-.235.01-.347s0-.228-.01-.347l1.335-1.043a1.516,1.516,0,0,0,.368-1.931l-1.689-2.921a1.5,1.5,0,0,0-1.868-.671l-1.574.632q-.292-.188-.594-.345l-.238-1.655a1.5,1.5,0,0,0-1.488-1.3h-3.4a1.489,1.489,0,0,0-1.485,1.283l-.24,1.677c-.2.1-.394.218-.591.345l-1.589-.638a1.511,1.511,0,0,0-1.844.654l-1.7,2.933a1.509,1.509,0,0,0,.366,1.944l1.331,1.041c-.007.121-.01.235-.01.346s0,.225.01.346l-1.336,1.045a1.515,1.515,0,0,0-.366,1.93l1.689,2.922a1.506,1.506,0,0,0,1.868.67l1.574-.632q.291.187.593.345l.238,1.655a1.5,1.5,0,0,0,1.488,1.3h3.4a1.488,1.488,0,0,0,1.486-1.283l.24-1.677q.151-.079.3-.167l2.676,2.676a1.929,1.929,0,0,0,2.728-2.729Zm-6.646-.9a.71.71,0,0,0-.41.546l-.3,2.062a.079.079,0,0,1-.079.052h-3.4a.08.08,0,0,1-.081-.073l-.293-2.041a.709.709,0,0,0-.411-.546,5.975,5.975,0,0,1-1.032-.6.71.71,0,0,0-.679-.083l-1.905.765a.085.085,0,0,1-.123-.042l-1.688-2.921a.1.1,0,0,1,.006-.12l1.633-1.277a.709.709,0,0,0,.269-.632,5.162,5.162,0,0,1,0-1.193.71.71,0,0,0-.268-.632l-1.628-1.273a.087.087,0,0,1-.019-.113l1.707-2.954a.109.109,0,0,1,.087-.029l1.93.775a.708.708,0,0,0,.676-.08,6.068,6.068,0,0,1,1.034-.6.709.709,0,0,0,.411-.546l.3-2.062a.077.077,0,0,1,.078-.052h3.4a.08.08,0,0,1,.082.072l.293,2.042a.71.71,0,0,0,.412.547,5.919,5.919,0,0,1,1.032.6.709.709,0,0,0,.679.083l1.906-.766a.087.087,0,0,1,.122.042l1.688,2.92a.1.1,0,0,1-.007.121l-1.633,1.276a.709.709,0,0,0-.268.636,5.51,5.51,0,0,1,.034.593,5.687,5.687,0,0,1-.034.6.709.709,0,0,0,.268.633l1.628,1.273a.085.085,0,0,1,.024.1l-.95,1.645-2.762-2.763a4.312,4.312,0,0,0,.239-1.42,4.377,4.377,0,0,0-5.921-4.106.709.709,0,0,0-.253,1.166l2.382,2.382a.815.815,0,0,1,0,1.153.835.835,0,0,1-1.153,0l-2.382-2.382a.709.709,0,0,0-1.166.253,4.377,4.377,0,0,0,4.106,5.921,4.31,4.31,0,0,0,1.419-.239l1.194,1.194C302.346,235.082,302.283,235.118,302.218,235.147Zm5.643,2.624a.523.523,0,0,1-.722,0l-5.253-5.253a.709.709,0,0,0-.809-.138,2.93,2.93,0,0,1-1.279.295,2.971,2.971,0,0,1-2.961-2.769l1.4,1.4a2.234,2.234,0,1,0,3.16-3.159l-1.4-1.4a2.972,2.972,0,0,1,2.77,2.962,2.932,2.932,0,0,1-.3,1.28.71.71,0,0,0,.138.809l5.253,5.253A.511.511,0,0,1,307.861,237.771Z"
                transform="translate(-269.404 -49.198)"
                :style="(style=='stt')?getFill():''"
              />
            </g>
          </svg>
        </div>
        <div class="child">
          <p>帳號管理</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Sidebar",
  data() {
    return {
      classname: "",
      show: false,
      style: "",
    }
  },
  methods: {
    ShowUser: function () {},
    Show: function (inder) {
      this.classname = inder, 
      this.show = inder,
      this.style = inder
    },
    getFill() {
      return {fill: '#4481ff'}
    }
  },
};
</script> 
<style scoped>
.user_a {
  fill: #5b7bad;
}
.work_a {
  fill: #fff;
  opacity: 0;
}
.work_b {
  fill: #dee2e6;
}
.pro_a {
  fill: #fff;
  opacity: 0;
}
.pro_b {
  fill: #e0e6de;
}
.search_a {
  fill: #eef1f6;
}
.stt_a {
  fill: #fff;
  opacity: 0;
}
.stt_b {
  fill: #eef1f6;
}
.sidebarbase {
  width: 60px;
  height: 1025px;
  background: #233044;
}
.but-base-s {
  z-index: 1;
  width: 60px;
  height: 60px;
  float: left;
  background: #233044;
  cursor: pointer;
}
.but-base-s .child {
  display:none;
  width: 134px;
  height: 60px;
  margin-left: 60px;
  margin-top: -75.5px;
  background: #4481ff;
}
.but-base-s .child p{
  color: white;
  text-align: left;
  margin-left: 20px;
  line-height:60px;
}
.but-base-s:hover .child {
  display:block;
} 
.but-base-s:hover {
  background: #4481ff;
}
.new-but-base-s .child{
  display:none;
}
.new-but-base-s {
  z-index: 1;
  width: 56px;
  height: 60px;
  float: left;
  background: #071a2a;
  cursor: default;
}
.cative-line {
  z-index: 2;
  align-items: center;
  width: 4px;
  height: 60px;
  left: 0px;
  float: left;
  background: #4481ff;
}
.user-area {
  z-index: 1;
  width: 60px;
  height: 80px;
  float: left;
  background: #233044;
  cursor: pointer;
}
.icon {
  width: 35px;
  height: 35px;
  margin: 0px;
  display: inline-block;
  padding: 19px 12.5px 26px;
  list-style: none;
}
.icon-s {
  width: 23px;
  height: 23px;
  margin: 0px;
  display: inline-block;
  padding: 19px 19px 18px 18px;
  list-style: none;
}
div {
  list-style: none;
}
</style>