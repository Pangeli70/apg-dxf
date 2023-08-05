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

    this.flags = {
      [this.#S01_Layers.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S02_LineStyles.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S03_DimensionsStyles.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S04_Arcs.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S05_Circles.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S06_Lines.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S07_Points.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S08_PolyLines.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S09_Labels.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S10_AlignedDims.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S11_RotatedDims.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S12_DiameterDims.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S13_RadiousDims.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S14_AngularDims.name]: Uts.eApgUtsSpecRun.yes,
      [this.#S15_Demo.name]: Uts.eApgUtsSpecRun.yes,
    }
  }

  #dxfSpecFinalization(spec: string, dxf: ApgDxfDrawing) {
    this.specWhen(`Trying get a dxf file content for spec [${spec}]`);
    const dxfFileContent = dxf.toDxfString();
    this.specWeExpect(`to get a non empy string`);
    this.specWeGot(`${dxfFileContent.length} characters`, dxfFileContent != "");

    this.#saveToFile(dxfFileContent, spec);
    this.specResume();
  }


  #saveToFile(adxf: string, atestname: string) {

    // WARNING in production we don't have write permissions
    const encoder = new TextEncoder();
    const data = encoder.encode(adxf);
    const file = this._outputPath + atestname + '.dxf';
    Deno.writeFileSync(file, data);
  }


  #S01_Layers() {

    const spec = this.#S01_Layers.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    dxf.newLayer('1', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('1');
    dxf.drawLine(0, 0, 200, 0);

    dxf.newLayer('2', eApgDxfStdColors.RED, eApgDxfDftLineStyles.DOTTED_5);
    dxf.setLayer('2');
    dxf.drawLine(0, 40, 200, 40);

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S02_LineStyles() {

    const spec = this.#S02_LineStyles.name
    const run = this.specInit(spec);
    if (!run) return;
    
    const dxf = new ApgDxfDrawing();

    dxf.addLineStyle('MyDASHDOT', '_ . ', [0.5, -0.5, 0.0, -0.5]);
    dxf.newLayer('1', eApgDxfStdColors.GREEN, 'MyDASHDOT');
    dxf.setLayer('1');
    dxf.drawLine(0, 0, 200, 0);

    dxf.addLineStyle('MyDOT', ' .', [-10, 0.0]);
    dxf.newLayer('2', eApgDxfStdColors.BLUE, 'MyDOT');
    dxf.setLayer('2');
    dxf.drawLine(0, 0, 200, 0);

    this.#dxfSpecFinalization(spec, dxf);
  }

  #S03_DimensionsStyles() {

    const spec = this.#S03_DimensionsStyles.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    // TODO @9 implement this mockup

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S04_Arcs() {

    const spec = this.#S04_Arcs.name
    const run = this.specInit(spec);
    if (!run) return;
    
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

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S05_Circles() {

    const spec = this.#S05_Circles.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    const maxxy = 200;
    const maxn = 2000;


    dxf.newLayer('l', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS)
      .setLayer('l');

    for (let i = 0; i < maxn; i++) {
      const x = Math.random() * maxxy - maxxy / 2;
      const y = Math.random() * maxxy - maxxy / 2;
      const r = 2 + Math.random() * 3;
      dxf.drawCircle(x, y, r);
    }

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S06_Lines() {

    const spec = this.#S06_Lines.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    const maxxy = 200;
    const maxn = 2000;


    dxf.newLayer('1', eApgDxfStdColors.RED, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('1');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;

      dxf.drawLine(x1, y1, x2, y2);
    }

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S07_Points() {

    const spec = this.#S07_Points.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    const maxxy = 200;
    const maxn = 2000;


    dxf.newLayer('1', eApgDxfStdColors.RED, eApgDxfDftLineStyles.CONTINUOUS);
    dxf.setLayer('1');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      dxf.drawPoint(x1, y1);
    }

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S08_PolyLines() {

    const spec = this.#S08_PolyLines.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    const maxxy = 200;
    const maxxy_2 = maxxy / 2;
    const maxn = 100;
    const maxp = 10;


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

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S09_Labels() {

    const spec = this.#S09_Labels.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    const maxxy = 200;
    const maxn = 20;

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

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S10_AlignedDims() {

    const spec = this.#S10_AlignedDims.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();
    const maxxy = 200;
    const maxn = 20;

    dxf.newLayer('l', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.setLayer('l');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      dxf.drawAlignedDim(x1, y1, x2, y2, 10);
    }

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S11_RotatedDims() {

    const spec = this.#S11_RotatedDims.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();
    const maxxy = 200;
    const maxn = 20;

    dxf.newLayer('l', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.setLayer('l');

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      dxf.drawRotatedDim(x1, y1, x2, y2, 10);
    }

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S12_DiameterDims() {

    const spec = this.#S12_DiameterDims.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();
    const maxxy = 200;
    const maxn = 20;

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

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S13_RadiousDims() {

    const spec = this.#S13_RadiousDims.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();
    const maxxy = 200;
    const maxn = 20;

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

    this.#dxfSpecFinalization(spec, dxf);
  }


  #m(arr: number[]) {
    const sorted = arr.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
    const min = sorted[0];
    const max = sorted[arr.length - 1];
    const delta = (max - min) / 2;
    return delta + min;
  }


  #S14_AngularDims() {

    const spec = this.#S14_AngularDims.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();
    const maxxy = 200;
    const maxn = 2;

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

      const mx = this.#m(xm);
      const my = this.#m(ym);

      dxf.setLayer('2');
      dxf.drawAngularDim(x1, y1, x2, y2, x3, y3, x4, y4, mx, my);
    }

    this.#dxfSpecFinalization(spec, dxf);
  }


  #S15_Demo() {

    const spec = this.#S15_Demo.name
    const run = this.specInit(spec);
    if (!run) return;

    const dxf = new ApgDxfDrawing();

    // TODO @9 add more features in this spec

    dxf.drawText(10, 0, 10, 0, 'Apg Dxf Simple test');

    dxf.newLayer('l', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS)
      .setLayer('l')
      .drawText(20, -70, 10, 0, 'Version 0.5.1');

    dxf.newLayer('2', eApgDxfStdColors.RED, 'DOTTED')
      .setLayer('2')
      .drawCircle(50, -30, 25);

    this.#dxfSpecFinalization(spec, dxf);
  }


  override specExecuteSync() {

    Uts.ApgUtsFs.ClearFolderSync(this._outputPath);

    this.#S01_Layers()
    this.#S02_LineStyles()
    this.#S02_LineStyles();
    this.#S03_DimensionsStyles();

    this.#S07_Points();
    this.#S06_Lines();
    this.#S08_PolyLines();

    this.#S04_Arcs();
    this.#S05_Circles();

    this.#S09_Labels();

    this.#S10_AlignedDims();
    this.#S11_RotatedDims();
    this.#S12_DiameterDims();
    this.#S13_RadiousDims();
    this.#S14_AngularDims();

    this.#S15_Demo()
  }

}

