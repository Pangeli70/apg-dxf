/** -----------------------------------------------------------------------
 * @module [DXF]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */
import {
  Apg2DLine,
  Apg2DPoint
} from '../../../2D/mod.ts';

import { ApgDxfAngularDim } from "./ApgDxfAngularDim.ts";
import { ApgDxfArc } from "./ApgDxfArc.ts";
import { ApgDxfArcDim } from "./ApgDxfArcDim.ts";
import { ApgDxfCircle } from "./ApgDxfCircle.ts";
import { ApgDxfDimStyle } from "./ApgDxfDimStyle.ts";
import { ApgDxfLayer } from "./ApgDxfLayer.ts";
import { ApgDxfLine } from "./ApgDxfLine.ts";
import { ApgDxfLinearDim } from "./ApgDxfLinearDim.ts";
import { ApgDxfLineStyle } from "./ApgDxfLineStyle.ts";
import { ApgDxfPoint } from "./ApgDxfPoint.ts";
import { ApgDxfPolyline } from "./ApgDxfPolyline.ts";
import { ApgDxfText } from "./ApgDxfText.ts";

import { eApgDxfDftLayers } from "../enums/eApgDxfDftLayers.ts";
import { eApgDxfDftLineStyles } from "../enums/eApgDxfDftLineStyles.ts";
import { eApgDxfDimensionTypes } from "../enums/eApgDxfDimensionTypes.ts";
import { eApgDxfStdColors } from "../enums/eApgDxfStdColors.ts";

import { IApgDxfLayer } from '../interfaces/IApgDxfLayer.ts';

/**
 * Drawing
 */
export class ApgDxfDrawing {

  static STD_LINE_TYPES =
    [
      {
        name: eApgDxfDftLineStyles.CONTINUOUS, description: '______', elements: []
      },
      {
        name: eApgDxfDftLineStyles.DASHED_1, description: '_ _ _ ', elements: [1.0, -1.0]
      },
      {
        name: eApgDxfDftLineStyles.DASHED_5, description: '_ _ _ ', elements: [5.0, -5.0]
      },
      {
        name: eApgDxfDftLineStyles.DOTTED_1, description: '. . . ', elements: [0.0, -1.0]
      },
      {
        name: eApgDxfDftLineStyles.DOTTED_5, description: '. . . ', elements: [0.0, -5.0]
      },
      {
        name: eApgDxfDftLineStyles.DASHED_DOTTED_1, description: '_ . _ ', elements: [1.0, -1.0, 0.0, -1.0]
      },
      {
        name: eApgDxfDftLineStyles.DASHED_DOTTED_5, description: '_ . _ ', elements: [5.0, -5.0, 0.0, -5.0]
      }
    ];

  static STD_LAYERS: IApgDxfLayer[] = [
    {
      name: eApgDxfDftLayers.ZERO,
      colorNumber: eApgDxfStdColors.WHITE,
      lineStyleName: eApgDxfDftLineStyles.CONTINUOUS
    }
  ];

  lineStyles: { [name: string]: ApgDxfLineStyle } = {};

  layers: { [name: string]: ApgDxfLayer } = {};

  dimStyles: { [name: string]: ApgDxfDimStyle } = {};


  activeLayer: ApgDxfLayer;


