<template>
  <div class="c-panel u-mrgn-bottom--8">
    <div class="c-panel__head u-pad--2">
      <div class="u-txt--bold u-txt--fair">Component List</div>
    </div>
    <div class="c-panel__body u-pad--0 component-preview">
      <ul class="c-list-ui c-list-ui--link u-pad--2">
        <li class="lic-list-ui__item u-pad-left--0" v-for="c in sortedSchema" v-if="sortedSchema.length &gt; 0">
          <div class="c-label" :class="typeClass(schemaMapper(c).type)">{{schemaMapper(c).type}}</div><a class="u-mrgn-left--1 c-list-ui__link" @click="setActiveComponent(c)">{{schemaMapper(c).name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as data from './schema/data.json'
import DocsMixin from './mixins/DocsMixin'

export default {
  mixins: [DocsMixin],
  data() {
    return {
      defaultSchema: {
        entryId: 0,
        path: '~',
        type: 'default',
        name: 'default',
        desc: '',
        platform: 'default',
        templateState: 'default',
        uiState: null,
        reviewState: null,
        qaState: null,
        progress: null,
        devState: null,
        asignee: null,
        isModified: null,
        timestamp: null
      },
      componentSchema: data.default,
      sortedSchema: null,
      selectedComponent: {}
    }
  },
  mounted() {
    this.sortedSchema = this.sortArr(this.componentSchema)
  },
  methods: {
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
