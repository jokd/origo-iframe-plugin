# origo-iframe-etuna

Ger ett API för att styra delar av Origo inuti en `<iframe>` via https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

### Parametrar för pluginens inställning

- `layerIDField`: Fältet i lagret som används som unikt ID. **Obligatorisk**.
- `maxZoom`: Maximal inzoomningsnivå. **Valfri**.
- `zoomDuration`: Tid (i millisekunder) för att genomföra en zoomning. **Valfri**.
- `allowedOrigins`: En array med strängar för tillåtna ursprung att acceptera meddelanden från. **Valfri**

### Meddelanden

Meddelanden som skickas via postMessage till en Origo-karta med den här pluginen bär ett message som är ett vanligt javascript-objekt med följande egenskaper:
- `command`
- `targetLayer`
samt antingen 
- `filter`
eller
- `ids`

`command` är ett av följande:

- `setFilter` sätt ett eget CQL filter.
- `setVisibleIDs` filtrera så att enbart features vars `layerIDField` matchar ett av idn:a i `ids`.
- `resetFilter` nollställ filtret, visa alla features.
- `zoomTo` zooma till mitten av de features vars `layerIDField` matchar ett av idn:a i `ids`.
- `panTo` panorera till mitten av de features vars `layerIDField` matchar ett av idn:a i `ids`.

Exempelobjekt:
```javascript
const zoomToMessage = {
	command: 'zoomTo',
    	targetLayer: 'sokvyxw_utegym',
	ids: ['uuid4', 'uuid5', 'uuid9']
	}
```

### Exempelinställning:

```html
<script type="text/javascript">
    var origo = Origo('index.json');
    origo.on('load', function (viewer) {
      var origoiframeetuna = Origoiframeetuna({
          layerIDField: "globalId",
          maxZoom: 11,
          zoomDuration: 750,
          allowedOrigins: ["http://localhost:9001", "https://www.somedomain.net"]
      });
      viewer.addComponent(origoiframeetuna);
    });
</script>
```

### Utveckling

1. Clona Origo och detta repo
2. Kör `npm install` i båda repon
3. Kör `npm start` i båda repon
4. Öppna `https://localhost:9001/demo/` i en webbläsare

(om CORS-fel så kan något som följande behövas i Origos tasks/webpack.dev.js:
```javascript
  devServer: {
    static: {
      directory: './'
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
```
)
