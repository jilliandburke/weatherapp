<template lang="html">
  <div :class='{"tabs__light": mode === "light", "tabs__dark": mode === "dark"}'>
    <ul class='tabs__header'>
      <li v-for='(tab, index) in tabs'
        :key='tab.title'
        @click='selectTab(index)'
        :class='{"tab__selected": (index == selectedIndex)}'>
        {{ tab.title }}
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  },
  data () {
    return {
      selectedIndex: 0, // the index of the selected tab,
      tabs: [] // all of the tabs
    }
  },
  created () {
    this.tabs = this.$children
  },
  mounted () {
    this.selectTab(0)
  },
  methods: {
    selectTab (i) {
      this.selectedIndex = i

      // loop over all the tabs
      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === i)
      })
    }
  }
}
</script>

<style lang="scss">
  .tabs__header {
    display: inline-block;
    list-style: none;
    margin: 0 0 0 20px;
    padding: 0;
    border-bottom: 1px solid black;

     li {
      padding: 15px 30px;
      // border-radius: 10px;
      margin: 0;
      display: inline-block;
      margin-right: 5px;
      cursor: pointer;

      &.tab__selected {
        font-weight: bold;
        border-radius: 10px 10px 0 0;
        border-bottom: 8px solid transparent;
      }
    }
  }

  .tab {
    display: inline-block;
    color: black;
    padding: 20px;
    min-width: 800px;
    border-radius: 10px;
    min-height: 400px;
  }

  .tabs__light {
    .tab{
      // background-color: #fff;
    }

    li {
      // background-color: #ddd;
      // color: #aaa;

      &.tab__selected {
        background-color: #fff;
        color: #83FFB3;
      }
    }
  }

  .tabs__dark {
    .tab{
      background-color: #555;
      color: #eee;
    }

    li {
      background-color: #ddd;
      color: #aaa;

      &.tab__selected {
        background-color: #555;
        color: white;
      }
    }
  }
</style>
