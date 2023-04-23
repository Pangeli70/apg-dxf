/** -----------------------------------------------------------------------
 * @module [DXF]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */
import { IApgDxfLayer } from '../interfaces/IApgDxfLayer.ts';
import { IApgDxfShape } from '../interfaces/IApgDxfShape.ts';
import { eApgDxfStdColors } from '../enums/eApgDxfStdColors.ts';

/**
 * Layer
 */
export class ApgDxfLayer implements IApgDxfLayer {

    name: string;
    colorNumber: eApgDxfStdColors;
    lineStyleName: string;
    shapes: IApgDxfShape[] = [];

    constructor(name: string, colorNumber: eApgDxfStdColors, lineStyleName: string) {
        this.name = name;
        this.colorNumber = colorNumber;
        this.lineStyleName = lineStyleName;
        this.shapes = [];
    }

    toDxfString() {
        let s = '0\nLAYER\n';
        s += '70\n64\n';
        s += `2\n${this.name}\n`;
        s += `62\n${this.colorNumber}\n`;
        s += `6\n${this.lineStyleName}\n`;
        return s;
    }

    addShape(shape: IApgDxfShape) {
        this.shapes.push(shape);
        shape.layer = this;
    }

    getShapes() {
        return this.shapes;
    }

    shapesToDxf() {
        let s = '';
        for (let i = 0; i < this.shapes.length; ++i) {
            s += this.shapes[i].toDxfString();
        }

        return s;
    }
}
