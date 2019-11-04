import * as schema from '../schema/data.json'

/* eslint-disable no-console */
const DocsMixin = {
  data() {
    return {
      typeList: [
        { name: 'atoms', col: '' },
        { name: 'molecules', col: 'c-label--green' },
        { name: 'organisms', col: 'c-label--yellow' },
        { name: 'templates', col: 'c-label--pink' },
        { name: 'pages', col: 'c-label--red' },
        { name: 'compounds', col: 'c-label--red' }
      ]
    }
  },
  methods: {
    typeClass(c) {
      const x = this.typeList
      const isFound = x.find(y => c.toLowerCase() === y.name)
      if (isFound) {
        return isFound.col
      }
      return false
    },
    schemaMapper(c) {
      return {
        entryId: c[0],
        path: c[1],
        type: c[2],
        name: c[3],
        desc: c[4],
        platform: c[5],
        templateState: c[6],
        uiState: c[7],
        reviewState: c[8],
        qaState: c[9],
        progress: c[10],
        devState: c[11],
        asignee: c[12],
        isModified: c[14],
        branch: c[13],
        // UIPrLink: c[15],
        // FEPrLink: c[16],
        devType: c[16],
        bugList: c[17]
      }
    },
    setActiveComponent(c) {
      this.selectedComponent = this.schemaMapper(c)
      this.$router.push({
        name: this.$route.name,
        query: { component: JSON.stringify(this.selectedComponent) },
        params: { component: JSON.stringify(this.selectedComponent) }
      })
    },
    setActiveByName(cName) {
      const findEntry = schema.default.find(y => cName === y[3])
      if (findEntry.length) {
        return this.setActiveComponent(findEntry)
      }
    },
    setActiveByEntryId(entryId) {
      const findEntry = schema.default.find(y => entryId === y[0])
      if (findEntry.length) {
        return this.setActiveComponent(findEntry)
      }
    }
  }
}

export default DocsMixin
