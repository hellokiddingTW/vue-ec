<template>
  <div id="app">
   
    <router-view></router-view>

  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  created() {
    console.log(process.env.APIPATH, process.env.CUSTOMPATH);
    const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
    this.$http.get(api).then((response) => {
      console.log(response.data);
    });
  },
  components: {
    HelloWorld,
  },
};
</script>

<style lang='scss'>
@import "./assets/all";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
