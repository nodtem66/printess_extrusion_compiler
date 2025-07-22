function Help(props) {
  //const [setShowHelp] = props; // Destructure setShowHelp from props to control visibility

  return (
  <>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Help - Printess Extrusion Compiler</h2>
          <button
            onClick={() => props.setShowHelp(false)}
            class="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>
      </div>
      
      <div class="p-6 space-y-6">
        {/* Overview */}
        <section>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Overview</h3>
          <p class="text-gray-600 leading-relaxed text-justify">
            The Printess Extrusion Compiler processes G-code files for 3D printing with extrusion calculations. 
            It automatically calculates extrusion values (E parameters) based on movement distances and specified 
            syringe/nozzle diameters. This app replicates the original python script from <a href="https://github.com/weiss-jonathan/Printess-Low-Cost-3D-Printer/blob/main/Python%20Extrusion%20Distance%20Script/gcode_translator_10_17_24.py" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Printess</a>.
          </p>
        </section>

        <section>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">How Extrusion Distance is Calculated</h3>
          <p class="text-gray-600 leading-relaxed text-justify">
            The program calculates extrusion distance based on a simple principle: the volume of material pushed down in the syringe equals the volume extruded from the nozzle. This allows us to determine the extrusion distance, which is the vertical distance (in millimeters) the syringe plunger's stepper motor moves.
          </p>
          <p class="text-gray-600 leading-relaxed">
            The calculation is as follows:
          </p>
          <div class="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="203.024px" height="47.008px" viewBox="0 -1647.5 11217.1 2597" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" style=""><defs><path id="MJX-10-TEX-I-1D438" d="M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z"></path><path id="MJX-10-TEX-I-1D70B" d="M132 -11Q98 -11 98 22V33L111 61Q186 219 220 334L228 358H196Q158 358 142 355T103 336Q92 329 81 318T62 297T53 285Q51 284 38 284Q19 284 19 294Q19 300 38 329T93 391T164 429Q171 431 389 431Q549 431 553 430Q573 423 573 402Q573 371 541 360Q535 358 472 358H408L405 341Q393 269 393 222Q393 170 402 129T421 65T431 37Q431 20 417 5T381 -10Q370 -10 363 -7T347 17T331 77Q330 86 330 121Q330 170 339 226T357 318T367 358H269L268 354Q268 351 249 275T206 114T175 17Q164 -11 132 -11Z"></path><path id="MJX-10-TEX-S3-28" d="M701 -940Q701 -943 695 -949H664Q662 -947 636 -922T591 -879T537 -818T475 -737T412 -636T350 -511T295 -362T250 -186T221 17T209 251Q209 962 573 1361Q596 1386 616 1405T649 1437T664 1450H695Q701 1444 701 1441Q701 1436 681 1415T629 1356T557 1261T476 1118T400 927T340 675T308 359Q306 321 306 250Q306 -139 400 -430T690 -924Q701 -936 701 -940Z"></path><path id="MJX-10-TEX-I-1D435" d="M231 637Q204 637 199 638T194 649Q194 676 205 682Q206 683 335 683Q594 683 608 681Q671 671 713 636T756 544Q756 480 698 429T565 360L555 357Q619 348 660 311T702 219Q702 146 630 78T453 1Q446 0 242 0Q42 0 39 2Q35 5 35 10Q35 17 37 24Q42 43 47 45Q51 46 62 46H68Q95 46 128 49Q142 52 147 61Q150 65 219 339T288 628Q288 635 231 637ZM649 544Q649 574 634 600T585 634Q578 636 493 637Q473 637 451 637T416 636H403Q388 635 384 626Q382 622 352 506Q352 503 351 500L320 374H401Q482 374 494 376Q554 386 601 434T649 544ZM595 229Q595 273 572 302T512 336Q506 337 429 337Q311 337 310 336Q310 334 293 263T258 122L240 52Q240 48 252 48T333 46Q422 46 429 47Q491 54 543 105T595 229Z"></path><path id="MJX-10-TEX-I-1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path><path id="MJX-10-TEX-N-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path><path id="MJX-10-TEX-S3-29" d="M34 1438Q34 1446 37 1448T50 1450H56H71Q73 1448 99 1423T144 1380T198 1319T260 1238T323 1137T385 1013T440 864T485 688T514 485T526 251Q526 134 519 53Q472 -519 162 -860Q139 -885 119 -904T86 -936T71 -949H56Q43 -949 39 -947T34 -937Q88 -883 140 -813Q428 -430 428 251Q428 453 402 628T338 922T245 1146T145 1309T46 1425Q44 1427 42 1429T39 1433T36 1436L34 1438Z"></path><path id="MJX-10-TEX-N-3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path><path id="MJX-10-TEX-I-1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path><path id="MJX-10-TEX-I-1D459" d="M117 59Q117 26 142 26Q179 26 205 131Q211 151 215 152Q217 153 225 153H229Q238 153 241 153T246 151T248 144Q247 138 245 128T234 90T214 43T183 6T137 -11Q101 -11 70 11T38 85Q38 97 39 102L104 360Q167 615 167 623Q167 626 166 628T162 632T157 634T149 635T141 636T132 637T122 637Q112 637 109 637T101 638T95 641T94 647Q94 649 96 661Q101 680 107 682T179 688Q194 689 213 690T243 693T254 694Q266 694 266 686Q266 675 193 386T118 83Q118 81 118 75T117 65V59Z"></path><path id="MJX-10-TEX-I-1D441" d="M234 637Q231 637 226 637Q201 637 196 638T191 649Q191 676 202 682Q204 683 299 683Q376 683 387 683T401 677Q612 181 616 168L670 381Q723 592 723 606Q723 633 659 637Q635 637 635 648Q635 650 637 660Q641 676 643 679T653 683Q656 683 684 682T767 680Q817 680 843 681T873 682Q888 682 888 672Q888 650 880 642Q878 637 858 637Q787 633 769 597L620 7Q618 0 599 0Q585 0 582 2Q579 5 453 305L326 604L261 344Q196 88 196 79Q201 46 268 46H278Q284 41 284 38T282 19Q278 6 272 0H259Q228 2 151 2Q123 2 100 2T63 2T46 1Q31 1 31 10Q31 14 34 26T39 40Q41 46 62 46Q130 49 150 85Q154 91 221 362L289 634Q287 635 234 637Z"></path></defs><g stroke="#000000" fill="#000000" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><use data-c="1D438" xlink:href="#MJX-10-TEX-I-1D438"></use></g><g data-mml-node="mi" transform="translate(764,0)"><use data-c="1D70B" xlink:href="#MJX-10-TEX-I-1D70B"></use></g><g data-mml-node="msup" transform="translate(1334,0)"><g data-mml-node="mrow"><g data-mml-node="mo" transform="translate(0 -0.5)"><use data-c="28" xlink:href="#MJX-10-TEX-S3-28"></use></g><g data-mml-node="mfrac" transform="translate(736,0)"><g data-mml-node="msub" transform="translate(220,676)"><g data-mml-node="mi"><use data-c="1D435" xlink:href="#MJX-10-TEX-I-1D435"></use></g><g data-mml-node="mi" transform="translate(792,-150) scale(0.707)"><use data-c="1D451" xlink:href="#MJX-10-TEX-I-1D451"></use></g></g><g data-mml-node="mn" transform="translate(574.8,-686)"><use data-c="32" xlink:href="#MJX-10-TEX-N-32"></use></g><rect width="1409.7" height="60" x="120" y="220"></rect></g><g data-mml-node="mo" transform="translate(2385.7,0) translate(0 -0.5)"><use data-c="29" xlink:href="#MJX-10-TEX-S3-29"></use></g></g><g data-mml-node="mn" transform="translate(3154.7,1176.6) scale(0.707)"><use data-c="32" xlink:href="#MJX-10-TEX-N-32"></use></g></g><g data-mml-node="mo" transform="translate(5170,0)"><use data-c="3D" xlink:href="#MJX-10-TEX-N-3D"></use></g><g data-mml-node="mi" transform="translate(6225.8,0)"><use data-c="1D458" xlink:href="#MJX-10-TEX-I-1D458"></use></g><g data-mml-node="mi" transform="translate(6746.8,0)"><use data-c="1D459" xlink:href="#MJX-10-TEX-I-1D459"></use></g><g data-mml-node="mi" transform="translate(7044.8,0)"><use data-c="1D70B" xlink:href="#MJX-10-TEX-I-1D70B"></use></g><g data-mml-node="msup" transform="translate(7614.8,0)"><g data-mml-node="mrow"><g data-mml-node="mo" transform="translate(0 -0.5)"><use data-c="28" xlink:href="#MJX-10-TEX-S3-28"></use></g><g data-mml-node="mfrac" transform="translate(736,0)"><g data-mml-node="msub" transform="translate(220,676)"><g data-mml-node="mi"><use data-c="1D441" xlink:href="#MJX-10-TEX-I-1D441"></use></g><g data-mml-node="mi" transform="translate(836,-150) scale(0.707)"><use data-c="1D451" xlink:href="#MJX-10-TEX-I-1D451"></use></g></g><g data-mml-node="mn" transform="translate(596.8,-686)"><use data-c="32" xlink:href="#MJX-10-TEX-N-32"></use></g><rect width="1453.7" height="60" x="120" y="220"></rect></g><g data-mml-node="mo" transform="translate(2429.7,0) translate(0 -0.5)"><use data-c="29" xlink:href="#MJX-10-TEX-S3-29"></use></g></g><g data-mml-node="mn" transform="translate(3198.7,1176.6) scale(0.707)"><use data-c="32" xlink:href="#MJX-10-TEX-N-32"></use></g></g></g></g></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="85.704px" height="49.184px" viewBox="0 -1608.7 4735.4 2717.5" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" style=""><defs><path id="MJX-27-TEX-I-1D438" d="M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z"></path><path id="MJX-27-TEX-N-3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path><path id="MJX-27-TEX-I-1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path><path id="MJX-27-TEX-I-1D459" d="M117 59Q117 26 142 26Q179 26 205 131Q211 151 215 152Q217 153 225 153H229Q238 153 241 153T246 151T248 144Q247 138 245 128T234 90T214 43T183 6T137 -11Q101 -11 70 11T38 85Q38 97 39 102L104 360Q167 615 167 623Q167 626 166 628T162 632T157 634T149 635T141 636T132 637T122 637Q112 637 109 637T101 638T95 641T94 647Q94 649 96 661Q101 680 107 682T179 688Q194 689 213 690T243 693T254 694Q266 694 266 686Q266 675 193 386T118 83Q118 81 118 75T117 65V59Z"></path><path id="MJX-27-TEX-I-1D441" d="M234 637Q231 637 226 637Q201 637 196 638T191 649Q191 676 202 682Q204 683 299 683Q376 683 387 683T401 677Q612 181 616 168L670 381Q723 592 723 606Q723 633 659 637Q635 637 635 648Q635 650 637 660Q641 676 643 679T653 683Q656 683 684 682T767 680Q817 680 843 681T873 682Q888 682 888 672Q888 650 880 642Q878 637 858 637Q787 633 769 597L620 7Q618 0 599 0Q585 0 582 2Q579 5 453 305L326 604L261 344Q196 88 196 79Q201 46 268 46H278Q284 41 284 38T282 19Q278 6 272 0H259Q228 2 151 2Q123 2 100 2T63 2T46 1Q31 1 31 10Q31 14 34 26T39 40Q41 46 62 46Q130 49 150 85Q154 91 221 362L289 634Q287 635 234 637Z"></path><path id="MJX-27-TEX-N-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path><path id="MJX-27-TEX-I-1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path><path id="MJX-27-TEX-I-1D435" d="M231 637Q204 637 199 638T194 649Q194 676 205 682Q206 683 335 683Q594 683 608 681Q671 671 713 636T756 544Q756 480 698 429T565 360L555 357Q619 348 660 311T702 219Q702 146 630 78T453 1Q446 0 242 0Q42 0 39 2Q35 5 35 10Q35 17 37 24Q42 43 47 45Q51 46 62 46H68Q95 46 128 49Q142 52 147 61Q150 65 219 339T288 628Q288 635 231 637ZM649 544Q649 574 634 600T585 634Q578 636 493 637Q473 637 451 637T416 636H403Q388 635 384 626Q382 622 352 506Q352 503 351 500L320 374H401Q482 374 494 376Q554 386 601 434T649 544ZM595 229Q595 273 572 302T512 336Q506 337 429 337Q311 337 310 336Q310 334 293 263T258 122L240 52Q240 48 252 48T333 46Q422 46 429 47Q491 54 543 105T595 229Z"></path></defs><g stroke="#000000" fill="#000000" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><use data-c="1D438" xlink:href="#MJX-27-TEX-I-1D438"></use></g><g data-mml-node="mo" transform="translate(1041.8,0)"><use data-c="3D" xlink:href="#MJX-27-TEX-N-3D"></use></g><g data-mml-node="mfrac" transform="translate(2097.6,0)"><g data-mml-node="mrow" transform="translate(220,774.8)"><g data-mml-node="mi"><use data-c="1D458" xlink:href="#MJX-27-TEX-I-1D458"></use></g><g data-mml-node="mi" transform="translate(521,0)"><use data-c="1D459" xlink:href="#MJX-27-TEX-I-1D459"></use></g><g data-mml-node="msubsup" transform="translate(819,0)"><g data-mml-node="mi"><use data-c="1D441" xlink:href="#MJX-27-TEX-I-1D441"></use></g><g data-mml-node="mn" transform="translate(975.3,363) scale(0.707)"><use data-c="32" xlink:href="#MJX-27-TEX-N-32"></use></g><g data-mml-node="mi" transform="translate(836,-307.7) scale(0.707)"><use data-c="1D451" xlink:href="#MJX-27-TEX-I-1D451"></use></g></g></g><g data-mml-node="msubsup" transform="translate(714.1,-784.5)"><g data-mml-node="mi"><use data-c="1D435" xlink:href="#MJX-27-TEX-I-1D435"></use></g><g data-mml-node="mn" transform="translate(792,353.6) scale(0.707)"><use data-c="32" xlink:href="#MJX-27-TEX-N-32"></use></g><g data-mml-node="mi" transform="translate(792,-317.1) scale(0.707)"><use data-c="1D451" xlink:href="#MJX-27-TEX-I-1D451"></use></g></g><rect width="2397.8" height="60" x="120" y="220"></rect></g></g></g></svg>
            <div>Where:</div>
            <div>E = Extrusion distance</div>
            <div>k = scaling factor</div>
            <div>l = length of path</div>
            <div>B<sub>d</sub> = Diameter of syringe barrel</div>
            <div>N<sub>d</sub> = Diameter of nozzle</div>
          </div>
        </section>

        {/* File Format */}
        <section>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Required File Format</h3>
          <p class="text-gray-600 mb-3">Your G-code file must have the following header format (first 6 lines):</p>
          <div class="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            <div>Line 1: G90 or G91 (coordinate mode)</div>
            <div>Line 2: Z syringe diameter (e.g., "Z syringe diameter = 30")</div>
            <div>Line 3: A syringe diameter (e.g., "A syringe diameter = 30")</div>
            <div>Line 4: Z nozzle diameter (e.g., "Z nozzle diameter = 0.84")</div>
            <div>Line 5: A nozzle diameter (e.g., "A nozzle diameter = 0.84")</div>
            <div>Line 6: Extrusion coefficient (e.g., "extrusion coefficient = 1.0")</div>
            <div>Line 7+: G-code commands</div>
          </div>
          <p class="text-gray-600 mt-3">
            When the <b>extrusion coefficient</b> is set to 1, the extruded filament will have the same diameter as your nozzle. Setting it 2 will double the volume.
          </p>
          <table class="mt-4 w-full text-left">
            <thead>
              <tr class="bg-gray-200">
                <th class="px-4 py-2">BD Syringe</th>
                <th class="px-4 py-2">Inner diameter (mm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-4 py-2">1 ml</td>
                <td class="px-4 py-2">4.9</td>
              </tr>
              <tr>
                <td class="px-4 py-2">3 ml</td>
                <td class="px-4 py-2">8.6</td>
              </tr>
              <tr>
                <td class="px-4 py-2">5 ml</td>
                <td class="px-4 py-2">12.0</td>
              </tr>
              <tr>
                <td class="px-4 py-2">10 ml</td>
                <td class="px-4 py-2">14.4</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Usage Steps */}
        <section>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">How to Use</h3>
          <ol class="text-gray-600 space-y-2">
            <li><strong>1.</strong> Prepare your G-code file with the required 6-line header format</li>
            <li><strong>2.</strong> Click "Choose File" and select your .txt G-code file</li>
            <li><strong>3.</strong> Click "Process G-code" to run the extrusion calculations</li>
            <li><strong>4.</strong> Review the output messages for processing details</li>
            <li><strong>5.</strong> Download the modified G-code file with calculated E values</li>
          </ol>
        </section>

        {/* Example */}
        <section>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Example Input</h3>
          <div class="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            <div>G91</div>
            <div>; Z syringe diameter = 30</div>
            <div>; A syringe diameter = 30</div>
            <div>; Z nozzle diameter = 0.84</div>
            <div>; A nozzle diameter = 0.84</div>
            <div>; extrusion coefficient = 1.0</div>
            <div>B ; Use printhead 1 with Z axis</div>
            <div>G1 X10 Y10 F500 ; Move +10 mm, +10 mm in both x and y directions with a speed of 500 mm/min and extrude material</div>
            <div>G0 Z1 ; Move +1 mm in Z axis with previous speed (500 mm/min) without material extrusion</div>
            <div>K = 2 ; Change extrusion coefficient to 2</div>
            <div>G1 X10 ; Move +10 mm in X axis and extrude material</div>
          </div>
        </section>

        {/* Supported Commands */}
        <section>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Supported G-code Commands</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Movement Commands:</h4>
              <ul class="text-gray-600 space-y-1">
                <li>• G1 - Linear movement</li>
                <li>• G2 - Clockwise arc</li>
                <li>• G3 - Counter-clockwise arc</li>
                <li>• G90/G91 - Coordinate modes</li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Special Commands:</h4>
              <ul class="text-gray-600 space-y-1">
                <li>• T0/T1 - Tool changes</li>
                <li>• K - Change extrusion coefficient</li>
                <li>• B/C - Extrusion mode selection</li>
                <li>• "NO E" - Skip extrusion for line</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Key Features</h3>
          <ul class="text-gray-600 space-y-2">
            <li>• <strong>Automatic Extrusion Calculation:</strong> Computes E values based on movement distance and material properties</li>
            <li>• <strong>Dual Extruder Support:</strong> Handles T0 and T1 tool changes with different syringe/nozzle configurations</li>
            <li>• <strong>Arc Support:</strong> Properly calculates extrusion for G2/G3 arc movements</li>
            <li>• <strong>Coordinate Mode Support:</strong> Works with both absolute (G90) and relative (G91) positioning</li>
            <li>• <strong>Dynamic Coefficient Changes:</strong> Allows real-time adjustment of extrusion coefficient via K commands</li>
            <li>• <strong>Volume Calculation:</strong> Reports total extrusion length and volume</li>
          </ul>
        </section>
      </div>

      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 text-center">
        <button
          onClick={() => props.setShowHelp(false)}
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Close Help
        </button>
      </div>
    </div>
  </div>
  </>);
}

export default Help;