  constructor(defaults = true) {

    if (defaults) {
      this._addDefaultLineStyles();
      this._addDefaultLayers();
    }
    this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];

  }


  private _addDefaultLayers() {
    for (let i = 0; i < ApgDxfDrawing.STD_LAYERS.length; ++i) {
      this.newLayer(
        ApgDxfDrawing.STD_LAYERS[i].name,
        ApgDxfDrawing.STD_LAYERS[i].colorNumber,
        ApgDxfDrawing.STD_LAYERS[i].lineStyleName
      );
    }
  }


  private _addDefaultLineStyles() {

    for (let i = 1; i < ApgDxfDrawing.STD_LINE_TYPES.length; ++i) {
      this.addLineStyle(
        ApgDxfDrawing.STD_LINE_TYPES[i].name,
        ApgDxfDrawing.STD_LINE_TYPES[i].description,
        ApgDxfDrawing.STD_LINE_TYPES[i].elements
      );
    }

  }


  /**
   * @param name
   * @param description
   * @param elements val > 0 => line, val < 0  => gap, val == 0.0 => dot
   */
  addLineStyle(name: string, description: string, elements: number[]) {

    this.lineStyles[name] = new ApgDxfLineStyle(name, description, elements);
    return this;

  }


  newLayer(name: string, colorNumber: eApgDxfStdColors, lineStyleName: string) {

    this.layers[name] = new ApgDxfLayer(name, colorNumber, lineStyleName);
    return this;

  }


  setLayer(name: string) {

    if (this.layers[name]) {
      this.activeLayer = this.layers[name];
    }
    return this;

  }


  addDimStyle(name: string, dimStyleName: string) {

    this.dimStyles[name] = new ApgDxfDimStyle(name, dimStyleName);
    // @todo_9 fill this mockup
    return this;

  }


  drawLine(x1: number, y1: number, x2: number, y2: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const shape = new ApgDxfLine(this.activeLayer, x1, y1, x2, y2,)
    this.activeLayer.addShape(shape);
    return this;

  }


  drawPoint(x1: number, y1: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const shape = new ApgDxfPoint(this.activeLayer, x1, y1)
    this.activeLayer.addShape(shape);
    return this;

  }


  /**
   * @param x1 x first point
   * @param y1 y first point
   * @param x2 x second point
   * @param y2 y second point
   */
  drawRect(x1: number, y1: number, x2: number, y2: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }

    const shape1 = new ApgDxfLine(this.activeLayer, x1, y1, x2, y1)
    this.activeLayer.addShape(shape1);
    
    const shape2 = new ApgDxfLine(this.activeLayer, x1, y2, x2, y2)
    this.activeLayer.addShape(shape2);

    const shape3 = new ApgDxfLine(this.activeLayer, x1, y1, x1, y2)
    this.activeLayer.addShape(shape3);

    const shape4 = new ApgDxfLine(this.activeLayer, x2, y1, x2, y2)
    this.activeLayer.addShape(shape4);
    return this;
  }


  /**
   * @param x Center x
   * @param y Center y
   * @param r Radius
   * @param startAngle Degrees (0-360)
   * @param endAngle Degrees (0-360)
   */
  drawArc(x: number, y: number, r: number, startAngle: number, endAngle: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const shape = new ApgDxfArc(this.activeLayer, x, y, r, startAngle, endAngle)
    this.activeLayer.addShape(shape);
    return this;

  }


  /**
   * @param x Center x
   * @param y Center y
   * @param r Radius
   */
  drawCircle(x: number, y: number, r: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const shape = new ApgDxfCircle(this.activeLayer, x, y, r);
    this.activeLayer.addShape(shape);
    return this;

  }


  /**
   * @param x x
   * @param y y
   * @param height Text height
   * @param rotation Text rotation
   * @param value the string itself
   */
  drawText(x: number, y: number, height: number, rotation: number, value: string) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const shape = new ApgDxfText(this.activeLayer, x, y, height, rotation, value);
    this.activeLayer.addShape(shape);
    return this;

  }


  /**
   * @param points - Matrix of points [ [x1, y1], [x2, y2]... ]
   */
  drawPolyline(points: number[][]) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const shape = new ApgDxfPolyline(this.activeLayer, points)
    this.activeLayer.addShape(shape);
    return this;

  }


  drawRotatedDim(x1: number, y1: number, x2: number, y2: number, d: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const points: number[][] = [];

    points.push([x1, y1]);
    points.push([x2, y2]);

    const p1 = new Apg2DPoint(x1, y1);
    const p2 = new Apg2DPoint(x2, y2);
    const l = new Apg2DLine(p1, p2);

    const ladderPerp = l.Perpendicular(p2);
    const ladderP = ladderPerp.PointAtTheDistanceFromPoint(p2, d);
    points.push([ladderP!.x, ladderP!.y]);

    const midP: Apg2DPoint = p1.HalfwayFrom(p2);
    const perp: Apg2DLine = l.Perpendicular(midP);
    const textP = perp.PointAtTheDistanceFromPoint(midP, d);
    points.push([textP!.x, textP!.y]);

    const shape = new ApgDxfLinearDim(this.activeLayer, points, eApgDxfDimensionTypes.ROTATED)
    this.activeLayer.addShape(shape);
    return this;

  }


  drawAlignedDim(x1: number, y1: number, x2: number, y2: number, d: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const points: number[][] = [];

    points.push([x1, y1]);
    points.push([x2, y2]);

    const p1 = new Apg2DPoint(x1, y1);
    const p2 = new Apg2DPoint(x2, y2);
    const l = new Apg2DLine(p1, p2);

    const ladderPerp = l.Perpendicular(p2);
    const ladderP = ladderPerp.PointAtTheDistanceFromPoint(p2, d);
    points.push([ladderP!.x, ladderP!.y]);

    const midP: Apg2DPoint = p1.HalfwayFrom(p2);
    const perp: Apg2DLine = l.Perpendicular(midP);
    const textP = perp.PointAtTheDistanceFromPoint(midP, d);
    points.push([textP!.x, textP!.y]);

    const shape = new ApgDxfLinearDim(this.activeLayer, points, eApgDxfDimensionTypes.ALIGNED);
    this.activeLayer.addShape(shape);
    return this;

  }


  drawDiameterDim(x1: number, y1: number, x2: number, y2: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const points: number[][] = [];

    points.push([x1, y1]);
    points.push([x2, y2]);

    const p1 = new Apg2DPoint(x1, y1);
    const p2 = new Apg2DPoint(x2, y2);
    const midP: Apg2DPoint = p1.HalfwayFrom(p2);

    points.push([midP.x, midP.y]);

    const shape =new ApgDxfArcDim(this.activeLayer, points, eApgDxfDimensionTypes.DIAMETER)
    this.activeLayer.addShape(shape);
    return this;

  }


  drawRadiousDim(cx: number, cy: number, x2: number, y2: number) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const points: number[][] = [];

    points.push([cx, cy]);
    points.push([x2, y2]);

    const p1 = new Apg2DPoint(cx, cy);
    const p2 = new Apg2DPoint(x2, y2);
    const midP: Apg2DPoint = p1.HalfwayFrom(p2);

    points.push([midP.x, midP.y]);

    const shape =new ApgDxfArcDim(this.activeLayer, points, eApgDxfDimensionTypes.RADIOUS)
    this.activeLayer.addShape(shape);
    return this;

  }


  drawAngularDim(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    mx: number,
    my: number
  ) {

    if (!this.activeLayer) {
      this.activeLayer = this.layers[eApgDxfDftLayers.ZERO];
    }
    const points: number[][] = [];

    points.push([x1, y1]);
    points.push([x2, y2]);
    const p1 = new Apg2DPoint(x1, y1);
    const p2 = new Apg2DPoint(x2, y2);
    const l1 = new Apg2DLine(p1, p2);

    points.push([x3, y3]);
    points.push([x4, y4]);
    const p3 = new Apg2DPoint(x3, y3);
    const p4 = new Apg2DPoint(x4, y4);
    const l2 = new Apg2DLine(p3, p4);

    const cp = <Apg2DPoint>l1.Intersection(l2);

    const bis = l1.Bisector(l2);
    const p5 = new Apg2DPoint(mx, my);
    const l3 = new Apg2DLine(cp, p5);

    const d = l3.length;
    const p = bis.PointAtTheDistanceFromPoint(cp, d);
    points.push([p!.x, p!.y]);
    points.push([p!.x, p!.y]);

    const shape =new ApgDxfAngularDim(this.activeLayer, points, eApgDxfDimensionTypes.ANGULAR);
    this.activeLayer.addShape(shape);
    return this;

  }


  toDxfString() {
    let s = '';

    // start section
    s += '0\nSECTION\n';
    // name section as TABLES section
    s += '2\nTABLES\n';

    s += this._getDxfLtypeTable();
    s += this._getDxfLayerTable();

    // end section
    s += '0\nENDSEC\n';


    // ENTITES section
    s += '0\nSECTION\n';
    s += '2\nENTITIES\n';

    for (const layerName in this.layers) {
      if (this.layers[layerName]) {
        const layer = this.layers[layerName];
        s += layer.shapesToDxf();
        // let shapes = layer.getShapes();
      }
    }

    s += '0\nENDSEC\n';


    // close file
    s += '0\nEOF';

    return s;
  }


  private _getDxfLtypeTable() {
    let s = '0\nTABLE\n'; // start table
    s += '2\nLTYPE\n';    // name table as LTYPE table

    for (const lineStyleName in this.lineStyles) {
      if (this.lineStyles[lineStyleName]) {
        s += this.lineStyles[lineStyleName].toDxfString();
      }
    }

    s += '0\nENDTAB\n'; // end table

    return s;
  }


  private _getDxfLayerTable() {
    let s = '0\nTABLE\n'; // start table
    s += '2\nLAYER\n'; // name table as LAYER table

    for (const layerName in this.layers) {
      if (this.layers[layerName]) {
        s += this.layers[layerName].toDxfString();
      }
    }

    s += '0\nENDTAB\n';

    return s;
  }

}


