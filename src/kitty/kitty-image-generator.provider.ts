import { Injectable } from '@nestjs/common';
import { Kitty } from './kitty.entity';
import * as sharp from 'sharp';

@Injectable()
export class KittyImageGenerator {
  async generate(kitty: Kitty): Promise<Buffer> {
    const svg = this.kittyToSvg(kitty);
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  kittyToSvg(kitty: Kitty): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Group">
        <g id="g1">
            <path id="Path" fill="#${kitty.furColor}" fill-rule="evenodd" stroke="#000000" stroke-width="11.563372" stroke-linecap="round" stroke-linejoin="round" d="M 250.571732 151.572174 C 257.727783 132.526764 278.806915 95.301849 299.137909 96.067993 C 323.865021 96.999725 332.509796 159.007416 354.64209 170.073547 C 365.887146 175.696075 386.82666 170.073547 400.895569 170.073547 C 415.298737 170.073547 441.835022 177.645752 454.087067 170.073547 C 472.91394 158.437927 469.046997 98.055573 491.089874 96.067993 C 515.734558 93.845795 538.525024 146.681488 546.594055 170.073547 C 570.806335 240.264984 570.865967 375.683472 552.375732 447.594482 C 546.681519 469.739929 528.403442 508.602081 509.591248 521.600037 C 476.583069 544.406494 401.581299 548.97821 361.580109 545.883118 C 340.808014 544.275879 303.345795 535.213623 287.574524 521.600037 C 270.820587 507.138214 255.656677 469.134705 250.571732 447.594482 C 232.379227 370.529724 222.720993 225.695526 250.571732 151.572174 Z"/>
        </g>
        <g id="happy-eyes">
            <path id="path1" fill="#${kitty.eyeColor}" fill-rule="evenodd" stroke="#000000" stroke-width="11.563372" stroke-linecap="round" stroke-linejoin="round" d="M 357.855988 230.507507 C 357.855988 230.507507 385.198883 305.681335 357.855988 230.507507 C 330.513153 155.33371 313.183777 268.286469 313.183777 268.286469"/>
            <path id="Path-copy" fill="#${kitty.eyeColor}" fill-rule="evenodd" stroke="#000000" stroke-width="11.563372" stroke-linecap="round" stroke-linejoin="round" d="M 472.333374 230.507507 C 472.333374 230.507507 499.676239 305.681335 472.333374 230.507507 C 444.990509 155.33371 427.661163 268.286469 427.661163 268.286469"/>
        </g>
        <path id="mouth" fill="#${kitty.furColor}" fill-rule="evenodd" stroke="#000000" stroke-width="11.563372" stroke-linecap="round" stroke-linejoin="round" d="M 398.582886 374.745239 C 400.005737 334.571533 399.739227 337.742432 399.739227 337.742432 L 418.240631 321.553711 L 381.237823 321.553711 L 399.739227 337.742432 M 352.329407 377.057892 C 365.274963 450.282043 397.426544 377.057892 397.426544 377.057892 C 397.426544 377.057892 417.685028 443.010742 444.836365 377.057892"/>
        <g id="moustaches">
            <path id="path2" fill="none" stroke="#000000" stroke-width="11.563372" stroke-linecap="round" stroke-linejoin="round" d="M 449.460938 338.898438 C 449.460938 338.898438 455.087179 338.866658 455.341797 338.865234 L 621.755859 283.394531 C 621.755859 283.394531 639.63446 306.207426 455.429688 338.865234 C 470.585634 338.780472 906.830424 336.340924 458.058594 338.898438 L 455.244141 338.898438 L 449.460938 338.898438 Z M 640.257355 375.901558 L 436.742017 338.898765"/>
            <path id="Path-copy-2" fill="none" stroke="#000000" stroke-width="11.563372" stroke-linecap="round" stroke-linejoin="round" d="M 328.699219 341.210938 C -120.075152 338.65341 316.178877 341.092999 331.330078 341.177734 C 147.125306 308.519926 165.001953 285.707031 165.001953 285.707031 L 331.417969 341.177734 C 331.67242 341.179157 337.296875 341.210938 337.296875 341.210938 L 331.515625 341.210938 L 328.699219 341.210938 Z M 146.501394 378.214233 L 350.016731 341.21144"/>
        </g>
    </g>
</svg>`;
  }
}
