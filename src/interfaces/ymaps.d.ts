declare namespace ymaps {
  function ready(callback: () => void | Promise<void>): Promise<void>;

  class Map {
    constructor(element: string | HTMLElement, state: IMapState, options?: IMapOptions);
    geoObjects: geoObject.GeoObjectCollection;
    events: IEventManager;
    destroy(): void;
    getCenter(): number[];
    setCenter(center: number[], zoom?: number, options?: { duration?: number; timingFunction?: string }): Promise<void>;
    getZoom(): number;
    setZoom(zoom: number, options?: { duration?: number }): Promise<void>;
  }

  interface IMapState {
    center: number[];
    zoom: number;
    controls?: string[];
  }

  interface IMapOptions {
    suppressMapOpenBlock?: boolean;
    yandexMapDisablePoiInteractivity?: boolean;
  }

  class Placemark {
    constructor(geometry: number[] | object, properties?: IPlacemarkProperties, options?: IPlacemarkOptions);
    geometry: geometry.Point;
    properties: IDataManager;
    events: IEventManager;
  }

  interface IPlacemarkProperties {
    hintContent?: string;
    balloonContent?: string;
    [key: string]: any;
  }

  interface IPlacemarkOptions {
    preset?: string;
    iconLayout?: string;
    iconImageHref?: string;
    iconImageSize?: number[];
    iconImageOffset?: number[];
    draggable?: boolean;
  }

  interface IEvent<T = object, U = object> {
    get<K extends keyof (T & U)>(name: K): (T & U)[K];
    get(name: string): any;
  }

  interface IMapClickEvent extends IEvent<{ coords: number[] }, { target: Map }> {}


  interface IEventManager<T = object> {
    add<E extends keyof IEventMap>(
      type: E | E[],
      callback: (event: IEventMap[E]) => void,
      context?: object,
      priority?: number
    ): this;
    add(
      type: string | string[],
      callback: (event: IEvent<any, any>) => void,
      context?: object,
      priority?: number
    ): this;
    remove(type: string | string[], callback: (...args: any[]) => any, context?: object, priority?: number): this;
    fire(type: string, event?: object): this;
  }

  interface IEventMap {
    'click': IMapClickEvent;
    'dragend': IEvent;
    // Add other events here as needed
  }

  namespace geoObject {
    class GeoObjectCollection {
      add(child: Placemark | GeoObjectCollection): this;
      remove(child: Placemark | GeoObjectCollection): this;
      removeAll(): this;
      get(index: number): Placemark | GeoObjectCollection;
      getLength(): number;
    }
  }

  namespace geometry {
    class Point {
      constructor(coordinates: number[]);
      getCoordinates(): number[];
      setCoordinates(coordinates: number[]): this;
    }
  }

  interface IDataManager {
    get(path: string, defaultValue?: any): any;
    set(path: string, value: any): this;
  }
}