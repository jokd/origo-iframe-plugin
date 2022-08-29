# origo-iframe-etuna

Ger ett API för att styra delar av Origo inuti en `<iframe>`.

### Parametrar

- `layerName`: Det lager som "styrs". **Obligatorisk**.
- `layerIDField`: Fältet i lagret som används som unikt ID. **Obligatorisk**.
- `maxZoom`: Maximal inzoomningsnivå. **Valfri**.
- `zoomDuration`: Tid (i millisekunder) för att genomföra en zoomning. **Valfri**.

### Meddelanden

- `setFilter:<cql>`: Sätt ett eget CQL filter.
- `setVisibleIDs:<id1>,<id2>,...,<idn>`: Filtrera så att enbart features vars `layerIDField` har något av dessa värden visas.
- `resetFilter`: Nollställ filtret, visa alla features.
- `zoomTo:<id1>,<id2>,...,<idn>`: Zooma till mitten av de features vars `layerIDField` matchar ett `<id>`.
- `panTo:<id1>,<id2>,...,<idn>`: Panorera till mitten av de features vars `layerIDField` matchar ett `<id>`.

### Exempel

```html
<script type="text/javascript">
    var origo = Origo('index.json');
    origo.on('load', function (viewer) {
      var origoiframeetuna = Origoiframeetuna({
          layerName: "sokvyx_park_park_lekplats",
          layerIDField: "sokid",
          maxZoom: 11,
          zoomDuration: 750
      });
      viewer.addComponent(origoiframeetuna);
    });
</script>
```

### Utveckling

1. Clona Origo och detta repo
2. Kör `npm install` i båda repon
3. Kör `npm start` i båda repon
4. Öppna `https://localhost:9010/demo/` i en webbläsare
