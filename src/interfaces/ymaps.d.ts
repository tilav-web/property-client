// src/types/yandex-maps.d.ts

declare namespace ymaps {
  interface IEvent<T = any, U = MouseEvent> {
    get(name: 'coords'): [number, number];
    get(name: string): any; // Generic getter for other properties
    preventDefault(): void;
    stopPropagation(): void;
  }

  interface IEventEmitter {
    add(
      event: string | string[],
      handler: (event: IEvent) => void,
      context?: object
    ): this;
    remove(
      event: string | string[],
      handler: (event: IEvent) => void,
      context?: object
    ): this;
    fire(event: string, eventObject?: object): this;
  }

  interface IPointGeometry {
    getType(): 'Point';
    getCoordinates(): [number, number] | null;
    setCoordinates(coordinates: [number, number]): this;
  }

  interface PlacemarkProperties {
    hintContent?: string;
    balloonContent?: string;
    [key: string]: any; // Allow custom properties
  }

  interface PlacemarkOptions {
    preset?: string;
    draggable?: boolean;
    [key: string]: any; // Allow custom options
  }

  interface MapOptions {
    center: [number, number];
    zoom: number;
    controls?: string[];
    type?: string;
    [key: string]: any; // Allow custom options
  }

  interface Placemark extends IEventEmitter {
    geometry: IPointGeometry;
    properties: {
      get(name: 'hintContent'): string | undefined;
      get(name: 'balloonContent'): string | undefined;
      get(name: string): any;
      set(name: 'hintContent', value: string): void;
      set(name: 'balloonContent', value: string): void;
      set(name: string, value: any): void;
    };
  }

  interface Map extends IEventEmitter {
    getCenter(): [number, number];
    getZoom(): number;
    getBounds(): [[number, number], [number, number]] | null;
    setCenter(
      center: [number, number],
      zoom?: number,
      options?: { duration?: number }
    ): Promise<void>;
    setZoom(zoom: number, options?: { duration?: number }): Promise<void>;
    geoObjects: {
      add(object: Placemark): void;
      remove(object: Placemark): void;
    };
    destroy(): void;
  }

  interface YMaps {
    ready(callback: () => void): void;
    Map: {
      new (element: string | HTMLElement, options: MapOptions): Map;
    };
    Placemark: {
      new (geometry: [number, number], properties?: PlacemarkProperties, options?: PlacemarkOptions): Placemark;
    };
    [key: string]: any; // Fallback for other Ymaps properties/methods
  }
}

declare global {
  interface Window {
    ymaps: ymaps.YMaps;
  }
}

export {};
