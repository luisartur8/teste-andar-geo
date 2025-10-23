import { HomePage } from "../home/home.page";
import { Floor } from "../models/floor.model";
import { InfoWindowService } from "./info-window.service";

export class FloorManager {
  map: google.maps.Map;
  floors: Floor[];
  currentFloorIndex: number;

  controlDiv: HTMLDivElement;
  sideBar?: HTMLDivElement;

  controlShapesDiv: HTMLDivElement;
  private deleteShapeBtn!: HTMLButtonElement;

  private editableShape: any = null;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.floors = [
      { name: "T", shapes: { markers: [], circles: [], rectangles: [], polygons: [], polylines: [] } },
    ];
    this.currentFloorIndex = 0;

    // Botão de andares
    this.controlDiv = this.createControlContainer();
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(this.controlDiv);

    // Botão de controle dos shapes
    this.controlShapesDiv = this.createControlShapesDiv();
    this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.controlShapesDiv);
    this.deleteShapeBtn = this.controlShapesDiv.querySelector("button") as HTMLButtonElement;

    this.renderFloors();

    google.maps.event.addListener(this.map, "click", () => this.closeSideBar());

    document.addEventListener("click", (event: MouseEvent) => {
      if (!this.sideBar) return;
      const target = event.target as Node;
      if (this.sideBar.contains(target)) return;
      if (this.controlDiv.contains(target)) return;
      this.closeSideBar();
    });
  }

  private createControlContainer(): HTMLDivElement {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.height = "auto";
    div.style.pointerEvents = "auto";
    div.style.gap = "8px";
    div.style.marginLeft = "10px";
    div.style.padding = "4px";
    div.style.borderRadius = "8px";
    return div;
  }

  private createControlShapesDiv(): HTMLDivElement {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.gap = "8px";
    div.style.marginBottom = "10px";
    div.style.padding = "6px 10px";
    div.style.background = "#fff";
    div.style.border = "2px solid #4CAF50";
    div.style.borderRadius = "12px";
    div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

    // Botão de deletar
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗑 Deletar";
    deleteBtn.style.background = "#ff4d4d";
    deleteBtn.style.color = "#fff";
    deleteBtn.style.border = "none";
    deleteBtn.style.borderRadius = "6px";
    deleteBtn.style.padding = "6px 12px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.fontWeight = "bold";
    deleteBtn.style.display = "none";

    deleteBtn.onclick = () => this.deleteEditableShape();

    div.appendChild(deleteBtn);
    return div;
  }

  private createCircleButton(label: string, bg: string, color: string, border: string): HTMLDivElement {
    const btn = document.createElement("div");
    btn.innerText = label;
    btn.style.width = "40px";
    btn.style.height = "40px";
    btn.style.borderRadius = "50%";
    btn.style.backgroundColor = bg;
    btn.style.color = color;
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.border = border;
    btn.style.fontWeight = "bold";
    return btn;
  }

  renderFloors() {
    this.controlDiv.innerHTML = "";

    this.floors.forEach((floor, index) => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.position = "relative";

      const isActive = index === this.currentFloorIndex;
      const floorBtn = this.createCircleButton(
        floor.name,
        isActive ? "#4CAF50" : "#ffffff",
        isActive ? "#fff" : "#333",
        "2px solid #4CAF50"
      );

      floorBtn.onclick = () => this.handleFloorClick(index, wrapper);

      wrapper.appendChild(floorBtn);
      this.controlDiv.appendChild(wrapper);
    });

    if (HomePage.editMode) {
      const addBtn = this.createCircleButton("+", "#fff", "#4CAF50", "2px solid #4CAF50");
      addBtn.onclick = () => this.addFloor();
      this.controlDiv.appendChild(addBtn);
    }

    this.disableAllShapes();
  }

  private handleFloorClick(index: number, wrapper: HTMLDivElement) {
    if (this.currentFloorIndex === index) {
      this.openFloorSideBar(wrapper, index);
      return;
    }

    this.removeAllShapesFromMap();
    this.currentFloorIndex = index;
    this.renderFloors();
    this.addCurrentFloorShapes();
  }

  private closeSideBar() {
    if (!this.sideBar) return;

    const panel = this.sideBar;
    panel.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    panel.style.transform = "scaleX(0)";
    panel.style.opacity = "0";

    setTimeout(() => {
      panel.remove();
      this.sideBar = undefined;
    }, 300);
  }

  private openFloorSideBar(wrapper: HTMLDivElement, index: number) {
    if (!HomePage.editMode) {
      return;
    }

    if (this.sideBar && this.sideBar.parentElement === wrapper) {
      this.closeSideBar();
      return;
    }

    if (this.sideBar) this.closeSideBar();

    const panel = document.createElement("div");
    panel.style.cssText = `
      position:absolute;left:50px;top:0;
      display:flex;flex-direction:row;align-items:center;gap:6px;
      padding:6px 10px;background:#fff;
      border:2px solid #4CAF50;border-radius:12px;
      box-shadow:0 2px 6px rgba(0,0,0,0.1);
      z-index:100;transform:scaleX(0);transform-origin:left center;
      opacity:0;
    `;

    panel.innerHTML = `
      <div style="width: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;">
          <button class="btn-moveup" ${index === 0 ? "disabled" : ""} style="
            font-size: 13px;
            line-height: 0.6; 
            transform: scaleX(1.5);
            padding: 2px 4px;
            width: fit-content;
            background: #D3D3D3;
            border-width: 1.3px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            margin-bottom: 1px;
            ">∧</button>
          <button class="btn-movedown" ${index === this.floors.length - 1 ? "disabled" : ""} style="
            font-size: 13px;
            display: inline-block;
            padding: 2px 4px;
            width: fit-content;
            background:#D3D3D3;
            border-width: 1.3px;
            line-height: 0.6; 
            transform: scaleX(1.5);
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          ">∨</button>
      </div>
      <button class="btn-remove" style="background:#ff4d4d;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;">🗑</button>
      <button class="btn-duplicate" style="background:#4CAF50;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;">⧉</button>
      <input type="text" class="floor-name" value="${this.floors[index].name}" style="flex:1;border:1px solid #ccc;border-radius:6px;padding:4px 6px;" />
    `;

    wrapper.appendChild(panel);
    this.sideBar = panel;

    setTimeout(() => {
      panel.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      panel.style.transform = "scaleX(1)";
      panel.style.opacity = "1";
    }, 10);

    const btnMoveUp = panel.querySelector(".btn-moveup") as HTMLButtonElement;
    const btnMoveDown = panel.querySelector(".btn-movedown") as HTMLButtonElement;
    const btnRemove = panel.querySelector(".btn-remove") as HTMLButtonElement;
    const btnDuplicate = panel.querySelector(".btn-duplicate") as HTMLButtonElement;
    const inputName = panel.querySelector(".floor-name") as HTMLInputElement;

    btnMoveUp.onclick = () => {
      const arr = this.floors;
      if (index <= 0) return;
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      this.currentFloorIndex -= 1;
      this.renderFloors();
    }

    btnMoveDown.onclick = () => {
      const arr = this.floors;
      if (index >= arr.length - 1) return;
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      this.currentFloorIndex += 1;
      this.renderFloors();
    }

    btnRemove.onclick = () => this.removeFloor(index);

    btnDuplicate.onclick = () => {
      const originalFloor = this.floors[index];
      const clonedName = originalFloor.name[0] + "_copy";

      this.addFloor(clonedName);
      const newFloor = this.floors[this.floors.length - 1];

      const cloneShape = (shapeData: any, type: string) => {
        const original = shapeData.mapObject;
        let newMapObject: any = null;

        const commonOptions: any = {
          map: this.map,
          fillColor: original.get("fillColor") || "#b3b3b3ff",
          fillOpacity: original.get("fillOpacity") || 1,
          strokeColor: original.get("strokeColor") || "#b3b3b3ff",
          strokeOpacity: original.get("strokeOpacity") || 1,
          strokeWeight: original.get("strokeWeight") || 3,
        };

        switch (type) {
          case "markers":
            newMapObject = new google.maps.Marker({
              position: original.getPosition(),
              map: this.map,
              draggable: true,
              icon: original.getIcon(),
              label: original.getLabel()
            });

            google.maps.event.addListener(newMapObject, "click", () => {
              const markerData = newFloor.shapes.markers.find(m => m.mapObject === newMapObject);
              if (!markerData) return;

              InfoWindowService.setFloorManager(this);
              InfoWindowService.open(newMapObject, markerData, HomePage.editMode);
              this.setEditable(newMapObject);
            });
            break;
          case "circles":
            newMapObject = new google.maps.Circle({
              ...commonOptions,
              center: original.getCenter(),
              radius: original.getRadius()
            });
            break;

          case "rectangles":
            newMapObject = new google.maps.Rectangle({
              ...commonOptions,
              bounds: original.getBounds()
            });
            break;

          case "polygons":
            newMapObject = new google.maps.Polygon({
              ...commonOptions,
              paths: original.getPath().getArray()
            });
            break;

          case "polylines":
            newMapObject = new google.maps.Polyline({
              ...commonOptions,
              path: original.getPath().getArray(),
            });
            break;
        }

        google.maps.event.addListener(newMapObject, "click", () => {
          this.setEditable(newMapObject);
        });

        return { ...shapeData, mapObject: newMapObject };
      };

      const orig = originalFloor.shapes;
      newFloor.shapes = {
        markers: orig.markers.map(m => cloneShape(m, "markers")),
        circles: orig.circles.map(c => cloneShape(c, "circles")),
        rectangles: orig.rectangles.map(r => cloneShape(r, "rectangles")),
        polygons: orig.polygons.map(p => cloneShape(p, "polygons")),
        polylines: orig.polylines.map(l => cloneShape(l, "polylines")),
      };

      this.removeAllShapesFromMap();
      this.addCurrentFloorShapes();
    };

    inputName.onchange = () => {
      if (inputName.value.length > 5) {
        this.floors[index].name = inputName.value.slice(0, 6);
      } else {
        this.floors[index].name = inputName.value || this.floors[index].name;
      }
      this.renderFloors();
    };

    inputName.addEventListener("input", () => {
      if (inputName.value.length > 6) {
        inputName.style.color = "red";
      } else {
        inputName.style.color = "";
      }
    });
  }

  private addFloor(name?: string) {
    if (this.floors.length >= 9) {
      alert("Limite de andares atingido");
      return;
    }
    const floorName = name || String(this.floors.length + 1);
    this.floors.push({
      name: floorName,
      shapes: { markers: [], circles: [], rectangles: [], polygons: [], polylines: [] },
    });
    this.currentFloorIndex = this.floors.length - 1;
    this.removeAllShapesFromMap();
    this.renderFloors();
    this.forceCenter(this.controlDiv, false, true);
  }

  private removeFloor(index: number) {
    if (this.floors.length <= 1) {
      alert("Você não pode apagar este andar");
      this.renderFloors();
      return;
    };
    this.removeAllShapesFromMap();
    this.floors.splice(index, 1);
    if (this.currentFloorIndex >= this.floors.length) {
      this.currentFloorIndex = this.floors.length - 1;
    }
    this.addCurrentFloorShapes();
    this.renderFloors();
    this.forceCenter(this.controlDiv, false, true);
  }

  addShapesToCurrentFloor(shapeType: "marker" | "circle" | "rectangle" | "polygon" | "polyline", data: any) {
    this.renderFloors();
    const shapes = this.floors[this.currentFloorIndex].shapes;
    switch (shapeType) {
      case "marker": shapes.markers.push(data); break;
      case "circle": shapes.circles.push(data); break;
      case "rectangle": shapes.rectangles.push(data); break;
      case "polygon": shapes.polygons.push(data); break;
      case "polyline": shapes.polylines.push(data); break;
    }
  }

  private removeAllShapesFromMap() {
    this.floors.forEach(floor => {
      const shapes = floor.shapes;
      shapes.markers.forEach(m => m.mapObject.setMap(null));
      shapes.circles.forEach(c => c.mapObject.setMap(null));
      shapes.rectangles.forEach(r => r.mapObject.setMap(null));
      shapes.polygons.forEach(p => p.mapObject.setMap(null));
      shapes.polylines.forEach(l => l.mapObject.setMap(null));
    });
  }

  private addCurrentFloorShapes() {
    const shapes = this.floors[this.currentFloorIndex].shapes;
    shapes.markers.forEach(m => m.mapObject.setMap(this.map));
    shapes.circles.forEach(c => c.mapObject.setMap(this.map));
    shapes.rectangles.forEach(r => r.mapObject.setMap(this.map));
    shapes.polygons.forEach(p => p.mapObject.setMap(this.map));
    shapes.polylines.forEach(l => l.mapObject.setMap(this.map));
  }

  disableAllShapes() {
    this.floors.forEach(floor => {
      const shapes = floor.shapes;
      shapes.markers.forEach(m => { m.mapObject.setDraggable?.(false); });
      shapes.circles.forEach(c => { c.mapObject.setEditable?.(false); c.mapObject.setDraggable?.(false); });
      shapes.rectangles.forEach(r => { r.mapObject.setEditable?.(false); r.mapObject.setDraggable?.(false); });
      shapes.polygons.forEach(p => { p.mapObject.setEditable?.(false); p.mapObject.setDraggable?.(false); });
      shapes.polylines.forEach(l => { l.mapObject.setEditable?.(false); l.mapObject.setDraggable?.(false); });
    });

    this.editableShape = null;
    this.controlShapesDiv.style.display = "none";
    this.deleteShapeBtn.style.display = "none";
  }

  private deleteEditableShape() {
    if (!this.editableShape) return;

    this.editableShape.setMap(null);

    const shapes = this.floors[this.currentFloorIndex].shapes;
    shapes.markers = shapes.markers.filter(m => m.mapObject !== this.editableShape);
    shapes.circles = shapes.circles.filter(s => s.mapObject !== this.editableShape);
    shapes.rectangles = shapes.rectangles.filter(s => s.mapObject !== this.editableShape);
    shapes.polygons = shapes.polygons.filter(s => s.mapObject !== this.editableShape);
    shapes.polylines = shapes.polylines.filter(s => s.mapObject !== this.editableShape);

    this.editableShape = null;
    this.controlShapesDiv.style.display = "none";
    this.deleteShapeBtn.style.display = "none";
  }

  setEditable(shape: any) {
    this.disableAllShapes();

    if (shape instanceof google.maps.Marker) {
      shape.setDraggable(true);
    } else if (shape.setEditable) {
      shape.setEditable(true);
      shape.setDraggable(true);
    }

    this.editableShape = shape;

    if (this.editableShape) {
      this.deleteShapeBtn.style.display = "block";
      this.controlShapesDiv.style.display = "flex";
    }

    this.forceCenter(this.controlShapesDiv, true, false);
  }

  private forceCenter(div: HTMLDivElement, horizontal: boolean, vertical: boolean) {
    if (!div) return;

    const mapDiv = this.map.getDiv() as HTMLDivElement;

    if (horizontal) {
      const mapWidth = mapDiv.offsetWidth;
      const divWidth = div.offsetWidth;
      div.style.left = `${(mapWidth - divWidth) / 2}px`;
    }

    if (vertical) {
      const mapHeight = mapDiv.offsetHeight;
      const divHeight = div.offsetHeight;
      div.style.top = `${(mapHeight - divHeight) / 2}px`;
    }
  }

  setMarkerData(marker: google.maps.Marker, data: Partial<{ centered: boolean, zoom: number, icon: number, name: string, description: string }>) {
    const floor = this.floors[this.currentFloorIndex];
    const markerData = floor.shapes.markers.find(m => m.mapObject === marker);
    if (!markerData) return;

    if (data.centered) {
      floor.shapes.markers.forEach(m => {
        if (m.mapObject !== marker) {
          m.centered = false;
          InfoWindowService.setMarkerIcon(m.mapObject, m.name, m.icon);
        }
      });

      InfoWindowService.setMarkerIcon(marker, "Centro", 0, true);
    } else {
      InfoWindowService.setMarkerIcon(marker, data.name ?? "Centro", data.icon ?? 0, !Boolean(data.name));
    }

    if (data.centered !== undefined) markerData.centered = data.centered;
    if (data.zoom !== undefined) markerData.zoom = data.zoom;
    if (data.name !== undefined) markerData.name = data.name;
    if (data.description !== undefined) markerData.description = data.description;
  }
}
