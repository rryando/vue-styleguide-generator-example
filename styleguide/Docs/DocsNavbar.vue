<template>
  <div class="c-header-wrapper">
    <div class="c-header-wrapper__top">
      <div class="c-header-wrapper__top-wrapper">
        <div class="c-header-wrapper__top-left">
          <div class="c-header-list c-header-list--no-hover"><a class="c-header-list__item">
              <div class="c-header-list__text">LOGO</div>
            </a></div>
        </div>
        <div class="c-header-wrapper__top-middle">
          <div class="c-header-search__field" style="width:100%;">
            <div class="c-header-search__icon">
              <div class="c-icon-duotone c-icon-duotone--medium c-icon-duotone--search"></div>
            </div>
            <form @submit.prevent="submitSearch()" style="width:100%;">
              <input v-model="keywords" @blur="hideDropdown" @input="showDropdown = isKeywordsEmpty" @focus="showDropdown = isKeywordsEmpty" variant="search-bukamall" border="noborder" icon="search" :iconDuotone="true" placeholder="Search Component Here" @keyup="filterList" />
            </form>
            <div class="c-dropdown" v-show="showDropdown" style="width:100%;">
              <div class="c-dropdown__outer u-display-inline-block" style="width:100%;overflow-y: scroll;max-height: 360px;box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0), 0 0 20px 0 rgba(0, 0, 0, 0.1);">
                <div class="c-brand-sidebar c-brand-sidebar--filter">
                  <div class="c-brand-sidebar__body">
                    <div class="c-brand-sidebar__list">
                      <div class="c-brand-sidebar__list-item search-bar-link" v-for="c in sortedSchema" v-if="sortedSchema.length &gt; 0"><span class="lic-list-ui__item u-pad-left--0"></span>
                        <div class="c-label" :class="typeClass(schemaMapper(c).type)">{{schemaMapper(c).type}}</div>
                        <div class="u-mrgn-left--1 c-list-ui__link" @click="setActiveComponent(c)">{{schemaMapper(c).name}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as data from './schema/data.json'
import DocsMixin from './mixins/DocsMixin'
/* eslint-disable no-console */
export default {
  mixins: [DocsMixin],
  data() {
    return {
      keywords: '',
      showDropdown: false,
      sortedSchema: null,
      componentSchema: data.default
    }
  },
  computed: {
    isKeywordsEmpty() {
      return !!this.keywords.length
    }
  },
  mounted() {
    this.sortedSchema = this.sortArr(this.componentSchema)
  },
  methods: {
    submitSearch() {
      this.showDropdown = false
    },
    hideDropdown() {
      return setTimeout(() => {
        this.showDropdown = false
      }, 1000)
    },
    filterList(ev) {
      this.sortedSchema = this.sortArr(this.componentSchema)
      const searchKey = ev.target.value
      this.sortedSchema = this.sortedSchema.filter(
        t => t[3].toLowerCase().includes(searchKey) || t[2].toLowerCase().includes(searchKey)
      )
      return this.sortedSchema
    },
    sortArr(t) {
      return t.sort((a, b) => {
        const typeA = a[2].toUpperCase()
        const typeB = b[2].toUpperCase()
        if (typeA < typeB) {
          return -1
        }
        if (typeA > typeB) {
          return 1
        }
        return 0
      })
    }
  }
}
</script>
<style>
  .c-header-wrapper__top {
    z-index: 2;
    width: 100%;
    height: 60px;
    position: relative;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(157, 157, 172, 0.16);
}
.c-header-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
}
.c-header-wrapper__top {
    z-index: 2;
    width: 100%;
    height: 60px;
    position: relative;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(157, 157, 172, 0.16);
}


.c-header-wrapper__top-wrapper {
    width: 1140px;
}

.c-header-wrapper__top-wrapper {
    width: 984px;
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.c-header-wrapper__top-left {
    height: 100%;
    flex-shrink: 0;
}
.c-header-wrapper__top-left, .c-header-wrapper__top-middle, .c-header-wrapper__top-right {
    display: flex;
    align-items: center;
}
.c-header-list {
    margin-right: 12px;
    position: relative;
    display: flex;
    height: 100%;
    align-items: center;
}
.c-header-wrapper__top-middle {
    width: 100%;
    height: 100%;
}
</style>
