/** -----------------------------------------------------------------------
 * @module [apg-dxf]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/26]
 * @version 0.8.0 [APG 2022/04/15] Porting to Deno
 * @version 0.9.7 [APG 2023/04/06] Moved to its own module + separation of concers lib/srv
 * -----------------------------------------------------------------------
 */

import { Uts, A2D } from "../../deps.ts"

import {
  ApgDxfDrawing,
  eApgDxfDftLineStyles,
  eApgDxfStdColors
} from "../../mod.ts"

export class ApgDxfSpec extends Uts.ApgUtsSpecable {

  private _outputPath = '';

  constructor(apath: string) {
    super(import.meta.url);
    this._outputPath = apath;
  }


  private _save(adxf: string, atestname: string, aisProd = true) {

    // in production we don't have write permissions
    if (!aisProd) {

      const encoder = new TextEncoder();
      const data = encoder.encode(adxf);

      Deno.writeFileSync(this._outputPath + atestname + '.dxf', data);
    }

  }


  private _testLayers() {
    const dxf = new ApgDxfDrawing();

    dxf.newLayer('1', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('1');
    dxf.drawLine(0, 0, 200, 0);

    dxf.newLayer('2', eApgDxfStdColors.RED, eApgDxfDftLineStyles.DOTTED_5);
    dxf.setLayer('2');
    dxf.drawLine(0, 40, 200, 40);

    return dxf.toDxfString();
  }


  private _testLineStyles() {
    const dxf = new ApgDxfDrawing();

    dxf.addLineStyle('MyDASHDOT', '_ . ', [0.5, -0.5, 0.0, -0.5]);
    dxf.newLayer('1', eApgDxfStdColors.GREEN, 'MyDASHDOT');
    dxf.setLayer('1');
    dxf.drawLine(0, 0, 200, 0);

    dxf.addLineStyle('MyDOT', ' .', [-10, 0.0]);
    dxf.newLayer('2', eApgDxfStdColors.BLUE, 'MyDOT');
    dxf.setLayer('2');
    dxf.drawLine(0, 0, 200, 0);

    return dxf.toDxfString();
  }


  private _testDimStyles() {
    const dxf = new ApgDxfDrawing();

    // @todo_9 implement this mockup
    return dxf.toDxfString();
  }


  private _testArcs() {
    const dxf = new ApgDxfDrawing();

    const maxxy = 200;
    const maxn = 2000;

    dxf.newLayer('l', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('l');


    for (let i = 0; i < maxn; i++) {
      const x = Math.random() * maxxy - maxxy / 2;
      const y = Math.random() * maxxy - maxxy / 2;
      const r = 1 + Math.random() * 4;
      const b = Math.random() * 360;
      const e = Math.random() * 360;
      dxf.drawArc(x, y, r, b, e);
    }

    return dxf.toDxfString();
  }


  private _testCircles() {

    const maxxy = 200;
    const maxn = 2000;

    const dxf = new ApgDxfDrawing();

    dxf.newLayer('l', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS)
      .setLayer('l');

    for (let i = 0; i < maxn; i++) {
      const x = Math.random() * maxxy - maxxy / 2;
      const y = Math.random() * maxxy - maxxy / 2;
      const r = 2 + Math.random() * 3;
      dxf.drawCircle(x, y, r);
    }

    return dxf.toDxfString();
  }


  private _testLines() {

    const maxxy = 200;
    const maxn = 2000;

    const dxf = new ApgDxfDrawing();

    dxf.newLayer('1', eApgDxfStdColors.RED, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('1');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;

      dxf.drawLine(x1, y1, x2, y2);
    }

    return dxf.toDxfString();
  }


  private _testPoints() {

    const maxxy = 200;
    const maxn = 2000;

    const dxf = new ApgDxfDrawing();

    dxf.newLayer('1', eApgDxfStdColors.RED, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('1');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      dxf.drawPoint(x1, y1);
    }

    return dxf.toDxfString();
  }


  private _testPolyLines() {

    const maxxy = 200;
    const maxxy_2 = maxxy / 2;
    const maxn = 100;
    const maxp = 10;


    const dxf = new ApgDxfDrawing();

    dxf.newLayer('1', eApgDxfStdColors.RED, eApgDxfDftLineStyles.DASHED_DOTTED_1);
    dxf.setLayer('1');

    for (let i = 0; i < maxn; i++) {

      const np = 2 + Math.floor(Math.random() * (maxp - 2));

      const pts: number[][] = [];
      for (let j = 0; j < np; j++) {
        const pt: number[] = [];
        let x, y;
        if (j === 0) {
          x = Math.random() * maxxy - maxxy_2;
          y = Math.random() * maxxy - maxxy_2;
        }
        else {
          x = (Math.random() * maxxy - maxxy_2) / 20;
          y = (Math.random() * maxxy - maxxy_2) / 20;

          x = pts[j - 1][0] + x;
          y = pts[j - 1][1] + y;

          if (x > maxxy_2) { x = maxxy_2; }
          if (x < (-maxxy_2)) { x = -maxxy_2; }
          if (y > maxxy_2) { y = maxxy_2; }
          if (y < (-maxxy_2)) { y = -maxxy_2; }
        }
        pt.push(x);
        pt.push(y);
        pts.push(pt);
      }
      dxf.drawPolyline(pts);

    }

    return dxf.toDxfString();
  }


  private _testTextLabels() {

    const maxxy = 200;
    const maxn = 20;

    const dxf = new ApgDxfDrawing();
    dxf.newLayer('l', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('l');

    const strings = ['We love APG DXF', 'APG DXF is fun', 'APG DXF its easy', 'APG DXF don\'t lie'];

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      const j = Math.floor(Math.random() * strings.length);

      const p1 = new A2D.Apg2DPoint(x1, y1);
      const p2 = new A2D.Apg2DPoint(x2, y2);
      const line = new A2D.Apg2DLine(p1, p2);


      dxf.drawText(x1, y1, line.length / strings[j].length, line.slope, strings[j]);
      dxf.drawLine(x1, y1, x2, y2);
    }

    return dxf.toDxfString();
  }


  private _testAlignedDims() {
    const maxxy = 200;
    const maxn = 20;

    const dxf = new ApgDxfDrawing();
    dxf.newLayer('l', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.setLayer('l');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      dxf.drawAlignedDim(x1, y1, x2, y2, 10);
    }

    return dxf.toDxfString();
  }


  private _testRotatedDims() {
    const maxxy = 200;
    const maxn = 20;

    const dxf = new ApgDxfDrawing();
    dxf.newLayer('l', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.setLayer('l');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      dxf.drawRotatedDim(x1, y1, x2, y2, 10);
    }

    return dxf.toDxfString();
  }


  private _testDiameterDims() {
    const maxxy = 200;
    const maxn = 20;

    const dxf = new ApgDxfDrawing();
    dxf.newLayer('1', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.newLayer('2', eApgDxfStdColors.RED, 'CONTINUOUS');
    dxf.newLayer('3', eApgDxfStdColors.BLUE, 'CONTINUOUS');

    for (let i = 0; i < maxn; i++) {
      const cx = Math.random() * maxxy - maxxy / 2;
      const cy = Math.random() * maxxy - maxxy / 2;
      const r = Math.random() * maxxy / 20;
      dxf.setLayer('1');
      dxf.drawCircle(cx, cy, r);

      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      dxf.setLayer('3');
      dxf.drawLine(cx, cy, x2, y2);

      const pc = new A2D.Apg2DPoint(cx, cy);
      const p2 = new A2D.Apg2DPoint(x2, y2);
      const l = new A2D.Apg2DLine(pc, p2);
      const pc1 = l.pointAtDistanceFromPoint(pc, r);
      const pc2 = l.pointAtDistanceFromPoint(pc, -r);

      dxf.setLayer('2');
      dxf.drawDiameterDim(pc1!.x, pc1!.y, pc2!.x, pc2!.y);
    }

    return dxf.toDxfString();
  }


  private _testRadiousDims() {
    const maxxy = 200;
    const maxn = 20;

    const dxf = new ApgDxfDrawing();
    dxf.newLayer('1', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.newLayer('2', eApgDxfStdColors.RED, 'CONTINUOUS');
    dxf.newLayer('3', eApgDxfStdColors.BLUE, 'CONTINUOUS');

    for (let i = 0; i < maxn; i++) {
      const cx = Math.random() * maxxy - maxxy / 2;
      const cy = Math.random() * maxxy - maxxy / 2;
      const r = Math.random() * maxxy / 20;
      dxf.setLayer('1');
      dxf.drawCircle(cx, cy, r);

      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      dxf.setLayer('3');
      dxf.drawLine(cx, cy, x2, y2);

      const pc = new A2D.Apg2DPoint(cx, cy);
      const p2 = new A2D.Apg2DPoint(x2, y2);
      const l = new A2D.Apg2DLine(pc, p2);
      const pc1 = l.pointAtDistanceFromPoint(pc, r);
      const pc2 = l.pointAtDistanceFromPoint(pc, -r);

      dxf.setLayer('2');
      dxf.drawRadiousDim(pc1!.x, pc1!.y, pc2!.x, pc2!.y);
    }

    return dxf.toDxfString();
  }

  private _m(arr: number[]) {
    const sorted = arr.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
    const min = sorted[0];
    const max = sorted[arr.length - 1];
    const delta = (max - min) / 2;
    return delta + min;
  }

  private _testAngularDims() {
    const maxxy = 200;
    const maxn = 2;

    const dxf = new ApgDxfDrawing();
    dxf.newLayer('1', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.newLayer('2', eApgDxfStdColors.RED, 'CONTINUOUS');
    dxf.newLayer('3', eApgDxfStdColors.BLUE, 'CONTINUOUS');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      const x3 = Math.random() * maxxy - maxxy / 2;
      const y3 = Math.random() * maxxy - maxxy / 2;
      const x4 = Math.random() * maxxy - maxxy / 2;
      const y4 = Math.random() * maxxy - maxxy / 2;

      dxf.setLayer('3');
      dxf.drawLine(x1, y1, x2, y2);
      dxf.drawLine(x3, y3, x4, y4);

      const xm = [x1, x2, x3, x4];
      const ym = [y1, y2, y3, y4];

      const mx = this._m(xm);
      const my = this._m(ym);

      dxf.setLayer('2');
      dxf.drawAngularDim(x1, y1, x2, y2, x3, y3, x4, y4, mx, my);
    }

    return dxf.toDxfString();
  }


  demo(): string {
    const dxf = new ApgDxfDrawing();

    // @todo_9 add more functions in this test

    dxf.drawText(10, 0, 10, 0, 'Apg Dxf Simple test');

    dxf.newLayer('l', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS)
      .setLayer('l')
      .drawText(20, -70, 10, 0, 'Version 0.5.1');

    dxf.newLayer('2', eApgDxfStdColors.RED, 'DOTTED')
      .setLayer('2')
      .drawCircle(50, -30, 25);

    return dxf.toDxfString();
  }


  override specRunSync(arun: Uts.eApgUtsSpecRun) {

    if (arun == Uts.eApgUtsSpecRun.no) {
      return false;
    }

    const isProduction = (1) ? true : false;

    Uts.ApgUtsFs.ClearFolderSync(this._outputPath);

    this._save(this._testLayers(), 'DxfTestLayers', isProduction);
    this._save(this._testLineStyles(), 'DxfTestStyles', isProduction);
    this._save(this._testDimStyles(), 'DxfTestDimStyles', isProduction);

    this._save(this._testPoints(), 'DxfTestPoints', isProduction);
    this._save(this._testLines(), 'DxfTestLines', isProduction);
    this._save(this._testPolyLines(), 'DxfTestPolyLines', isProduction);

    this._save(this._testArcs(), 'DxfTestArcs', isProduction);
    this._save(this._testCircles(), 'DxfTestCircles', isProduction);

    this._save(this._testTextLabels(), 'DxfTestTextLabels', isProduction);

    this._save(this._testAlignedDims(), 'DxfTestAlignedDims', isProduction);
    this._save(this._testRotatedDims(), 'DxfTestRotatedDims', isProduction);
    this._save(this._testDiameterDims(), 'DxfTestDiameterDims', isProduction);
    this._save(this._testRadiousDims(), 'DxfTestRadiousDims', isProduction);
    this._save(this._testAngularDims(), 'DxfTestAngularDims', isProduction);

    this._save(this.demo(), 'DxfTestDemoDrawing', isProduction);
    
    return true;

  }

}

