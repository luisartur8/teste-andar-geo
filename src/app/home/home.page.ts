import { AfterViewInit, Component } from '@angular/core';
import { GoogleMapsLoader } from '../services/google-maps-loader.service';
import { FloorManager } from '../services/floor-manager.service';
import { cleanMapStyle, iconColors, testeFloorShapes } from '../utils/map-style';
import { InfoWindowService } from '../services/info-window.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements AfterViewInit {
  map!: google.maps.Map;
  floorManager!: FloorManager;
  static editMode: boolean = true;

  constructor(private mapsLoader: GoogleMapsLoader) { }

  async ngAfterViewInit() {
    await this.mapsLoader.load();
    this.initMap();
    if (HomePage.editMode) {
      this.initDrawing();
    }
    this.floorManager = new FloorManager(this.map);
    this.floorManager.insertMapShapes(testeFloorShapes);
  }

  private initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -28.6720, lng: -49.3733 },
      zoom: 20,
      minZoom: HomePage.editMode ? undefined : 19,
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      styles: cleanMapStyle,
      // restriction: HomePage.editMode ? undefined : {
      //   latLngBounds: {
      //     north: -28.6718,
      //     south: -28.6722,
      //     east: -49.3731,
      //     west: -49.3735
      //   },
      //   strictBounds: true
      // }
    }

    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);

    this.addBuildingOverlay();
  }

  private addBuildingOverlay(): void {
    if (!this.map) return;

    const imageBounds = {
      north: -28.6718,
      south: -28.6722,
      east: -49.3731,
      west: -49.3735
    };

    const overlay = new google.maps.GroundOverlay(
      // "https://img.freepik.com/fotos-gratis/closeup-tiro-de-uma-linda-borboleta-com-texturas-interessantes-em-uma-flor-de-petalas-de-laranja_181624-7640.jpg?semt=ais_hybrid&w=740&q=80",
      "./assets/WC_1.png",
      imageBounds
    );

    overlay.setMap(this.map);
  }

  private initDrawing(): void {
    const map = this.map;
    const OverlayType = google.maps.drawing.OverlayType;

    const drawingManager = new google.maps.drawing.DrawingManager({
      map,
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [OverlayType.MARKER, OverlayType.CIRCLE, OverlayType.POLYGON, OverlayType.POLYLINE, OverlayType.RECTANGLE]
      },
      markerOptions: {
        draggable: HomePage.editMode,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z",
          fillColor: iconColors[1],
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
          scale: 1.5,
          anchor: new google.maps.Point(12, 24),
          labelOrigin: new google.maps.Point(12, 34)
        },
        label: {
          text: "Novo Marcador",
          color: "black",
          fontSize: "12px",
          fontWeight: "bold"
        }
      },
      circleOptions: this.getDefaultShapeStyle(),
      rectangleOptions: this.getDefaultShapeStyle(),
      polygonOptions: this.getDefaultShapeStyle(),
      polylineOptions: this.getDefaultShapeStyle()
    });

    drawingManager.addListener("drawingmode_changed", () => {
      this.floorManager.disableAllShapes();
      this.floorManager.renderFloors();
      InfoWindowService.close();
    });

    google.maps.event.addListener(this.map, "click", () => {
      this.floorManager.disableAllShapes();
      this.floorManager.renderFloors();
      InfoWindowService.close();
    });

    google.maps.event.addListener(drawingManager, "markercomplete", (marker: google.maps.Marker) => {
      this.floorManager.addShapesToCurrentFloor("marker", { mapObject: marker, centered: false, zoom: 20, icon: 1, name: "Novo Marcador", description: "" });
      this.floorManager.setEditable(marker);

      google.maps.event.addListener(marker, "click", () => {
        const markerData = this.floorManager.floors[this.floorManager.currentFloorIndex].shapes.markers
          .find(m => m.mapObject === marker);

        if (!markerData) return;

        InfoWindowService.setFloorManager(this.floorManager);
        InfoWindowService.open(marker, markerData, HomePage.editMode);

        this.floorManager.setEditable(marker);
      });
    });

    google.maps.event.addListener(drawingManager, "circlecomplete", (circle: google.maps.Circle) => {
      this.floorManager.addShapesToCurrentFloor("circle", { mapObject: circle });

      this.floorManager.setEditable(circle);

      google.maps.event.addListener(circle, "click", () => {
        this.floorManager.setEditable(circle);
      });
    });

    google.maps.event.addListener(drawingManager, "rectanglecomplete", (rectangle: google.maps.Rectangle) => {
      this.floorManager.addShapesToCurrentFloor("rectangle", { mapObject: rectangle });

      this.floorManager.setEditable(rectangle);

      google.maps.event.addListener(rectangle, "click", () => {
        this.floorManager.setEditable(rectangle);
      });
    });

    google.maps.event.addListener(drawingManager, "polygoncomplete", (polygon: google.maps.Polygon) => {
      this.floorManager.addShapesToCurrentFloor("polygon", { mapObject: polygon });

      this.floorManager.setEditable(polygon);

      google.maps.event.addListener(polygon, "click", () => {
        this.floorManager.setEditable(polygon);
      });
    });

    google.maps.event.addListener(drawingManager, "polylinecomplete", (polyline: google.maps.Polyline) => {
      this.floorManager.addShapesToCurrentFloor("polyline", { mapObject: polyline });

      this.floorManager.setEditable(polyline);

      google.maps.event.addListener(polyline, "click", () => {
        this.floorManager.setEditable(polyline);
      });
    });
  }

  private getDefaultShapeStyle() {
    return {
      fillColor: "#b3b3b3ff",
      fillOpacity: 1,
      strokeColor: "#b3b3b3ff",
      strokeOpacity: 1,
      strokeWeight: 3
    };
  }
}