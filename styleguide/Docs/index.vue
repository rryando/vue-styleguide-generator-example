<template>
  <div id="docs">
    <DocsNavbar></DocsNavbar>
    <div class="o-layout o-layout--responsive u-pad-top--8" style="margin-top:100px">
      <div class="o-layout__item u-2of12">
        <DocsSideNav></DocsSideNav>
      </div>
      <div class="o-layout__item u-10of12">
        <DocsShowcase></DocsShowcase>
      </div>
    </div>
  </div>
</template>
<script>
import DocsNavbar from './DocsNavbar.vue'
import DocsSideNav from './DocsSideNav.vue'
import DocsShowcase from './DocsShowcase.vue'

export default {
  components: {
    DocsNavbar,
    DocsSideNav,
    DocsShowcase
  }
}
</script>
<style src="./style/index.css">
</style>
