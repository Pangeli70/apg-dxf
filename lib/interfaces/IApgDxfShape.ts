/** -----------------------------------------------------------------------
 * @module [apg-dxf]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */
import { IApgDxfLayer } from './IApgDxfLayer.ts';

/**
 * Basic shape
 */
export interface IApgDxfShape {

  layer: IApgDxfLayer;

  toDxfString(): string;

}
