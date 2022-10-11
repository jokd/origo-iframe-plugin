import Origo from 'Origo';
import GeoJSON from 'ol/format/GeoJSON';
import {boundingExtent, getCenter} from 'ol/extent';

/**
 * @param {{ layerIDField: string, maxZoom: number=, zoomDuration: number= }} options
 */
const Origoiframeetuna = function Origoiframeetuna(options = {}) {
  const {layerIDField, maxZoom, zoomDuration, allowedOrigins} = options;

  let viewer;

  /** @type string|undefined */
  let cqlFilter;

  /**
   * Apply the current filter (from `cqlFilter`) to the layer
   */
  function applyFiltering(targetLayer) {
    const layer = viewer.getLayer(targetLayer);
    if (layer.get('type') === 'WMS') {
      layer.getSource().updateParams({CQL_FILTER: cqlFilter});
    } else {
      console.warn('Layer of type', layer.get('type'), 'is not supported for iframe filtering');
    }
  }

  /**
   * Format ids with single quotation marks
   *
   * @param {String[]} ids
   * @returns {String[]}
   */
  function getFilterIds(ids) {
    if (ids.length === 0) return "''";
    const newArray = ids.map(id => `'${id}'`);
    return newArray.join();
  }

  /**
   * Retrieve matching features from a WFS service
   *
   * @param {URL} url
   * @param {String[]} ids
   * @returns {Promise<import("ol/Feature").default[]>}
   */
  function getFeaturesFromWFS(targetLayer, url, ids) {
    url.searchParams.set('service', 'WFS');
    url.searchParams.set('version', '1.1.1');
    url.searchParams.set('request', 'GetFeature');
    url.searchParams.set('outputFormat', 'application/json');
    url.searchParams.set('typeNames', targetLayer);
    url.searchParams.set('cql_filter', `${layerIDField} in (${getFilterIds(ids)})`);

    return fetch(url.toString())
      .then(res => res.json())
      .then(data => new GeoJSON().readFeatures(data));
  }

  /**
   * Retrieve features that match the specified ids
   * @param {String[]} ids
   * @returns {Promise<import("ol/Feature").default[]>}
   */
  function getFeatures(targetLayer, ids) {
    const layer = viewer.getLayer(targetLayer);
    if (layer.get('type') === 'WMS') {
      // this works for geoserver, but might not for others
      const source = layer.getSource();
      const url = new URL(
        typeof source.getUrl === 'function' ? source.getUrl() : source.getUrls()[0]
      );
      url.pathname = url.pathname.replace('wms', 'wfs');
      return getFeaturesFromWFS(targetLayer, url, ids);
    }
    /*  
    if (layer.get('type') === 'WFS') {
      // warning: code path not tested
      // best case - we already have the feature
      // may be relevant pending further evalution
      const feature = layer
        .getSource()
        .getFeatures()
        .find(f => f.get(layerIDField) === id);
      if (feature) {
        return Promise.resolve(feature);
      }
      // otherwise, we need to fetch it
      return getFeatureFromWFS(new URL(layer.getSource().getUrl()), id);
    } */
    throw new Error(
      `Layer of type ${layer.get('type')} is not supported for iframe feature pan/zoom`
    );
  }

  return Origo.ui.Component({
    name: 'origoiframeetuna',
    onInit() {
      window.addEventListener('message', event => {
        if (allowedOrigins) {
          if (!allowedOrigins.some(origin => origin === event.origin)) return;
        }

        const {command, targetLayer, ids, filter} = event.data;
        if (!command || !targetLayer) {
          console.warn(
            'An object with a command, targetLayer as well as either ids or filter property is required.'
          );
          return;
        }
        if (command === 'setFilter' && !filter) {
          console.warn('An object with the setFilter command needs a filter property too.');
          return;
        }
        if (command !== 'setFilter' && command !== 'resetFilter' && !ids) {
          console.warn(
            'An object with a panToo, zoomTo or setVisibleIDs command needs an ids property too.'
          );
          return;
        }

        if (command === 'setFilter') {
          // command to set a raw CQL query
          cqlFilter = filter;
          applyFiltering(targetLayer);
        } else if (command === 'setVisibleIDs') {
          // command to filter by the ID field
          cqlFilter = `${layerIDField} in (${getFilterIds(ids)})`;
          applyFiltering(targetLayer);
        } else if (command === 'resetFilter') {
          // command to reset the filter, showing all features
          cqlFilter = undefined;
          applyFiltering(targetLayer);
        } else if (command === 'panTo') {
          // command to pan to an array of features. If they do not fit inside the view then they do not fit inside the view.
          getFeatures(targetLayer, ids).then(featureArray => {
            const coordinateArray = featureArray.map(feature =>
              feature.getGeometry().getFirstCoordinate()
            );
            viewer
              .getMap()
              .getView()
              .setCenter(getCenter(boundingExtent(coordinateArray)));
          });
        } else if (command === 'zoomTo') {
          // command to zoom to a an array of features
          getFeatures(targetLayer, ids).then(featureArray => {
            const coordinateArray = featureArray.map(feature =>
              feature.getGeometry().getFirstCoordinate()
            );
            viewer
              .getMap()
              .getView()
              .fit(boundingExtent(coordinateArray), {
                maxZoom,
                duration: zoomDuration,
                padding: [20, 20, 20, 20],
              });
          });
        } else {
          console.warn(
            'Received a message with an invalid command. Expected setFilter|setVisibleIDs|resetFilter|panTo|zoomTo.'
          );
        }
      });
    },
    onAdd(evt) {
      viewer = evt.target;

      // in case the layer gets added _after_ we have received a message
      viewer
        .getMap()
        .getLayers()
        .on('add', async ({element}) => {
          if (element.get('name')) {
            applyFiltering();
          }
        });
    },
    render() {
      // no-op
    },
  });
};

export default Origoiframeetuna;
