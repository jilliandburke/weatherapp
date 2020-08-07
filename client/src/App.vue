<template>
  <div id="app">
    <div class="header">
      <h1>WeatherApp</h1>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/add-temperature">Record Temperature</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px 0 0 15px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.header {
  box-shadow: 0px 4px 4px -1px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  width: 100vw;
  display: flex;
  align-items: baseline;
  background-color: white;
  z-index: 10;
  margin-left: -7px;
  padding-left: 30px;

  h1, #nav {
    display: inline-block;
  }
}
</style>
