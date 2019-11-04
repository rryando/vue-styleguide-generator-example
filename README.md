# vue-styleguide-generator-example

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Go To the playground
```
http://localhost:8080/
```

### Rebuild styleguide Data 
```
node ./styleguide/Docs/generator.js
```

### Hot Reload styleguide-generator
add the folowing line to your webpack config
```
// Run schema generator on save
  config.plugins.push(new webpack.WatchIgnorePlugin([/(styleguide)\/Docs\/schema\/data.json/]))

  config.plugins.push({
    apply: (compiler) => {
      compiler.hooks.beforeCompile.tap('generateDocs', (compilation, cb) => {
        exec('node ./styleguide/Docs/generator.js')
      })
    }
  })
```

### Customize custom component folder
modify the folowing line on `styleguide/styleguide.config.js`
```
componentFolderPath: ['src']
```
