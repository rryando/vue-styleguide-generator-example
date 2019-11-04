<template>
  <div id="styleguide-showcase">
    <template v-if="activeComponent.type !== 'default'">
      <div class="c-panel u-mrgn-bottom--2">
        <div class="c-panel__head u-bg--white"><span class="c-icon c-icon--chevron-left" style="font-size: 24px;cursor:pointer;" @click="setActiveByEntryId(activeComponent.entryId -1)"></span><b class="u-txt--large u-mrgn-left--2 u-mrgn-right--2">{{activeComponent.name}}</b>
          <div class="c-label u-mrgn-right--1 c-label--yellow">{{activeComponent.status}}</div><span class="c-icon c-icon--chevron-right" style="font-size: 24px;cursor:pointer;" @click="setActiveByEntryId(activeComponent.entryId +1)"></span>
          <div class="u-float-right">
            <div class="c-label u-mrgn-right--1" :class="typeClass(activeComponent.type)">{{activeComponent.type}}</div>
          </div>
        </div>
        <div class="c-panel__body u-width-1 u-pad--0">
          <div class="o-layout o-layout--responsive">
            <div class="o-layout__item u-8of12 component-preview">
              <div class="u-pad--4">
                <div class="u-mrgn-bottom--4"><span class="c-separator__text" style="position: sticky;left:16px;">Component Preview |<em>Relative Container with padding 12px</em></span></div>
                <div class="u-pad--2 blueprint-preview">
                  <component :is="currentComponent" v-bind="appliedVar"></component>
                </div>
              </div>
            </div>
            <div class="o-layout__item u-4of12 component-preview component-variant"><span>{{component.alt}}</span>
              <div class="u-pad--2">
                <div class="c-separator c-separator--left u-mrgn-bottom--4"><span class="c-separator__text">Component Tree</span></div>
                <div v-for="(c, key) in activeComponent.child"><span class="c-icon c-icon--chevron-right"></span><a @click="setActiveByName(key)">{{key}}</a>
                  <div class="u-pad-left--2" v-if="c.components" v-for="(child, childKey) in  c.components"><span class="c-icon c-icon--chevron-right"></span><a @click="setActiveByName(childKey)">{{childKey}}</a></div>
                </div>
              </div>
              <div class="u-pad--2">
                <div class="c-separator c-separator--left u-mrgn-bottom--4"><span class="c-separator__text">props</span></div>
                <div class="u-mrgn-top--3" v-for="(props, id) in variant">
                  <div class="c-btn-group u-mrgn-top--2 u-mrgn-btm--3"></div>
                  <template v-if="Array.isArray(props) || typeof props === 'Object'"><strong class="label u-mrgn-bottom--1">[{{props}}] {{id}}: {{appliedVar[id] || 'default' }}</strong>
                    <button class="u-mrgn-right--1 u-mrgn-bottom--1 c-btn c-btn--small c-btn--pill" @click="setProps(id, null)">default</button>
                    <button class="u-mrgn-right--1 u-mrgn-bottom--1 c-btn c-btn--pill c-btn--small" v-for="value in props" @click="setProps(id, value)">{{value}}</button>
                  </template>
                  <template v-if="props === 'Boolean'">
                    <div class="label u-mrgn-bottom--1"><strong>[{{props}}] {{id}}: {{String(appliedVar[id]) || 'default' }}</strong></div>
                    <button class="c-btn c-btn--small u-mrgn-right--1 u-mrgn-bottom--1 c-btn--pill" @click="setProps(id, null)">default</button>
                    <button class="c-btn c-btn--small u-mrgn-right--1 u-mrgn-bottom--1 c-btn--pill" @click="setProps(id, true)">true</button>
                    <button class="c-btn c-btn--small u-mrgn-right--1 u-mrgn-bottom--1 c-btn--pill" @click="setProps(id, false)">false</button>
                  </template>
                  <template v-if="props === 'String' || props === 'Number'"><strong class="u-mrgn-bottom--1">[{{props}}] {{id}}: {{appliedVar[id] || 'default' }}</strong>
                    <input type="text" placeholder="Type Text Here" @keyup.enter="submitProps" :id="id" />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else="v-else"></template>
    <div class="u-width-1 u-display-inline-block">
      <div class="u-mrgn-top--2">
        <div class="c-separator__text u-mrgn-bottom--1">Import Info (click to copy)</div>
        <pre class="u-bg--sand-dark u-pad--3" v-if="componentFromQuery"><code @click="copyText(`import ${componentFromQuery.name} from '~/components/${componentFromQuery.path}';`)">import {{componentFromQuery.name}} from '~/components/{{componentFromQuery.path}}';</code></pre>
      </div>
    </div>
    <div class="u-width-1 u-display-inline-block">
      <div class="u-mrgn-top--2">
        <div class="c-separator__text u-mrgn-bottom--1">template code</div>
        <pre class="u-bg--sand-dark u-pad--3" v-if="componentFromQuery"><code ref="templateCode" @click="copyText($refs.templateCode.innerText)">{{componentFromQuery.name}}(<span v-for="(props, id) in variant">
            <template v-if="appliedVar[id]">{{lazyClipboardBuilder(props, id)}}</template></span><span>)</span></code></pre>
      </div>
    </div>
  </div>
</template>
<script>
import DocsMixin from './mixins/DocsMixin'
/* eslint-disable */
export default {
  mixins: [DocsMixin],
  data() {
    return {
      basePath: '../../',
      isTriggered: this.triggerChange,
      component: {
        entry_id: 0,
        type: 'default',
        component_name: 'default',
        path: '~/app/Docs',
        platform: 'default',
        desc: 'default'
      },
      currentComponent: '',
      relatedEntry: [],
      variant: {},
      appliedVar: {}
    }
  },
  computed: {
    componentFromQuery() {
      return this.$route.query.component ? JSON.parse(this.$route.query.component) : null
    },
    activeComponent() {
      if (this.componentFromQuery) {
        return this.componentFromQuery
      }
      return {
        variant: {},
        entry_id: 0,
        type: 'default',
        component_name: 'default',
        path: '~/app/Docs',
        platform: 'default',
        desc: 'default'
      }
    },
    activeComponentVariant() {
      const currentProps = this.activeComponent.props
      const variant = {}
      for (const i in currentProps) {
        variant[i] = currentProps[i].type.name
      }
      return variant
    },
    branchInfo() {
      return {
        author: this.activeComponent.asignee,
        branch: this.activeComponent.branch,
        component: this.activeComponent.name
      }
    }
  },
  watch: {
    /* eslint-disable func-names */
    '$route.query': function () {
      this.loadNewComponent()
    }
  },
  mounted() {
    this.loadNewComponent()
    document.addEventListener('keyup', this.navigateComponent)
  },
  destroyed() {
    document.removeEventListener('keyup', this.navigateComponent)
  },
  methods: {
    loadNewComponent() {
      this.currentComponent = () =>
        import(`../../${this.activeComponent.path}`).then((res) => {
          this.component = { ...this.activeComponent }
          if (res.default) {
            this.activeComponent.props = res.default.props
            this.activeComponent.child = res.default.components
            this.activeComponent.status = res.default.status ? res.default.status : 'in development'
          }
          this.variant = this.activeComponentVariant
          
          return res.default
        })
    },
    setProps(n, v) {
      this.appliedVar[n] = v
      this.loadNewComponent()
    },
    changeTextVariant(ev, name) {
      const val = name === 'number' ? parseInt(ev.target.value, 10) : ev.target.value
      this.component.props[name] = val
    },
    submitProps(e) {
      const inputVal = e.target.value
      const id = e.target.id
      this.setProps(id, inputVal)
    },
    copyText(text) {
      const aux = document.createElement('input')
      // Assign it the value of the specified element
      aux.setAttribute('value', text)
      // Append it to the body
      document.body.appendChild(aux)
      // Highlight its content
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
    },
    lazyClipboardBuilder(props, id) {
      const altString =
        props === 'String' ? `${id}="${this.appliedVar[id]}" ` : `:${id}="${this.appliedVar[id]}" `
      return altString
    },
    navigateComponent(event) {
      if (event.code === 'ArrowLeft') {
        this.setActiveByEntryId(this.activeComponent.entryId - 1)
      } else if (event.code === 'ArrowRight') {
        this.setActiveByEntryId(this.activeComponent.entryId + 1)
      }
    },
  }
}
</script>
<style>
.component-preview {
  overflow-y: scroll;
  max-height: 720px;
}

.bg-blueprint {
  background-color: #eee;
  background-image:
    linear-gradient(white 2px, transparent 2px),
    linear-gradient(90deg, white 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
}

.blueprint-preview {
  min-width: 550px;
  min-height: 400px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.05);
}

.component-variant {
  background-color: #fff;
  height: 500px;
  overflow: auto;
}

input {
    padding: 0 12px;
    height: 36px;
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    -webkit-transition: border .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;
    transition: border .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;
    transition: border .2s ease-in-out,box-shadow .2s ease-in-out;
    transition: border .2s ease-in-out,box-shadow .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;
    border: 1px solid #ddd;
    background-color: #fff;
    clear: both;
    overflow: visible;
    width: 100%;
    color: #333;
    border-radius: 2px;
    outline: none;
    font-family: inherit;
    letter-spacing: normal;
}
</style>
