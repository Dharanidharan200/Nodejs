import {
  HeaderService
} from "/chunk-LNSIQSBL.js";
import {
  BackdropService
} from "/chunk-OYZZ3HP7.js";
import "/chunk-5TSRY36A.js";
import {
  __privateAdd,
  __privateGet,
  __privateSet,
  __spreadValues
} from "/chunk-6JFMJ2HD.js";

// src/main.ts
import { bootstrapApplication } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_platform-browser.js?v=3df83732";

// src/app/app.component.ts
import { Component } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import { NavigationEnd, RouterOutlet } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_router.js?v=3df83732";

// src/app/icons/icon-subset.ts
import { cibCcAmex, cibCcApplePay, cibCcMastercard, cibCcPaypal, cibCcStripe, cibCcVisa, cibFacebook, cibGoogle, cibLinkedin, cibSkype, cibTwitter, cifBr, cifEs, cifFr, cifIn, cifPl, cifUs, cilAccountLogout, cilAlignCenter, cilAlignLeft, cilAlignRight, cilApplicationsSettings, cilArrowBottom, cilArrowRight, cilArrowTop, cilBasket, cilBell, cilBold, cilBookmark, cilCalculator, cilCalendar, cilChart, cilChartPie, cilCheck, cilChevronLeft, cilChevronRight, cilCloudDownload, cilCode, cilCommentSquare, cilContrast, cilCreditCard, cilCursor, cilDescription, cilDollar, cilDrop, cilEnvelopeClosed, cilEnvelopeOpen, cilFile, cilGrid, cilHome, cilInbox, cilIndentDecrease, cilIndentIncrease, cilItalic, cilJustifyCenter, cilLanguage, cilLayers, cilList, cilListNumbered, cilLocationPin, cilLockLocked, cilMagnifyingGlass, cilMap, cilMediaPlay, cilMediaRecord, cilMenu, cilMoon, cilNotes, cilOptions, cilPaperclip, cilPaperPlane, cilPen, cilPencil, cilPeople, cilPrint, cilPuzzle, cilReportSlash, cilSave, cilSettings, cilShare, cilShareAll, cilShareBoxed, cilSpeech, cilSpeedometer, cilSpreadsheet, cilStar, cilSun, cilTags, cilTask, cilTrash, cilUnderline, cilUser, cilUserFemale, cilUserFollow, cilUserUnfollow } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_icons.js?v=3df83732";

// src/app/icons/signet.ts
var signet = [
  "102 115",
  `<g style="fill: currentColor">
    <path d="M96 24.124 57 1.608a12 12 0 0 0-12 0L6 24.124a12.034 12.034 0 0 0-6 10.393V79.55a12.033 12.033 0 0 0 6 10.392l39 22.517a12 12 0 0 0 12 0l39-22.517a12.033 12.033 0 0 0 6-10.392V34.517a12.034 12.034 0 0 0-6-10.393ZM94 79.55a4 4 0 0 1-2 3.464l-39 22.517a4 4 0 0 1-4 0L10 83.014a4 4 0 0 1-2-3.464V34.517a4 4 0 0 1 2-3.464L49 8.536a4 4 0 0 1 4 0l39 22.517a4 4 0 0 1 2 3.464V79.55Z"/>
    <path d="M74.022 70.071h-2.866a4 4 0 0 0-1.925.494L51.95 80.05 32 68.531V45.554l19.95-11.519 17.29 9.455a4 4 0 0 0 1.919.49h2.863a2 2 0 0 0 2-2v-2.71a2 2 0 0 0-1.04-1.756L55.793 27.02a8.04 8.04 0 0 0-7.843.09L28 38.626a8.025 8.025 0 0 0-4 6.929V68.53a8 8 0 0 0 4 6.928l19.95 11.519a8.043 8.043 0 0 0 7.843.088l19.19-10.532a2 2 0 0 0 1.038-1.753v-2.71a2 2 0 0 0-2-2Z"/>
  </g>`
];

// src/app/icons/logo.ts
var logo = [
  "685 116",
  `<g>
    <g style="fill:#cf2f4c" transform="translate(0 -10)">
      <path d="M399.5024,45.8636h1.2164a.5659.5659,0,0,1,.64.64v43.52a.5658.5658,0,0,1-.64.6406h-1.4083a.7517.7517,0,0,1-.768-.4482L379.2144,51.6234c-.086-.085-.16-.1172-.2242-.0967-.0634.0225-.0957.0967-.0957.2246l.064,38.2715a.5662.5662,0,0,1-.64.6406h-1.2159a.5656.5656,0,0,1-.64-.6406V46.5033a.5657.5657,0,0,1,.64-.64h1.3438a.7524.7524,0,0,1,.7681.4473l19.3281,38.4639c.0849.0869.16.1181.2241.0966s.0957-.0966.0957-.2246V46.5033A.5657.5657,0,0,1,399.5024,45.8636Z"/>
      <path d="M360.418,90.1507l-2.4317-8.832a.2965.2965,0,0,0-.32-.1914H340.8984a.2951.2951,0,0,0-.32.1914L338.21,90.0873a.6584.6584,0,0,1-.7037.5761H336.29a.5863.5863,0,0,1-.48-.1923.58.58,0,0,1-.0961-.5118l12.0317-43.5839a.6436.6436,0,0,1,.7041-.5118h1.6a.6442.6442,0,0,1,.7041.5118l12.16,43.5839.0644.1914c0,.3428-.2139.5127-.64.5127h-1.2163A.6426.6426,0,0,1,360.418,90.1507ZM341.3145,78.9193a.3057.3057,0,0,0,.2236.0957h15.4883a.3076.3076,0,0,0,.2236-.0957c.0645-.0645.0742-.1172.0322-.16L349.41,49.8314c-.043-.085-.086-.1279-.128-.1279s-.0859.0429-.1279.1279l-7.8721,28.9277C341.2393,78.8021,341.25,78.8548,341.3145,78.9193Z"/>
      <path d="M419.8223,87.9427a11.2812,11.2812,0,0,1-3.3282-8.48v-22.4a11.2857,11.2857,0,0,1,3.3282-8.48,13.69,13.69,0,0,1,17.6318-.0323,11.0472,11.0472,0,0,1,3.36,8.3838v1.92a.566.566,0,0,1-.64.6407H438.958a.5654.5654,0,0,1-.64-.6407v-1.92a9.019,9.019,0,0,0-2.6563-6.7519,10.7705,10.7705,0,0,0-14.0161,0,9.0946,9.0946,0,0,0-2.6558,6.8164V79.5267a9.0367,9.0367,0,0,0,2.6875,6.8164,9.7141,9.7141,0,0,0,7.04,2.5918,9.5618,9.5618,0,0,0,6.9765-2.5595,8.9655,8.9655,0,0,0,2.6241-6.72v-8.32a.2268.2268,0,0,0-.2564-.2558h-8.3843a.5654.5654,0,0,1-.64-.6407V69.4154a.5662.5662,0,0,1,.64-.6406h10.4961a.5667.5667,0,0,1,.64.6406v9.9834a11.3465,11.3465,0,0,1-3.3277,8.5762,13.7344,13.7344,0,0,1-17.664-.0323Z"/>
      <path d="M461.3838,89.5755a10.9043,10.9043,0,0,1-4.3525-4.5439,14.4642,14.4642,0,0,1-1.5357-6.7842V46.5033a.5657.5657,0,0,1,.64-.64h1.2159a.5659.5659,0,0,1,.64.64v32a10.543,10.543,0,0,0,2.7207,7.5517,10.36,10.36,0,0,0,14.336,0,10.5506,10.5506,0,0,0,2.72-7.5517v-32a.5655.5655,0,0,1,.64-.64h1.2163a.5661.5661,0,0,1,.64.64V78.2474a13.0121,13.0121,0,0,1-3.3921,9.376,11.8983,11.8983,0,0,1-9.0239,3.5518A12.8539,12.8539,0,0,1,461.3838,89.5755Z"/>
      <path d="M495.9048,90.0228V46.5033a.5657.5657,0,0,1,.64-.64h1.2158a.5663.5663,0,0,1,.64.64v41.664a.2259.2259,0,0,0,.2558.2559h19.2a.5665.5665,0,0,1,.6407.64v.96a.5663.5663,0,0,1-.6407.6406H496.5449A.5656.5656,0,0,1,495.9048,90.0228Z"/>
      <path d="M554.6436,90.1507l-2.4322-8.832a.2959.2959,0,0,0-.32-.1914H535.123a.2939.2939,0,0,0-.3193.1914l-2.3682,8.7686a.659.659,0,0,1-.7041.5761h-1.2158a.5888.5888,0,0,1-.48-.1923.5824.5824,0,0,1-.0957-.5118l12.0322-43.5839a.643.643,0,0,1,.7036-.5118h1.6a.6442.6442,0,0,1,.7041.5118l12.16,43.5839.0635.1914c0,.3428-.2138.5127-.64.5127h-1.2158A.6423.6423,0,0,1,554.6436,90.1507ZM535.5391,78.9193a.31.31,0,0,0,.2246.0957h15.4878a.31.31,0,0,0,.2241-.0957c.0635-.0645.0737-.1172.0317-.16l-7.8716-28.9277c-.0434-.085-.0864-.1279-.1284-.1279s-.0859.0429-.1279.1279l-7.8721,28.9277C535.4644,78.8021,535.4756,78.8548,535.5391,78.9193Z"/>
      <path d="M592.4473,90.1507,583.68,69.4154a.2515.2515,0,0,0-.2559-.1924H573.44a.2263.2263,0,0,0-.2559.2559V90.0228a.566.566,0,0,1-.64.6406h-1.2164a.5654.5654,0,0,1-.64-.6406V46.5033a.5655.5655,0,0,1,.64-.64h12.5445a9.9783,9.9783,0,0,1,7.7436,3.2315A12.2019,12.2019,0,0,1,594.56,57.639a12.4342,12.4342,0,0,1-2.24,7.584,9.3626,9.3626,0,0,1-6.08,3.7442q-.2563.1288-.128.32l8.7041,20.6074.064.2558c0,.3428-.1919.5127-.5757.5127h-1.1523A.7027.7027,0,0,1,592.4473,90.1507ZM573.1836,48.3588v18.496a.2267.2267,0,0,0,.2559.2569h10.3037a7.6688,7.6688,0,0,0,6.0166-2.5928,9.878,9.878,0,0,0,2.3037-6.8154,10.2885,10.2885,0,0,0-2.272-6.9766,7.6035,7.6035,0,0,0-6.0483-2.624H573.44A.2263.2263,0,0,0,573.1836,48.3588Z"/>
    </g>
    <g style="fill:currentColor;">
      <g>
        <path d="m96.835 25.058-39-22.517a12 12 0 0 0-12 0l-39 22.517a12.034 12.034 0 0 0-6 10.392v45.033a12.033 12.033 0 0 0 6 10.393l39 22.516a12 12 0 0 0 12 0l39-22.516a12.033 12.033 0 0 0 6-10.393V35.45a12.033 12.033 0 0 0-6-10.392Zm-2 55.425a4 4 0 0 1-2 3.464l-39 22.517a4 4 0 0 1-4 0l-39-22.517a4 4 0 0 1-2-3.464V35.45a4 4 0 0 1 2-3.464l39-22.517a4 4 0 0 1 4 0l39 22.517a4 4 0 0 1 2 3.464v45.033Z"/>
        <path d="M74.857 71.005H71.99a4 4 0 0 0-1.925.493l-17.28 9.485-19.951-11.518V46.487l19.95-11.518 17.29 9.455a4 4 0 0 0 1.918.49h2.864a2 2 0 0 0 2-2v-2.712a2 2 0 0 0-1.04-1.754L56.628 27.952a8.04 8.04 0 0 0-7.843.09L28.835 39.56a8.025 8.025 0 0 0-4 6.929v22.976a8 8 0 0 0 4 6.928l19.95 11.519a8.043 8.043 0 0 0 7.843.087l19.19-10.53a2 2 0 0 0 1.038-1.754v-2.71a2 2 0 0 0-2-2Z"/>
      </g>
      <g transform="translate(118 34)">
         <path d="M51.58.362c-8.28.009-14.99 6.719-15 15v17.277c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15V15.36c-.01-8.28-6.72-14.99-15-15Zm7 32.277a7 7 0 0 1-14 0V15.36a7 7 0 0 1 14 0V32.64ZM14.914 8.421a7.01 7.01 0 0 1 7.868 6.075.99.99 0 0 0 .984.865h6.03a1.01 1.01 0 0 0 .999-1.097C30.189 6.14 23.216-.02 15.079.381 6.996.932.748 7.696.835 15.796v16.407C.748 40.305 6.996 47.068 15.079 47.62c8.138.401 15.111-5.76 15.716-13.884a1.01 1.01 0 0 0-.998-1.097h-6.03a.99.99 0 0 0-.985.865 7.01 7.01 0 0 1-7.867 6.075 7.164 7.164 0 0 1-6.08-7.184v-16.79a7.164 7.164 0 0 1 6.079-7.184ZM97.757 27.928a12.159 12.159 0 0 0 7.184-11.077v-3.702A12.15 12.15 0 0 0 92.793 1H75.835a1 1 0 0 0-1 1v44a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V29h6.622l7.915 17.414a1 1 0 0 0 .91.586h6.591a1 1 0 0 0 .91-1.414l-8.026-17.658Zm-.816-11.077A4.154 4.154 0 0 1 92.794 21H82.94V9h9.852a4.154 4.154 0 0 1 4.148 4.15v3.7ZM139.835 1h-26a1 1 0 0 0-1 1v44a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-19V27h13a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-13V9h19a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1ZM177.835 1h-6a1 1 0 0 0-1 1v22.648a7.007 7.007 0 1 1-14 0V2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v22.648a15.003 15.003 0 1 0 30 0V2a1 1 0 0 0-1-1Z"/>
         <rect width="8" height="38" x="186.835" y="1" rx="1"/>
      </g>
    </g>
  </g>`
];

// src/app/icons/icon-subset.ts
var iconSubset = {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibFacebook,
  cibGoogle,
  cibLinkedin,
  cibSkype,
  cibTwitter,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cilAccountLogout,
  cilAlignCenter,
  cilAlignLeft,
  cilAlignRight,
  cilApplicationsSettings,
  cilArrowBottom,
  cilArrowRight,
  cilArrowTop,
  cilBasket,
  cilBell,
  cilBold,
  cilBookmark,
  cilCalculator,
  cilCalendar,
  cilChart,
  cilChartPie,
  cilCheck,
  cilChevronLeft,
  cilChevronRight,
  cilCloudDownload,
  cilCode,
  cilCommentSquare,
  cilContrast,
  cilCreditCard,
  cilCursor,
  cilDescription,
  cilDollar,
  cilDrop,
  cilEnvelopeClosed,
  cilEnvelopeOpen,
  cilFile,
  cilGrid,
  cilHome,
  cilInbox,
  cilIndentDecrease,
  cilIndentIncrease,
  cilItalic,
  cilJustifyCenter,
  cilLanguage,
  cilLayers,
  cilList,
  cilListNumbered,
  cilLocationPin,
  cilLockLocked,
  cilMagnifyingGlass,
  cilMap,
  cilMediaPlay,
  cilMediaRecord,
  cilMenu,
  cilMoon,
  cilNotes,
  cilOptions,
  cilPaperclip,
  cilPaperPlane,
  cilPen,
  cilPencil,
  cilPeople,
  cilPrint,
  cilPuzzle,
  cilReportSlash,
  cilSave,
  cilSettings,
  cilShare,
  cilShareAll,
  cilShareBoxed,
  cilSpeech,
  cilSpeedometer,
  cilSpreadsheet,
  cilStar,
  cilSun,
  cilTags,
  cilTask,
  cilTrash,
  cilUnderline,
  cilUser,
  cilUserFemale,
  cilUserFollow,
  cilUserUnfollow,
  logo,
  signet
};
var IconSubset;
(function(IconSubset2) {
  IconSubset2["cibCcAmex"] = "cibCcAmex";
  IconSubset2["cibCcApplePay"] = "cibCcApplePay";
  IconSubset2["cibCcMastercard"] = "cibCcMastercard";
  IconSubset2["cibCcPaypal"] = "cibCcPaypal";
  IconSubset2["cibCcStripe"] = "cibCcStripe";
  IconSubset2["cibCcVisa"] = "cibCcVisa";
  IconSubset2["cibFacebook"] = "cibFacebook";
  IconSubset2["cibGoogle"] = "cibGoogle";
  IconSubset2["cibLinkedin"] = "cibLinkedin";
  IconSubset2["cibSkype"] = "cibSkype";
  IconSubset2["cibTwitter"] = "cibTwitter";
  IconSubset2["cifBr"] = "cifBr";
  IconSubset2["cifEs"] = "cifEs";
  IconSubset2["cifFr"] = "cifFr";
  IconSubset2["cifIn"] = "cifIn";
  IconSubset2["cifPl"] = "cifPl";
  IconSubset2["cifUs"] = "cifUs";
  IconSubset2["cilAccountLogout"] = "cilAccountLogout";
  IconSubset2["cilAlignCenter"] = "cilAlignCenter";
  IconSubset2["cilAlignLeft"] = "cilAlignLeft";
  IconSubset2["cilAlignRight"] = "cilAlignRight";
  IconSubset2["cilApplicationsSettings"] = "cilApplicationsSettings";
  IconSubset2["cilArrowBottom"] = "cilArrowBottom";
  IconSubset2["cilArrowRight"] = "cilArrowRight";
  IconSubset2["cilArrowTop"] = "cilArrowTop";
  IconSubset2["cilBasket"] = "cilBasket";
  IconSubset2["cilBell"] = "cilBell";
  IconSubset2["cilBold"] = "cilBold";
  IconSubset2["cilBookmark"] = "cilBookmark";
  IconSubset2["cilCalculator"] = "cilCalculator";
  IconSubset2["cilCalendar"] = "cilCalendar";
  IconSubset2["cilChart"] = "cilChart";
  IconSubset2["cilChartPie"] = "cilChartPie";
  IconSubset2["cilCheck"] = "cilCheck";
  IconSubset2["cilChevronLeft"] = "cilChevronLeft";
  IconSubset2["cilChevronRight"] = "cilChevronRight";
  IconSubset2["cilCloudDownload"] = "cilCloudDownload";
  IconSubset2["cilCode"] = "cilCode";
  IconSubset2["cilCommentSquare"] = "cilCommentSquare";
  IconSubset2["cilContrast"] = "cilContrast\u015B";
  IconSubset2["cilCreditCard"] = "cilCreditCard";
  IconSubset2["cilCursor"] = "cilCursor";
  IconSubset2["cilDescription"] = "cilDescription";
  IconSubset2["cilDollar"] = "cilDollar";
  IconSubset2["cilDrop"] = "cilDrop";
  IconSubset2["cilEnvelopeClosed"] = "cilEnvelopeClosed";
  IconSubset2["cilEnvelopeOpen"] = "cilEnvelopeOpen";
  IconSubset2["cilFile"] = "cilFile";
  IconSubset2["cilGrid"] = "cilGrid";
  IconSubset2["cilHome"] = "cilHome";
  IconSubset2["cilInbox"] = "cilInbox";
  IconSubset2["cilIndentDecrease"] = "cilIndentDecrease";
  IconSubset2["cilIndentIncrease"] = "cilIndentIncrease";
  IconSubset2["cilItalic"] = "cilItalic";
  IconSubset2["cilJustifyCenter"] = "cilJustifyCenter";
  IconSubset2["cilLanguage"] = "cilLanguage";
  IconSubset2["cilLayers"] = "cilLayers";
  IconSubset2["cilList"] = "cilList";
  IconSubset2["cilListNumbered"] = "cilListNumbered";
  IconSubset2["cilLocationPin"] = "cilLocationPin";
  IconSubset2["cilLockLocked"] = "cilLockLocked";
  IconSubset2["cilMagnifyingGlass"] = "cilMagnifyingGlass";
  IconSubset2["cilMap"] = "cilMap";
  IconSubset2["cilMediaPlay"] = "cilMediaPlay";
  IconSubset2["cilMediaRecord"] = "cilMediaRecord";
  IconSubset2["cilMenu"] = "cilMenu";
  IconSubset2["cilMoon"] = "cilMoon";
  IconSubset2["cilNotes"] = "cilNotes";
  IconSubset2["cilOptions"] = "cilOptions";
  IconSubset2["cilPaperclip"] = "cilPaperclip";
  IconSubset2["cilPaperPlane"] = "cilPaperPlane";
  IconSubset2["cilPen"] = "cilPen";
  IconSubset2["cilPencil"] = "cilPencil";
  IconSubset2["cilPeople"] = "cilPeople";
  IconSubset2["cilPrint"] = "cilPrint";
  IconSubset2["cilPuzzle"] = "cilPuzzle";
  IconSubset2["cilReportSlash"] = "cilReportSlash";
  IconSubset2["cilSave"] = "cilSave";
  IconSubset2["cilSettings"] = "cilSettings";
  IconSubset2["cilShare"] = "cilShare";
  IconSubset2["cilShareAll"] = "cilShareAll";
  IconSubset2["cilShareBoxed"] = "cilShareBoxed";
  IconSubset2["cilSpeech"] = "cilSpeech";
  IconSubset2["cilSpeedometer"] = "cilSpeedometer";
  IconSubset2["cilSpreadsheet"] = "cilSpreadsheet";
  IconSubset2["cilStar"] = "cilStar";
  IconSubset2["cilSun"] = "cilSun";
  IconSubset2["cilTags"] = "cilTags";
  IconSubset2["cilTask"] = "cilTask";
  IconSubset2["cilTrash"] = "cilTrash";
  IconSubset2["cilUnderline"] = "cilUnderline";
  IconSubset2["cilUser"] = "cilUser";
  IconSubset2["cilUserFemale"] = "cilUserFemale";
  IconSubset2["cilUserFollow"] = "cilUserFollow";
  IconSubset2["cilUserUnfollow"] = "cilUserUnfollow";
  IconSubset2["logo"] = "logo";
  IconSubset2["signet"] = "signet";
})(IconSubset || (IconSubset = {}));

// src/app/app.component.ts
import { HttpClientModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_common_http.js?v=3df83732";
import { NgxSpinnerModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/ngx-spinner.js?v=3df83732";
import * as i0 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import * as i1 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_router.js?v=3df83732";
import * as i2 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_platform-browser.js?v=3df83732";
import * as i3 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_icons-angular.js?v=3df83732";
import * as i4 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/ngx-spinner.js?v=3df83732";
var _AppComponent = class _AppComponent {
  constructor(router, titleService, iconSetService) {
    this.router = router;
    this.titleService = titleService;
    this.iconSetService = iconSetService;
    this.title = "SANDS - PO TOOL";
    this.titleService.setTitle(this.title);
    this.iconSetService.icons = __spreadValues({}, iconSubset);
  }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
};
_AppComponent.\u0275fac = function AppComponent_Factory(t) {
  return new (t || _AppComponent)(i0.\u0275\u0275directiveInject(i1.Router), i0.\u0275\u0275directiveInject(i2.Title), i0.\u0275\u0275directiveInject(i3.IconSetService));
};
_AppComponent.\u0275cmp = /* @__PURE__ */ i0.\u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: true, features: [i0.\u0275\u0275StandaloneFeature], decls: 2, vars: 0, consts: [["bdColor", "rgba(51,51,51,0.8)", "size", "medium", "color", "#fff", "type", "ball-scale-multiple"]], template: function AppComponent_Template(rf, ctx) {
  if (rf & 1) {
    i0.\u0275\u0275element(0, "router-outlet")(1, "ngx-spinner", 0);
  }
}, dependencies: [RouterOutlet, HttpClientModule, NgxSpinnerModule, i4.NgxSpinnerComponent], encapsulation: 2 });
var AppComponent = _AppComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 17 });
})();

// src/app/app.config.ts
import { importProvidersFrom } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import { provideAnimations } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_platform-browser_animations.js?v=3df83732";
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation, withInMemoryScrolling, withRouterConfig, withViewTransitions } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_router.js?v=3df83732";
import { DropdownModule, SidebarModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_angular.js?v=3df83732";
import { IconSetService as IconSetService2 } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_icons-angular.js?v=3df83732";

// src/app/layout/default-layout/default-footer/default-footer.component.ts
import { Component as Component2 } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import { FooterComponent } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_angular.js?v=3df83732";
import * as i02 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
var _DefaultFooterComponent = class _DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
};
_DefaultFooterComponent.\u0275fac = function DefaultFooterComponent_Factory(t) {
  return new (t || _DefaultFooterComponent)();
};
_DefaultFooterComponent.\u0275cmp = /* @__PURE__ */ i02.\u0275\u0275defineComponent({ type: _DefaultFooterComponent, selectors: [["app-default-footer"]], standalone: true, features: [i02.\u0275\u0275InheritDefinitionFeature, i02.\u0275\u0275StandaloneFeature], decls: 6, vars: 0, consts: [[1, "ms-auto"], ["href", "https://www.sandsindia.com", "target", "_blank"]], template: function DefaultFooterComponent_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275element(0, "div");
    i02.\u0275\u0275elementStart(1, "div", 0);
    i02.\u0275\u0275text(2, " \xA9 2024, Powered by ");
    i02.\u0275\u0275elementStart(3, "a", 1)(4, "span");
    i02.\u0275\u0275text(5, "Signals and Systems India Pvt Ltd");
    i02.\u0275\u0275elementEnd()()();
  }
} });
var DefaultFooterComponent = _DefaultFooterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassDebugInfo(DefaultFooterComponent, { className: "DefaultFooterComponent", filePath: "src/app/layout/default-layout/default-footer/default-footer.component.ts", lineNumber: 10 });
})();

// src/app/layout/default-layout/default-header/default-header.component.ts
import { Component as Component3, computed, DestroyRef, inject, Input, ViewChild } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import { AvatarComponent, BadgeComponent, BreadcrumbRouterComponent, ColorModeService, ContainerComponent, DropdownComponent, DropdownDividerDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, HeaderComponent, HeaderNavComponent, HeaderTogglerDirective, NavItemComponent, NavLinkDirective, ProgressBarDirective, ProgressComponent, SidebarToggleDirective, TextColorDirective, ThemeDirective, BadgeModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_angular.js?v=3df83732";
import { NgStyle, NgTemplateOutlet } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_common.js?v=3df83732";
import { ActivatedRoute, RouterLink, RouterLinkActive } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_router.js?v=3df83732";
import { IconDirective } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_icons-angular.js?v=3df83732";
import { takeUntilDestroyed } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core_rxjs-interop.js?v=3df83732";
import { delay, filter, map, tap } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/rxjs_operators.js?v=3df83732";
import { MatIconModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_icon.js?v=3df83732";
import { MatMenuModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_menu.js?v=3df83732";
import { MatListModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_list.js?v=3df83732";
import { CommonModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_common.js?v=3df83732";
import { MatTooltipModule } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_tooltip.js?v=3df83732";
import { MatMenuTrigger } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_menu.js?v=3df83732";
import { ToastrModule, ToastrService } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/ngx-toastr.js?v=3df83732";
import * as i03 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import * as i12 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_router.js?v=3df83732";
import * as i22 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_common.js?v=3df83732";
import * as i32 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_icon.js?v=3df83732";
import * as i42 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_menu.js?v=3df83732";
import * as i5 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_list.js?v=3df83732";
import * as i6 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_material_tooltip.js?v=3df83732";
var _forTrack0 = ($index, $item) => $item.name;
var _c0 = () => ({ placement: "bottom-start" });
var _c1 = () => [];
function DefaultHeaderComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275elementStart(0, "div", 18)(1, "c-badge", 19);
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = i03.\u0275\u0275nextContext();
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(ctx_r1.notificationCount);
  }
}
function DefaultHeaderComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275elementStart(0, "div", 18)(1, "c-badge", 19);
    i03.\u0275\u0275text(2, "99+");
    i03.\u0275\u0275elementEnd()();
  }
}
function DefaultHeaderComponent_mat_list_18_mat_list_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275elementStart(0, "mat-list-item", 21)(1, "div", 22);
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275elementStart(3, "span", 23);
    i03.\u0275\u0275listener("click", function DefaultHeaderComponent_mat_list_18_mat_list_item_1_Template_span_click_3_listener() {
      const notification_r4 = i03.\u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = i03.\u0275\u0275nextContext(2);
      return i03.\u0275\u0275resetView(ctx_r1.deleteNotification(notification_r4.notification_id));
    });
    i03.\u0275\u0275text(4, "\xD7");
    i03.\u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const notification_r4 = ctx.$implicit;
    const i_r5 = ctx.index;
    const ctx_r1 = i03.\u0275\u0275nextContext(2);
    i03.\u0275\u0275property("ngClass", ctx_r1.getNotificationClass(i_r5));
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate1(" ", notification_r4.notification_msg, "\xA0 ");
  }
}
function DefaultHeaderComponent_mat_list_18_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275elementStart(0, "mat-list");
    i03.\u0275\u0275template(1, DefaultHeaderComponent_mat_list_18_mat_list_item_1_Template, 5, 2, "mat-list-item", 20);
    i03.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = i03.\u0275\u0275nextContext();
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("ngForOf", ctx_r1.notifications);
  }
}
function DefaultHeaderComponent_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275elementStart(0, "button", 24);
    i03.\u0275\u0275listener("click", function DefaultHeaderComponent_button_19_Template_button_click_0_listener() {
      i03.\u0275\u0275restoreView(_r6);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.clearAllNotifications());
    });
    i03.\u0275\u0275elementStart(1, "mat-icon");
    i03.\u0275\u0275text(2, "notifications_off");
    i03.\u0275\u0275elementEnd();
    i03.\u0275\u0275elementStart(3, "span", 25);
    i03.\u0275\u0275text(4, "Clear All Notifications");
    i03.\u0275\u0275elementEnd()();
  }
}
function DefaultHeaderComponent_ng_container_21_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275elementContainer(0);
  }
}
function DefaultHeaderComponent_ng_template_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275elementStart(0, "c-dropdown", 26)(1, "button", 27);
    i03.\u0275\u0275element(2, "c-avatar", 28);
    i03.\u0275\u0275elementEnd();
    i03.\u0275\u0275elementStart(3, "ul", 29)(4, "li")(5, "a", 30);
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275element(6, "svg", 31);
    i03.\u0275\u0275text(7);
    i03.\u0275\u0275elementEnd()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275elementStart(8, "li")(9, "a", 32);
    i03.\u0275\u0275listener("click", function DefaultHeaderComponent_ng_template_22_Template_a_click_9_listener() {
      i03.\u0275\u0275restoreView(_r7);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.logoutFunction());
    });
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275element(10, "svg", 33);
    i03.\u0275\u0275text(11, " Logout ");
    i03.\u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = i03.\u0275\u0275nextContext();
    i03.\u0275\u0275property("popperOptions", i03.\u0275\u0275pureFunction0(4, _c0));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("caret", false);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("size", "md");
    i03.\u0275\u0275advance(5);
    i03.\u0275\u0275textInterpolate1(" ", ctx_r1.verified_user_name, " ");
  }
}
function DefaultHeaderComponent_ng_template_24_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275elementStart(0, "button", 39);
    i03.\u0275\u0275listener("click", function DefaultHeaderComponent_ng_template_24_For_5_Template_button_click_0_listener() {
      const mode_r9 = i03.\u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = i03.\u0275\u0275nextContext(2);
      return i03.\u0275\u0275resetView(ctx_r1.colorMode.set(mode_r9.name));
    });
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275element(1, "svg", 40);
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mode_r9 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(2);
    i03.\u0275\u0275property("active", ctx_r1.colorMode() === mode_r9.name)("routerLink", i03.\u0275\u0275pureFunction0(4, _c1));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("name", mode_r9.icon);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate1(" ", mode_r9.text, " ");
  }
}
function DefaultHeaderComponent_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275elementStart(0, "c-dropdown", 34)(1, "button", 35);
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275element(2, "svg", 36);
    i03.\u0275\u0275elementEnd();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275elementStart(3, "div", 37);
    i03.\u0275\u0275repeaterCreate(4, DefaultHeaderComponent_ng_template_24_For_5_Template, 3, 5, "button", 38, _forTrack0);
    i03.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = i03.\u0275\u0275nextContext();
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("caret", false);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("name", ctx_r1.icons());
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275repeater(ctx_r1.colorModes);
  }
}
var _activatedRoute, _colorModeService, _destroyRef;
var _DefaultHeaderComponent = class _DefaultHeaderComponent extends HeaderComponent {
  constructor(router, ref) {
    super();
    __privateAdd(this, _activatedRoute, void 0);
    __privateAdd(this, _colorModeService, void 0);
    __privateAdd(this, _destroyRef, void 0);
    this.router = router;
    this.ref = ref;
    __privateSet(this, _activatedRoute, inject(ActivatedRoute));
    __privateSet(this, _colorModeService, inject(ColorModeService));
    this.colorMode = __privateGet(this, _colorModeService).colorMode;
    __privateSet(this, _destroyRef, inject(DestroyRef));
    this.headerService = inject(HeaderService);
    this.toastr = inject(ToastrService);
    this.verified_email_name = localStorage.getItem("get_username");
    this.verified_user_name = localStorage.getItem("get_username_name");
    this.notificationCount = 0;
    this.colorModes = [
      { name: "light", text: "Light", icon: "cilSun" },
      { name: "dark", text: "Dark", icon: "cilMoon" },
      { name: "auto", text: "Auto", icon: "cilContrast" }
    ];
    this.icons = computed(() => {
      const currentMode = this.colorMode();
      return this.colorModes.find((mode) => mode.name === currentMode)?.icon ?? "cilSun";
    });
    this.sidebarId = "sidebar1";
    this.newMessages = [
      {
        id: 0,
        from: "Jessica Williams",
        avatar: "7.jpg",
        status: "success",
        title: "Urgent: System Maintenance Tonight",
        time: "Just now",
        link: "apps/email/inbox/message",
        message: "Attention team, we'll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly..."
      },
      {
        id: 1,
        from: "Richard Johnson",
        avatar: "6.jpg",
        status: "warning",
        title: "Project Update: Milestone Achieved",
        time: "5 minutes ago",
        link: "apps/email/inbox/message",
        message: "Kudos on hitting sales targets last quarter! Let's keep the momentum. New goals, new victories ahead..."
      },
      {
        id: 2,
        from: "Angela Rodriguez",
        avatar: "5.jpg",
        status: "danger",
        title: "Social Media Campaign Launch",
        time: "1:52 PM",
        link: "apps/email/inbox/message",
        message: "Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement..."
      },
      {
        id: 3,
        from: "Jane Lewis",
        avatar: "4.jpg",
        status: "info",
        title: "Inventory Checkpoint",
        time: "4:03 AM",
        link: "apps/email/inbox/message",
        message: "Team, it's time for our monthly inventory check. Accurate counts ensure smooth operations. Let's nail it..."
      },
      {
        id: 3,
        from: "Ryan Miller",
        avatar: "4.jpg",
        status: "info",
        title: "Customer Feedback Results",
        time: "3 days ago",
        link: "apps/email/inbox/message",
        message: "Our latest customer feedback is in. Let's analyze and discuss improvements for an even better service..."
      }
    ];
    this.newNotifications = [
      { id: 0, title: "New user registered", icon: "cilUserFollow", color: "success" },
      { id: 1, title: "User deleted", icon: "cilUserUnfollow", color: "danger" },
      { id: 2, title: "Sales report is ready", icon: "cilChartPie", color: "info" },
      { id: 3, title: "New client", icon: "cilBasket", color: "primary" },
      { id: 4, title: "Server overloaded", icon: "cilSpeedometer", color: "warning" }
    ];
    this.newStatus = [
      { id: 0, title: "CPU Usage", value: 25, color: "info", details: "348 Processes. 1/4 Cores." },
      { id: 1, title: "Memory Usage", value: 70, color: "warning", details: "11444GB/16384MB" },
      { id: 2, title: "SSD 1 Usage", value: 90, color: "danger", details: "243GB/256GB" }
    ];
    this.newTasks = [
      { id: 0, title: "Upgrade NPM", value: 0, color: "info" },
      { id: 1, title: "ReactJS Version", value: 25, color: "danger" },
      { id: 2, title: "VueJS Version", value: 50, color: "warning" },
      { id: 3, title: "Add new layouts", value: 75, color: "info" },
      { id: 4, title: "Angular Version", value: 100, color: "success" }
    ];
    __privateGet(this, _colorModeService).localStorageItemName.set("coreui-free-angular-admin-template-theme-default");
    __privateGet(this, _colorModeService).eventName.set("ColorSchemeChange");
    __privateGet(this, _activatedRoute).queryParams.pipe(delay(1), map((params) => params["theme"]?.match(/^[A-Za-z0-9\s]+/)?.[0]), filter((theme) => ["dark", "light", "auto"].includes(theme)), tap((theme) => {
      this.colorMode.set(theme);
    }), takeUntilDestroyed(__privateGet(this, _destroyRef))).subscribe();
  }
  ngOnInit() {
    this.verified_user_id = localStorage.getItem("get_username_id");
    this.postUserNameGetNotifiaction();
    this.setInterval();
  }
  postUserNameGetNotifiaction() {
    let json = {
      user_id: this.verified_user_id
    };
    this.headerService.postUserNameGetNotifiaction(json).subscribe((data) => {
      this.notifications = data;
      this.notificationCount = this.notifications.length;
      this.ref.detectChanges();
    });
  }
  setInterval() {
    setInterval(() => {
      this.postUserNameGetNotifiaction();
    }, 5e5);
  }
  deleteNotification(event) {
    let json = {
      notification_id: event,
      user_id: this.verified_user_id
    };
    this.headerService.postUserNameDeleteNotifiaction(json).subscribe((data) => {
      this.postUserNameGetNotifiaction();
      this.menuTrigger.openMenu();
      this.ref.detectChanges();
    });
  }
  clearAllNotifications() {
    let json = {
      user_id: this.verified_user_id
    };
    this.headerService.postUserNameDeleteNotifiaction(json).subscribe((data) => {
      this.postUserNameGetNotifiaction();
      this.ref.detectChanges();
    });
  }
  notificationTrigger() {
    if (this.notifications?.length == 0) {
      this.menuTrigger.closeMenu();
      this.toastr.info("No Notifications", "", {
        timeOut: 3e3
      });
    }
  }
  getNotificationClass(index) {
    const colors = [
      "color-0",
      "color-1",
      "color-2",
      "color-3",
      "color-4",
      "color-5",
      "color-6",
      "color-7",
      "color-8",
      "color-9"
      // Add more colors as needed
    ];
    return colors[index % colors.length];
  }
  logoutFunction() {
    sessionStorage.clear();
    localStorage.clear();
    localStorage.removeItem("get_username");
    localStorage.removeItem("get_username_name");
    localStorage.removeItem("get_username_username");
    localStorage.removeItem("get_username_id");
    localStorage.removeItem("get_role");
    localStorage.removeItem("emp_designation");
    localStorage.removeItem("get_department_id");
    localStorage.removeItem("module_data");
    this.router.navigate(["./login"]);
  }
};
_activatedRoute = new WeakMap();
_colorModeService = new WeakMap();
_destroyRef = new WeakMap();
_DefaultHeaderComponent.\u0275fac = function DefaultHeaderComponent_Factory(t) {
  return new (t || _DefaultHeaderComponent)(i03.\u0275\u0275directiveInject(i12.Router), i03.\u0275\u0275directiveInject(i03.ChangeDetectorRef));
};
_DefaultHeaderComponent.\u0275cmp = /* @__PURE__ */ i03.\u0275\u0275defineComponent({ type: _DefaultHeaderComponent, selectors: [["app-default-header"]], viewQuery: function DefaultHeaderComponent_Query(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275viewQuery(MatMenuTrigger, 5);
  }
  if (rf & 2) {
    let _t;
    i03.\u0275\u0275queryRefresh(_t = i03.\u0275\u0275loadQuery()) && (ctx.menuTrigger = _t.first);
  }
}, inputs: { sidebarId: "sidebarId" }, standalone: true, features: [i03.\u0275\u0275InheritDefinitionFeature, i03.\u0275\u0275StandaloneFeature], decls: 26, vars: 8, consts: [["menu", "matMenu"], ["userDropdown", ""], ["themeDropdown", ""], [1, "header-nav", "border-bottom", "px-4", "align-items-center", 3, "fluid"], [1, "mx-0", "d-md-flex", "align-items-center"], ["cHeaderToggler", "", "toggle", "visible", 1, "btn", 2, "margin-inline-start", "-14px", 3, "cSidebarToggle"], ["cIcon", "", "name", "cilMenu", "size", "lg"], [1, "head_tag"], [1, "head_tag2"], [1, "d-md-flex", "ms-auto"], [3, "click", "matMenuTriggerFor"], ["cNavLink", "", 2, "display", "flex"], ["style", "margin-left: -8px;margin-top: -9px;", 4, "ngIf"], [1, "notification-mat-menu"], [4, "ngIf"], ["mat-menu-item", "", 3, "click", 4, "ngIf"], [1, "mx-0"], [4, "ngTemplateOutlet"], [2, "margin-left", "-8px", "margin-top", "-9px"], ["color", "danger", 2, "padding-left", "5px", "padding-right", "5px"], ["class", "notification-item", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "notification-item", 3, "ngClass"], [1, "notification-content"], ["matTooltip", "Clear", "matTooltipPosition", "right", 1, "delete-button", 3, "click"], ["mat-menu-item", "", 3, "click"], [2, "font-size", "15px"], ["variant", "nav-item", 3, "popperOptions"], ["cDropdownToggle", "", 1, "py-0", "pe-0", 3, "caret"], ["shape", "rounded-1", "src", "../../../../assets/SANDS Logo Icon 24x24.svg", "status", "success", "textColor", "primary", 3, "size"], ["cDropdownMenu", "", 1, "pt-0", "w-auto"], ["cDropdownItem", ""], ["cIcon", "", "name", "cilUser", 1, "me-2"], ["cDropdownItem", "", "routerLink", "", 3, "click"], ["cIcon", "", "name", "cilAccountLogout", 1, "me-2"], ["alignment", "end", "variant", "nav-item"], ["cDropdownToggle", "", 3, "caret"], ["cIcon", "", "size", "lg", 3, "name"], ["cDropdownMenu", ""], ["cDropdownItem", "", 1, "d-flex", "align-items-center", 3, "active", "routerLink"], ["cDropdownItem", "", 1, "d-flex", "align-items-center", 3, "click", "active", "routerLink"], ["cIcon", "", "size", "lg", 1, "me-2", 3, "name"]], template: function DefaultHeaderComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275elementContainerStart(0);
    i03.\u0275\u0275elementStart(1, "c-container", 3)(2, "c-header-nav", 4)(3, "button", 5);
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275element(4, "svg", 6);
    i03.\u0275\u0275elementEnd();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275elementStart(5, "p", 7);
    i03.\u0275\u0275text(6, " SANDS CONNECT");
    i03.\u0275\u0275elementEnd();
    i03.\u0275\u0275elementStart(7, "p", 8);
    i03.\u0275\u0275text(8, "SIGNALS AND SYSTEMS INDIA PVT LTD");
    i03.\u0275\u0275elementEnd()();
    i03.\u0275\u0275elementStart(9, "c-header-nav", 9)(10, "div", 10);
    i03.\u0275\u0275listener("click", function DefaultHeaderComponent_Template_div_click_10_listener() {
      i03.\u0275\u0275restoreView(_r1);
      return i03.\u0275\u0275resetView(ctx.notificationTrigger());
    });
    i03.\u0275\u0275elementStart(11, "a", 11)(12, "mat-icon");
    i03.\u0275\u0275text(13, "notifications");
    i03.\u0275\u0275elementEnd();
    i03.\u0275\u0275template(14, DefaultHeaderComponent_div_14_Template, 3, 1, "div", 12)(15, DefaultHeaderComponent_div_15_Template, 3, 0, "div", 12);
    i03.\u0275\u0275elementEnd()();
    i03.\u0275\u0275elementStart(16, "mat-menu", 13, 0);
    i03.\u0275\u0275template(18, DefaultHeaderComponent_mat_list_18_Template, 2, 1, "mat-list", 14)(19, DefaultHeaderComponent_button_19_Template, 5, 0, "button", 15);
    i03.\u0275\u0275elementEnd()();
    i03.\u0275\u0275elementStart(20, "c-header-nav", 16);
    i03.\u0275\u0275template(21, DefaultHeaderComponent_ng_container_21_Template, 1, 0, "ng-container", 17);
    i03.\u0275\u0275elementEnd()();
    i03.\u0275\u0275elementContainerEnd();
    i03.\u0275\u0275template(22, DefaultHeaderComponent_ng_template_22_Template, 12, 5, "ng-template", null, 1, i03.\u0275\u0275templateRefExtractor)(24, DefaultHeaderComponent_ng_template_24_Template, 6, 2, "ng-template", null, 2, i03.\u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const menu_r10 = i03.\u0275\u0275reference(17);
    const userDropdown_r11 = i03.\u0275\u0275reference(23);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("fluid", true);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275property("cSidebarToggle", ctx.sidebarId);
    i03.\u0275\u0275advance(7);
    i03.\u0275\u0275property("matMenuTriggerFor", menu_r10);
    i03.\u0275\u0275advance(4);
    i03.\u0275\u0275property("ngIf", (ctx.notifications == null ? null : ctx.notifications.length) > 0 && (ctx.notifications == null ? null : ctx.notifications.length) <= 99);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("ngIf", (ctx.notifications == null ? null : ctx.notifications.length) > 0 && (ctx.notifications == null ? null : ctx.notifications.length) > 99);
    i03.\u0275\u0275advance(3);
    i03.\u0275\u0275property("ngIf", (ctx.notifications == null ? null : ctx.notifications.length) > 0);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275property("ngIf", (ctx.notifications == null ? null : ctx.notifications.length) > 0);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275property("ngTemplateOutlet", userDropdown_r11);
  }
}, dependencies: [CommonModule, i22.NgClass, i22.NgForOf, i22.NgIf, i22.NgTemplateOutlet, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavLinkDirective, RouterLink, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, BadgeModule, MatIconModule, i32.MatIcon, MatMenuModule, i42.MatMenu, i42.MatMenuItem, i42.MatMenuTrigger, MatListModule, i5.MatList, i5.MatListItem, MatTooltipModule, i6.MatTooltip, ToastrModule], styles: ["\n\nmat-list-item[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  padding: 2px 10px;\n}\n.mdc-list-item[_ngcontent-%COMP%] {\n  height: fit-content !important;\n  padding: 3px 8px;\n  cursor: pointer;\n  font-size: 12px;\n  overflow: auto;\n  border-bottom: 1px solid rgba(195, 202, 202, 0.705);\n  border-left: 3px solid rgba(255, 204, 0, 0);\n  border-right: 3px solid rgba(255, 204, 0, 0);\n}\n  .mat-mdc-menu-content {\n  padding: 8px 0px 0px !important;\n}\n  .mdc-list {\n  padding: 8px 0px 3px !important;\n}\n.notification-item[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n  padding-right: 10px;\n  border-bottom: 1px solid rgba(195, 202, 202, 0.705);\n  border-left: 3px solid rgba(255, 204, 0, 0);\n  border-right: 3px solid rgba(255, 204, 0, 0);\n}\n.notification-item[_ngcontent-%COMP%]:hover {\n  border-left: 3px solid #FF4081;\n}\n.notification-content[_ngcontent-%COMP%] {\n  white-space: normal;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n  text-align: justify;\n  line-height: 17px;\n  color: #000000;\n  font-size: 13px;\n}\n.delete-button[_ngcontent-%COMP%] {\n  color: #8a8888;\n  float: right;\n  font-size: 18px;\n  font-weight: 600;\n  cursor: pointer;\n  font-style: normal;\n  letter-spacing: normal;\n}\n.delete-button[_ngcontent-%COMP%]:hover {\n  color: #666464;\n}\n  .mat-mdc-menu-panel {\n  max-width: 350px !important;\n}\n  .notification-mat-menu {\n  max-width: 350px;\n  max-height: 400px;\n  width: 350px !important;\n  height: fit-content !important;\n  overflow: auto;\n}\n.mat-mdc-menu-item[_ngcontent-%COMP%] {\n  min-height: 45px !important;\n}\n.color-0[_ngcontent-%COMP%] {\n  background-color: #ffcccc;\n}\n.color-1[_ngcontent-%COMP%] {\n  background-color: #cce5ff;\n}\n.color-2[_ngcontent-%COMP%] {\n  background-color: #d4edda;\n}\n.color-3[_ngcontent-%COMP%] {\n  background-color: #fff3cd;\n}\n.color-4[_ngcontent-%COMP%] {\n  background-color: #d1ecf1;\n}\n.color-5[_ngcontent-%COMP%] {\n  background-color: #f8d7da;\n}\n.color-6[_ngcontent-%COMP%] {\n  background-color: #e2e3e5;\n}\n.color-7[_ngcontent-%COMP%] {\n  background-color: #f5c6cb;\n}\n.color-8[_ngcontent-%COMP%] {\n  background-color: #d6d8db;\n}\n.color-9[_ngcontent-%COMP%] {\n  background-color: #c3e6cb;\n}\n.head_tag[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 4px 10px;\n  font-weight: 500;\n  font-size: 15px;\n  color: #000;\n  border-left: 0.8px solid #ededf0;\n  letter-spacing: 0.7px;\n}\n.head_tag2[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 4px 10px;\n  font-weight: 500;\n  font-size: 15px;\n  color: #000;\n  border-left: 0.8px solid #ededf0;\n  letter-spacing: 0.7px;\n}\n@media screen and (min-width: 300px) and (max-width: 767px) {\n  .header-nav[_ngcontent-%COMP%] {\n    flex-wrap: revert;\n  }\n  .head_tag[_ngcontent-%COMP%] {\n    margin: 0;\n    padding: 4px 10px;\n    font-weight: 500;\n    font-size: 12px;\n    color: #000;\n    border-left: 0.8px solid #ededf0;\n    letter-spacing: 0.5px;\n  }\n  .head_tag2[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=default-header.component.css.map */"] });
var DefaultHeaderComponent = _DefaultHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(DefaultHeaderComponent, { className: "DefaultHeaderComponent", filePath: "src/app/layout/default-layout/default-header/default-header.component.ts", lineNumber: 47 });
})();

// src/app/layout/default-layout/default-layout.component.ts
import { Component as Component4, ElementRef, Renderer2, inject as inject2 } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import { RouterLink as RouterLink2, RouterOutlet as RouterOutlet2 } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_router.js?v=3df83732";
import { NgScrollbar } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/ngx-scrollbar.js?v=3df83732";
import { IconDirective as IconDirective2 } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_icons-angular.js?v=3df83732";
import { ContainerComponent as ContainerComponent2, ShadowOnScrollDirective, SidebarBrandComponent, SidebarComponent, SidebarFooterComponent, SidebarHeaderComponent, SidebarNavComponent, SidebarToggleDirective as SidebarToggleDirective2, SidebarTogglerDirective } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@coreui_angular.js?v=3df83732";
import * as i04 from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
var _c02 = () => [];
var Role;
(function(Role2) {
  Role2["SuperAdmin"] = "1";
  Role2["Admin"] = "2";
  Role2["Editor"] = "3";
  Role2["Viewer"] = "4";
})(Role || (Role = {}));
var _DefaultLayoutComponent = class _DefaultLayoutComponent {
  constructor() {
    this.backdropService = inject2(BackdropService);
    this.renderer = inject2(Renderer2);
    this.elementRef = inject2(ElementRef);
    this.navItems = [
      {
        name: "Visit Plan",
        url: "/marketing/visitplan",
        iconComponent: { name: "cil-puzzle" },
        role: 16
      },
      {
        name: "Dashboard",
        url: "/dashboardpo/dashboarddetailcrm1",
        iconComponent: { name: "cil-speedometer" },
        role: 1
      },
      {
        name: "Master",
        url: "/master",
        iconComponent: { name: "cil-star" },
        children: [
          {
            name: "Customer",
            url: "/master/customerdetails",
            icon: "nav-icon-bullet",
            role: 14
          },
          {
            name: "Employee",
            url: "/master/employeedetails",
            icon: "nav-icon-bullet",
            role: 15
          }
        ]
      },
      {
        name: "CRM",
        url: "/crmmanagement",
        iconComponent: { name: "cil-puzzle" },
        children: [
          {
            name: "Inquiry",
            url: "/crmmanagement/inquirydetails",
            icon: "nav-icon-bullet",
            role: 4
          },
          {
            name: "Offers",
            url: "/crmmanagement/offerdetails",
            icon: "nav-icon-bullet",
            role: 5
          },
          {
            name: "Purchase Order",
            url: "/crmmanagement/purchaseorderdetails",
            icon: "nav-icon-bullet",
            role: 6
          },
          {
            name: "Offer Approval",
            url: "/crmmanagement/offerapproval",
            icon: "nav-icon-bullet",
            role: 9
          }
        ]
      },
      {
        name: "User Management",
        url: "/usermanagement",
        iconComponent: { name: "cil-user" },
        children: [
          {
            name: "Department",
            url: "/usermanagement/user_department",
            icon: "nav-icon-bullet",
            role: 11
          },
          {
            name: "Users",
            url: "/usermanagement/user_details",
            icon: "nav-icon-bullet",
            role: 10
          },
          {
            name: "Modules",
            url: "/usermanagement/user_modules",
            icon: "nav-icon-bullet",
            role: 12
          }
        ]
      },
      {
        name: "Reports",
        url: "/reports",
        iconComponent: { name: "cil-notes" },
        children: [
          {
            name: "Summary Report",
            url: "/reports/summaryreport",
            icon: "nav-icon-bullet",
            role: 13
          }
        ]
      },
      {
        title: true,
        name: "Theme"
      },
      {
        name: "Colors",
        url: "/theme/colors",
        iconComponent: { name: "cil-drop" },
        role: 0
      },
      {
        name: "Typography",
        url: "/theme/typography",
        linkProps: { fragment: "headings" },
        iconComponent: { name: "cil-pencil" }
      },
      {
        name: "Components",
        title: true
      },
      {
        name: "Base",
        url: "/base",
        iconComponent: { name: "cil-puzzle" },
        children: [
          {
            name: "Accordion",
            url: "/base/accordion",
            icon: "nav-icon-bullet",
            role: 0
          },
          {
            name: "Breadcrumbs",
            url: "/base/breadcrumbs",
            icon: "nav-icon-bullet",
            role: 0
          },
          {
            name: "Cards",
            url: "/base/cards",
            icon: "nav-icon-bullet",
            role: 0
          },
          {
            name: "Carousel",
            url: "/base/carousel",
            icon: "nav-icon-bullet"
          },
          {
            name: "Collapse",
            url: "/base/collapse",
            icon: "nav-icon-bullet"
          },
          {
            name: "List Group",
            url: "/base/list-group",
            icon: "nav-icon-bullet"
          },
          {
            name: "Navs & Tabs",
            url: "/base/navs",
            icon: "nav-icon-bullet"
          },
          {
            name: "Pagination",
            url: "/base/pagination",
            icon: "nav-icon-bullet"
          },
          {
            name: "Placeholder",
            url: "/base/placeholder",
            icon: "nav-icon-bullet"
          },
          {
            name: "Popovers",
            url: "/base/popovers",
            icon: "nav-icon-bullet"
          },
          {
            name: "Progress",
            url: "/base/progress",
            icon: "nav-icon-bullet"
          },
          {
            name: "Spinners",
            url: "/base/spinners",
            icon: "nav-icon-bullet"
          },
          {
            name: "Tables",
            url: "/base/tables",
            icon: "nav-icon-bullet"
          },
          {
            name: "Tabs",
            url: "/base/tabs",
            icon: "nav-icon-bullet"
          },
          {
            name: "Tooltips",
            url: "/base/tooltips",
            icon: "nav-icon-bullet"
          }
        ]
      },
      {
        name: "Buttons",
        url: "/buttons",
        iconComponent: { name: "cil-cursor" },
        children: [
          {
            name: "Buttons",
            url: "/buttons/buttons",
            icon: "nav-icon-bullet",
            role: 0
          },
          {
            name: "Button groups",
            url: "/buttons/button-groups",
            icon: "nav-icon-bullet"
          },
          {
            name: "Dropdowns",
            url: "/buttons/dropdowns",
            icon: "nav-icon-bullet"
          }
        ]
      },
      {
        name: "Forms",
        url: "/forms",
        iconComponent: { name: "cil-notes" },
        role: 0,
        children: [
          {
            name: "Form Control",
            url: "/forms/form-control",
            icon: "nav-icon-bullet"
          },
          {
            name: "Select",
            url: "/forms/select",
            icon: "nav-icon-bullet"
          },
          {
            name: "Checks & Radios",
            url: "/forms/checks-radios",
            icon: "nav-icon-bullet"
          },
          {
            name: "Range",
            url: "/forms/range",
            icon: "nav-icon-bullet"
          },
          {
            name: "Input Group",
            url: "/forms/input-group",
            icon: "nav-icon-bullet"
          },
          {
            name: "Floating Labels",
            url: "/forms/floating-labels",
            icon: "nav-icon-bullet"
          },
          {
            name: "Layout",
            url: "/forms/layout",
            icon: "nav-icon-bullet"
          },
          {
            name: "Validation",
            url: "/forms/validation",
            icon: "nav-icon-bullet"
          }
        ]
      },
      {
        name: "Charts",
        iconComponent: { name: "cil-chart-pie" },
        url: "/charts",
        role: 0
      },
      {
        name: "Icons",
        iconComponent: { name: "cil-star" },
        url: "/icons",
        children: [
          {
            name: "CoreUI Free",
            url: "/icons/coreui-icons",
            icon: "nav-icon-bullet",
            badge: {
              color: "success",
              text: "FREE"
            }
          },
          {
            name: "CoreUI Flags",
            url: "/icons/flags",
            icon: "nav-icon-bullet"
          },
          {
            name: "CoreUI Brands",
            url: "/icons/brands",
            icon: "nav-icon-bullet"
          }
        ]
      },
      {
        name: "Notifications",
        url: "/notifications",
        iconComponent: { name: "cil-bell" },
        role: 0,
        children: [
          {
            name: "Alerts",
            url: "/notifications/alerts",
            icon: "nav-icon-bullet"
          },
          {
            name: "Badges",
            url: "/notifications/badges",
            icon: "nav-icon-bullet"
          },
          {
            name: "Modal",
            url: "/notifications/modal",
            icon: "nav-icon-bullet"
          },
          {
            name: "Toast",
            url: "/notifications/toasts",
            icon: "nav-icon-bullet"
          }
        ]
      },
      {
        name: "Widgets",
        url: "/widgets",
        iconComponent: { name: "cil-calculator" },
        badge: {
          color: "info",
          text: "NEW"
        }
      },
      {
        title: true,
        name: "Extras"
      },
      {
        name: "Pages",
        url: "/login",
        iconComponent: { name: "cil-star" },
        children: [
          {
            name: "Login",
            url: "/login",
            icon: "nav-icon-bullet"
          },
          {
            name: "Register",
            url: "/register",
            icon: "nav-icon-bullet"
          },
          {
            name: "Error 404",
            url: "/404",
            icon: "nav-icon-bullet"
          },
          {
            name: "Error 500",
            url: "/500",
            icon: "nav-icon-bullet"
          }
        ]
      },
      {
        title: true,
        name: "Links",
        class: "mt-auto"
      },
      {
        name: "Docs",
        url: "https://coreui.io/angular/docs/5.x/",
        iconComponent: { name: "cil-description" },
        attributes: { target: "_blank" }
      }
    ];
    this.filteredNavItems = [];
    this.userRole = localStorage.getItem("get_role");
    const storedModule = localStorage.getItem("module_data");
    if (storedModule != null) {
      this.userModule = JSON.parse(storedModule);
    }
    this.filteredNavItems = this.filterNavItems(this.navItems);
  }
  filterNavItems(items) {
    return items.filter((item) => {
      if (this.userModule && this.userModule.includes(item.role)) {
        return true;
      }
      if (item.children && item.children.length > 0) {
        item.children = this.filterNavItems(item.children);
        if (item.children.length > 0) {
          return true;
        }
      }
      return false;
    });
  }
  ngOnInit() {
    this.backdropService.isBackdropOpen$.subscribe((isOpen) => {
      this.toggleBlur(isOpen);
      this.toggleBlurheader(isOpen);
    });
  }
  toggleBlur(isOpen) {
    if (isOpen) {
      this.renderer.addClass(this.elementRef.nativeElement.querySelector("#sidebar1"), "sidebar-disabled");
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement.querySelector("#sidebar1"), "sidebar-disabled");
    }
  }
  toggleBlurheader(isOpen) {
    if (isOpen) {
      this.renderer.addClass(this.elementRef.nativeElement.querySelector("#sidebar2"), "sidebar-disabled");
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement.querySelector("#sidebar2"), "sidebar-disabled");
    }
  }
  onScrollbarUpdate($event) {
  }
};
_DefaultLayoutComponent.\u0275fac = function DefaultLayoutComponent_Factory(t) {
  return new (t || _DefaultLayoutComponent)();
};
_DefaultLayoutComponent.\u0275cmp = /* @__PURE__ */ i04.\u0275\u0275defineComponent({ type: _DefaultLayoutComponent, selectors: [["app-dashboard"]], standalone: true, features: [i04.\u0275\u0275StandaloneFeature], decls: 15, vars: 4, consts: [["sidebar1", "cSidebar"], ["scrollbar", "ngScrollbar"], ["overflow", ""], ["colorScheme", "dark", "id", "sidebar1", "visible", "", 1, ""], [1, "border-bottom"], [3, "routerLink"], ["height", "32", "width", "130", "src", "../../../assets/SANDS Logo-10.svg"], ["pointerEventsMethod", "scrollbar", "visibility", "hover", 1, "overflow", 3, "updated"], ["dropdownMode", "close", "compact", "", 3, "navItems"], [1, "wrapper", "d-flex", "flex-column", "min-vh-100"], ["id", "sidebar2", "position", "sticky", "sidebarId", "sidebar1", 1, "mb-4", "d-print-none", "header", "header-sticky", "p-0", "shadow-sm", 3, "cShadowOnScroll"], [1, "body", "flex-grow-1"], ["breakpoint", "fluid", 1, "h-auto", "px-4"]], template: function DefaultLayoutComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i04.\u0275\u0275getCurrentView();
    i04.\u0275\u0275elementStart(0, "c-sidebar", 3, 0)(2, "c-sidebar-header", 4)(3, "c-sidebar-brand", 5);
    i04.\u0275\u0275element(4, "img", 6);
    i04.\u0275\u0275elementEnd()();
    i04.\u0275\u0275elementStart(5, "ng-scrollbar", 7, 1);
    i04.\u0275\u0275listener("updated", function DefaultLayoutComponent_Template_ng_scrollbar_updated_5_listener() {
      i04.\u0275\u0275restoreView(_r1);
      const scrollbar_r2 = i04.\u0275\u0275reference(6);
      return i04.\u0275\u0275resetView(ctx.onScrollbarUpdate(scrollbar_r2.state));
    });
    i04.\u0275\u0275element(7, "c-sidebar-nav", 8, 2);
    i04.\u0275\u0275elementEnd()();
    i04.\u0275\u0275elementStart(9, "div", 9);
    i04.\u0275\u0275element(10, "app-default-header", 10);
    i04.\u0275\u0275elementStart(11, "div", 11)(12, "c-container", 12);
    i04.\u0275\u0275element(13, "router-outlet");
    i04.\u0275\u0275elementEnd()();
    i04.\u0275\u0275element(14, "app-default-footer");
    i04.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    i04.\u0275\u0275advance(3);
    i04.\u0275\u0275property("routerLink", i04.\u0275\u0275pureFunction0(3, _c02));
    i04.\u0275\u0275advance(4);
    i04.\u0275\u0275property("navItems", ctx.filteredNavItems);
    i04.\u0275\u0275advance(3);
    i04.\u0275\u0275property("cShadowOnScroll", "sm");
  }
}, dependencies: [
  SidebarComponent,
  SidebarHeaderComponent,
  SidebarBrandComponent,
  RouterLink2,
  NgScrollbar,
  SidebarNavComponent,
  DefaultHeaderComponent,
  ShadowOnScrollDirective,
  ContainerComponent2,
  RouterOutlet2,
  DefaultFooterComponent
], styles: ["\n\n[_nghost-%COMP%]   .ng-scrollbar[_ngcontent-%COMP%] {\n  --scrollbar-padding: 1px;\n  --scrollbar-size: 5px;\n  --scrollbar-thumb-color: var(--cui-gray-500, #999);\n  --scrollbar-thumb-hover-color: var(--cui-gray-400, #999);\n  --scrollbar-hover-size: calc(var(--scrollbar-size) * 1.5);\n}\n.sidebar-disabled[_ngcontent-%COMP%] {\n  z-index: 0;\n  opacity: 0.7;\n}\n/*# sourceMappingURL=default-layout.component.css.map */"] });
var DefaultLayoutComponent = _DefaultLayoutComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassDebugInfo(DefaultLayoutComponent, { className: "DefaultLayoutComponent", filePath: "src/app/layout/default-layout/default-layout.component.ts", lineNumber: 80 });
})();

// src/app/guards/auth.guard.ts
import { inject as inject3 } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_core.js?v=3df83732";
import { Router as Router3 } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_router.js?v=3df83732";
var authGuard = (route, state) => {
  const router = inject3(Router3);
  const get_username = localStorage.getItem("get_username");
  if (get_username != null && get_username != "" && get_username != void 0) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home"
    },
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("/routes-46GFPD5S.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "theme",
        loadChildren: () => import("/routes-W4SQCENR.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "base",
        loadChildren: () => import("/routes-AZAY7PDV.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "buttons",
        loadChildren: () => import("/routes-JIIU3ZVP.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "forms",
        loadChildren: () => import("/routes-W4ZWMZ6M.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "icons",
        loadChildren: () => import("/routes-SW2TZ7IF.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "notifications",
        loadChildren: () => import("/routes-3AUVWQRZ.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "widgets",
        loadChildren: () => import("/routes-SEFSDWBW.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "charts",
        loadChildren: () => import("/routes-PDUWWOSQ.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "pages",
        loadChildren: () => import("/routes-2KHXTDJE.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "reports",
        loadChildren: () => import("/routes-ZEU5TKHF.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "master",
        loadChildren: () => import("/routes-JVZKWLGW.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "crmmanagement",
        loadChildren: () => import("/routes-AZ5KRASU.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "marketing",
        loadChildren: () => import("/routes-6YU7WZFH.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "usermanagement",
        loadChildren: () => import("/routes-FK4JBTZY.js").then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: "dashboardpo",
        loadChildren: () => import("/routes-AFTUQ2MZ.js").then((m) => m.routes),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "404",
    loadComponent: () => import("/page404.component-KW7L2LBX.js").then((m) => m.Page404Component),
    data: {
      title: "Page 404"
    }
  },
  {
    path: "500",
    loadComponent: () => import("/page500.component-6DB4KIMN.js").then((m) => m.Page500Component),
    data: {
      title: "Page 500"
    }
  },
  {
    path: "login",
    loadComponent: () => import("/login.component-6E22JHOB.js").then((m) => m.LoginComponent),
    data: {
      title: "Login Page"
    }
  },
  {
    path: "register",
    loadComponent: () => import("/register.component-G53XUUQO.js").then((m) => m.RegisterComponent),
    data: {
      title: "Register Page"
    }
  },
  { path: "**", redirectTo: "login" }
];

// src/app/app.config.ts
import { provideHttpClient } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_common_http.js?v=3df83732";
import { provideAnimationsAsync } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/@angular_platform-browser_animations_async.js?v=3df83732";
import { provideToastr } from "/@fs/home/selvasurya/Documents/PO-TOOL(Core-UI)-(06-08-2024)/.angular/cache/17.3.4/vite/deps/ngx-toastr.js?v=3df83732";
var appConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({
      onSameUrlNavigation: "reload"
    }), withInMemoryScrolling({
      scrollPositionRestoration: "top",
      anchorScrolling: "enabled"
    }), withEnabledBlockingInitialNavigation(), withViewTransitions(), withHashLocation()),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService2,
    provideAnimations(),
    // provideHttpClient(withInterceptors([tokenauthenticationInterceptor])),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideToastr()
  ]
};

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIiwic3JjL2FwcC9hcHAuY29tcG9uZW50LnRzIiwic3JjL2FwcC9pY29ucy9pY29uLXN1YnNldC50cyIsInNyYy9hcHAvaWNvbnMvc2lnbmV0LnRzIiwic3JjL2FwcC9pY29ucy9sb2dvLnRzIiwic3JjL2FwcC9hcHAuY29uZmlnLnRzIiwic3JjL2FwcC9sYXlvdXQvZGVmYXVsdC1sYXlvdXQvZGVmYXVsdC1mb290ZXIvZGVmYXVsdC1mb290ZXIuY29tcG9uZW50LnRzIiwic3JjL2FwcC9sYXlvdXQvZGVmYXVsdC1sYXlvdXQvZGVmYXVsdC1mb290ZXIvZGVmYXVsdC1mb290ZXIuY29tcG9uZW50Lmh0bWwiLCJzcmMvYXBwL2xheW91dC9kZWZhdWx0LWxheW91dC9kZWZhdWx0LWhlYWRlci9kZWZhdWx0LWhlYWRlci5jb21wb25lbnQudHMiLCJzcmMvYXBwL2xheW91dC9kZWZhdWx0LWxheW91dC9kZWZhdWx0LWhlYWRlci9kZWZhdWx0LWhlYWRlci5jb21wb25lbnQuaHRtbCIsInNyYy9hcHAvbGF5b3V0L2RlZmF1bHQtbGF5b3V0L2RlZmF1bHQtbGF5b3V0LmNvbXBvbmVudC50cyIsInNyYy9hcHAvbGF5b3V0L2RlZmF1bHQtbGF5b3V0L2RlZmF1bHQtbGF5b3V0LmNvbXBvbmVudC5odG1sIiwic3JjL2FwcC9ndWFyZHMvYXV0aC5ndWFyZC50cyIsInNyYy9hcHAvYXBwLnJvdXRlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cIkBhbmd1bGFyL2xvY2FsaXplXCIgLz5cblxuaW1wb3J0IHsgYm9vdHN0cmFwQXBwbGljYXRpb24gfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAvYXBwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBhcHBDb25maWcgfSBmcm9tICcuL2FwcC9hcHAuY29uZmlnJztcblxuYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwQ29tcG9uZW50LCBhcHBDb25maWcpXG4gIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcblxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5hdmlnYXRpb25FbmQsIFJvdXRlciwgUm91dGVyT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFRpdGxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IEljb25TZXRTZXJ2aWNlIH0gZnJvbSAnQGNvcmV1aS9pY29ucy1hbmd1bGFyJztcbmltcG9ydCB7IGljb25TdWJzZXQgfSBmcm9tICcuL2ljb25zL2ljb24tc3Vic2V0JztcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBOZ3hTcGlubmVyTW9kdWxlLCBOZ3hTcGlubmVyU2VydmljZSB9IGZyb20gXCJuZ3gtc3Bpbm5lclwiO1xuaW1wb3J0IHsgQ3VzdG9tUGlwZSB9IGZyb20gJy4vcGlwZXMvY3VzdG9tLnBpcGUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgdGVtcGxhdGU6ICc8cm91dGVyLW91dGxldCAvPiA8bmd4LXNwaW5uZXIgYmRDb2xvcj1cInJnYmEoNTEsNTEsNTEsMC44KVwiIHNpemU9XCJtZWRpdW1cIiBjb2xvcj1cIiNmZmZcIiB0eXBlPVwiYmFsbC1zY2FsZS1tdWx0aXBsZVwiPjwvbmd4LXNwaW5uZXI+JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW1JvdXRlck91dGxldCxIdHRwQ2xpZW50TW9kdWxlLCBOZ3hTcGlubmVyTW9kdWxlLCBDdXN0b21QaXBlXVxufSlcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICB0aXRsZSA9ICdTQU5EUyAtIFBPIFRPT0wnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSB0aXRsZVNlcnZpY2U6IFRpdGxlLFxuICAgIHByaXZhdGUgaWNvblNldFNlcnZpY2U6IEljb25TZXRTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMudGl0bGVTZXJ2aWNlLnNldFRpdGxlKHRoaXMudGl0bGUpO1xuICAgIC8vIGljb25TZXQgc2luZ2xldG9uXG4gICAgdGhpcy5pY29uU2V0U2VydmljZS5pY29ucyA9IHsgLi4uaWNvblN1YnNldCB9O1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzLnN1YnNjcmliZSgoZXZ0KSA9PiB7XG4gICAgICBpZiAoIShldnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIGNpYkNjQW1leCxcbiAgY2liQ2NBcHBsZVBheSxcbiAgY2liQ2NNYXN0ZXJjYXJkLFxuICBjaWJDY1BheXBhbCxcbiAgY2liQ2NTdHJpcGUsXG4gIGNpYkNjVmlzYSxcbiAgY2liRmFjZWJvb2ssXG4gIGNpYkdvb2dsZSxcbiAgY2liTGlua2VkaW4sXG4gIGNpYlNreXBlLFxuICBjaWJUd2l0dGVyLFxuICBjaWZCcixcbiAgY2lmRXMsXG4gIGNpZkZyLFxuICBjaWZJbixcbiAgY2lmUGwsXG4gIGNpZlVzLFxuICBjaWxBY2NvdW50TG9nb3V0LFxuICBjaWxBbGlnbkNlbnRlcixcbiAgY2lsQWxpZ25MZWZ0LFxuICBjaWxBbGlnblJpZ2h0LFxuICBjaWxBcHBsaWNhdGlvbnNTZXR0aW5ncyxcbiAgY2lsQXJyb3dCb3R0b20sXG4gIGNpbEFycm93UmlnaHQsXG4gIGNpbEFycm93VG9wLFxuICBjaWxCYXNrZXQsXG4gIGNpbEJlbGwsXG4gIGNpbEJvbGQsXG4gIGNpbEJvb2ttYXJrLFxuICBjaWxDYWxjdWxhdG9yLFxuICBjaWxDYWxlbmRhcixcbiAgY2lsQ2hhcnQsXG4gIGNpbENoYXJ0UGllLFxuICBjaWxDaGVjayxcbiAgY2lsQ2hldnJvbkxlZnQsXG4gIGNpbENoZXZyb25SaWdodCxcbiAgY2lsQ2xvdWREb3dubG9hZCxcbiAgY2lsQ29kZSxcbiAgY2lsQ29tbWVudFNxdWFyZSxcbiAgY2lsQ29udHJhc3QsXG4gIGNpbENyZWRpdENhcmQsXG4gIGNpbEN1cnNvcixcbiAgY2lsRGVzY3JpcHRpb24sXG4gIGNpbERvbGxhcixcbiAgY2lsRHJvcCxcbiAgY2lsRW52ZWxvcGVDbG9zZWQsXG4gIGNpbEVudmVsb3BlT3BlbixcbiAgY2lsRmlsZSxcbiAgY2lsR3JpZCxcbiAgY2lsSG9tZSxcbiAgY2lsSW5ib3gsXG4gIGNpbEluZGVudERlY3JlYXNlLFxuICBjaWxJbmRlbnRJbmNyZWFzZSxcbiAgY2lsSXRhbGljLFxuICBjaWxKdXN0aWZ5Q2VudGVyLFxuICBjaWxMYW5ndWFnZSxcbiAgY2lsTGF5ZXJzLFxuICBjaWxMaXN0LFxuICBjaWxMaXN0TnVtYmVyZWQsXG4gIGNpbExvY2F0aW9uUGluLFxuICBjaWxMb2NrTG9ja2VkLFxuICBjaWxNYWduaWZ5aW5nR2xhc3MsXG4gIGNpbE1hcCxcbiAgY2lsTWVkaWFQbGF5LFxuICBjaWxNZWRpYVJlY29yZCxcbiAgY2lsTWVudSxcbiAgY2lsTW9vbixcbiAgY2lsTm90ZXMsXG4gIGNpbE9wdGlvbnMsXG4gIGNpbFBhcGVyY2xpcCxcbiAgY2lsUGFwZXJQbGFuZSxcbiAgY2lsUGVuLFxuICBjaWxQZW5jaWwsXG4gIGNpbFBlb3BsZSxcbiAgY2lsUHJpbnQsXG4gIGNpbFB1enpsZSxcbiAgY2lsUmVwb3J0U2xhc2gsXG4gIGNpbFNhdmUsXG4gIGNpbFNldHRpbmdzLFxuICBjaWxTaGFyZSxcbiAgY2lsU2hhcmVBbGwsXG4gIGNpbFNoYXJlQm94ZWQsXG4gIGNpbFNwZWVjaCxcbiAgY2lsU3BlZWRvbWV0ZXIsXG4gIGNpbFNwcmVhZHNoZWV0LFxuICBjaWxTdGFyLFxuICBjaWxTdW4sXG4gIGNpbFRhZ3MsXG4gIGNpbFRhc2ssXG4gIGNpbFRyYXNoLFxuICBjaWxVbmRlcmxpbmUsXG4gIGNpbFVzZXIsXG4gIGNpbFVzZXJGZW1hbGUsXG4gIGNpbFVzZXJGb2xsb3csXG4gIGNpbFVzZXJVbmZvbGxvd1xufSBmcm9tICdAY29yZXVpL2ljb25zJztcblxuaW1wb3J0IHsgc2lnbmV0IH0gZnJvbSAnLi9zaWduZXQnO1xuaW1wb3J0IHsgbG9nbyB9IGZyb20gJy4vbG9nbyc7XG5cbmV4cG9ydCBjb25zdCBpY29uU3Vic2V0ID0ge1xuICBjaWJDY0FtZXgsXG4gIGNpYkNjQXBwbGVQYXksXG4gIGNpYkNjTWFzdGVyY2FyZCxcbiAgY2liQ2NQYXlwYWwsXG4gIGNpYkNjU3RyaXBlLFxuICBjaWJDY1Zpc2EsXG4gIGNpYkZhY2Vib29rLFxuICBjaWJHb29nbGUsXG4gIGNpYkxpbmtlZGluLFxuICBjaWJTa3lwZSxcbiAgY2liVHdpdHRlcixcbiAgY2lmQnIsXG4gIGNpZkVzLFxuICBjaWZGcixcbiAgY2lmSW4sXG4gIGNpZlBsLFxuICBjaWZVcyxcbiAgY2lsQWNjb3VudExvZ291dCxcbiAgY2lsQWxpZ25DZW50ZXIsXG4gIGNpbEFsaWduTGVmdCxcbiAgY2lsQWxpZ25SaWdodCxcbiAgY2lsQXBwbGljYXRpb25zU2V0dGluZ3MsXG4gIGNpbEFycm93Qm90dG9tLFxuICBjaWxBcnJvd1JpZ2h0LFxuICBjaWxBcnJvd1RvcCxcbiAgY2lsQmFza2V0LFxuICBjaWxCZWxsLFxuICBjaWxCb2xkLFxuICBjaWxCb29rbWFyayxcbiAgY2lsQ2FsY3VsYXRvcixcbiAgY2lsQ2FsZW5kYXIsXG4gIGNpbENoYXJ0LFxuICBjaWxDaGFydFBpZSxcbiAgY2lsQ2hlY2ssXG4gIGNpbENoZXZyb25MZWZ0LFxuICBjaWxDaGV2cm9uUmlnaHQsXG4gIGNpbENsb3VkRG93bmxvYWQsXG4gIGNpbENvZGUsXG4gIGNpbENvbW1lbnRTcXVhcmUsXG4gIGNpbENvbnRyYXN0LFxuICBjaWxDcmVkaXRDYXJkLFxuICBjaWxDdXJzb3IsXG4gIGNpbERlc2NyaXB0aW9uLFxuICBjaWxEb2xsYXIsXG4gIGNpbERyb3AsXG4gIGNpbEVudmVsb3BlQ2xvc2VkLFxuICBjaWxFbnZlbG9wZU9wZW4sXG4gIGNpbEZpbGUsXG4gIGNpbEdyaWQsXG4gIGNpbEhvbWUsXG4gIGNpbEluYm94LFxuICBjaWxJbmRlbnREZWNyZWFzZSxcbiAgY2lsSW5kZW50SW5jcmVhc2UsXG4gIGNpbEl0YWxpYyxcbiAgY2lsSnVzdGlmeUNlbnRlcixcbiAgY2lsTGFuZ3VhZ2UsXG4gIGNpbExheWVycyxcbiAgY2lsTGlzdCxcbiAgY2lsTGlzdE51bWJlcmVkLFxuICBjaWxMb2NhdGlvblBpbixcbiAgY2lsTG9ja0xvY2tlZCxcbiAgY2lsTWFnbmlmeWluZ0dsYXNzLFxuICBjaWxNYXAsXG4gIGNpbE1lZGlhUGxheSxcbiAgY2lsTWVkaWFSZWNvcmQsXG4gIGNpbE1lbnUsXG4gIGNpbE1vb24sXG4gIGNpbE5vdGVzLFxuICBjaWxPcHRpb25zLFxuICBjaWxQYXBlcmNsaXAsXG4gIGNpbFBhcGVyUGxhbmUsXG4gIGNpbFBlbixcbiAgY2lsUGVuY2lsLFxuICBjaWxQZW9wbGUsXG4gIGNpbFByaW50LFxuICBjaWxQdXp6bGUsXG4gIGNpbFJlcG9ydFNsYXNoLFxuICBjaWxTYXZlLFxuICBjaWxTZXR0aW5ncyxcbiAgY2lsU2hhcmUsXG4gIGNpbFNoYXJlQWxsLFxuICBjaWxTaGFyZUJveGVkLFxuICBjaWxTcGVlY2gsXG4gIGNpbFNwZWVkb21ldGVyLFxuICBjaWxTcHJlYWRzaGVldCxcbiAgY2lsU3RhcixcbiAgY2lsU3VuLFxuICBjaWxUYWdzLFxuICBjaWxUYXNrLFxuICBjaWxUcmFzaCxcbiAgY2lsVW5kZXJsaW5lLFxuICBjaWxVc2VyLFxuICBjaWxVc2VyRmVtYWxlLFxuICBjaWxVc2VyRm9sbG93LFxuICBjaWxVc2VyVW5mb2xsb3csXG4gIGxvZ28sXG4gIHNpZ25ldFxufTtcblxuZXhwb3J0IGVudW0gSWNvblN1YnNldCB7XG4gIGNpYkNjQW1leCA9ICdjaWJDY0FtZXgnLFxuICBjaWJDY0FwcGxlUGF5ID0gJ2NpYkNjQXBwbGVQYXknLFxuICBjaWJDY01hc3RlcmNhcmQgPSAnY2liQ2NNYXN0ZXJjYXJkJyxcbiAgY2liQ2NQYXlwYWwgPSAnY2liQ2NQYXlwYWwnLFxuICBjaWJDY1N0cmlwZSA9ICdjaWJDY1N0cmlwZScsXG4gIGNpYkNjVmlzYSA9ICdjaWJDY1Zpc2EnLFxuICBjaWJGYWNlYm9vayA9ICdjaWJGYWNlYm9vaycsXG4gIGNpYkdvb2dsZSA9ICdjaWJHb29nbGUnLFxuICBjaWJMaW5rZWRpbiA9ICdjaWJMaW5rZWRpbicsXG4gIGNpYlNreXBlID0gJ2NpYlNreXBlJyxcbiAgY2liVHdpdHRlciA9ICdjaWJUd2l0dGVyJyxcbiAgY2lmQnIgPSAnY2lmQnInLFxuICBjaWZFcyA9ICdjaWZFcycsXG4gIGNpZkZyID0gJ2NpZkZyJyxcbiAgY2lmSW4gPSAnY2lmSW4nLFxuICBjaWZQbCA9ICdjaWZQbCcsXG4gIGNpZlVzID0gJ2NpZlVzJyxcbiAgY2lsQWNjb3VudExvZ291dCA9ICdjaWxBY2NvdW50TG9nb3V0JyxcbiAgY2lsQWxpZ25DZW50ZXIgPSAnY2lsQWxpZ25DZW50ZXInLFxuICBjaWxBbGlnbkxlZnQgPSAnY2lsQWxpZ25MZWZ0JyxcbiAgY2lsQWxpZ25SaWdodCA9ICdjaWxBbGlnblJpZ2h0JyxcbiAgY2lsQXBwbGljYXRpb25zU2V0dGluZ3MgPSAnY2lsQXBwbGljYXRpb25zU2V0dGluZ3MnLFxuICBjaWxBcnJvd0JvdHRvbSA9ICdjaWxBcnJvd0JvdHRvbScsXG4gIGNpbEFycm93UmlnaHQgPSAnY2lsQXJyb3dSaWdodCcsXG4gIGNpbEFycm93VG9wID0gJ2NpbEFycm93VG9wJyxcbiAgY2lsQmFza2V0ID0gJ2NpbEJhc2tldCcsXG4gIGNpbEJlbGwgPSAnY2lsQmVsbCcsXG4gIGNpbEJvbGQgPSAnY2lsQm9sZCcsXG4gIGNpbEJvb2ttYXJrID0gJ2NpbEJvb2ttYXJrJyxcbiAgY2lsQ2FsY3VsYXRvciA9ICdjaWxDYWxjdWxhdG9yJyxcbiAgY2lsQ2FsZW5kYXIgPSAnY2lsQ2FsZW5kYXInLFxuICBjaWxDaGFydCA9ICdjaWxDaGFydCcsXG4gIGNpbENoYXJ0UGllID0gJ2NpbENoYXJ0UGllJyxcbiAgY2lsQ2hlY2sgPSAnY2lsQ2hlY2snLFxuICBjaWxDaGV2cm9uTGVmdCA9ICdjaWxDaGV2cm9uTGVmdCcsXG4gIGNpbENoZXZyb25SaWdodCA9ICdjaWxDaGV2cm9uUmlnaHQnLFxuICBjaWxDbG91ZERvd25sb2FkID0gJ2NpbENsb3VkRG93bmxvYWQnLFxuICBjaWxDb2RlID0gJ2NpbENvZGUnLFxuICBjaWxDb21tZW50U3F1YXJlID0gJ2NpbENvbW1lbnRTcXVhcmUnLFxuICBjaWxDb250cmFzdCA9ICdjaWxDb250cmFzdMWbJyxcbiAgY2lsQ3JlZGl0Q2FyZCA9ICdjaWxDcmVkaXRDYXJkJyxcbiAgY2lsQ3Vyc29yID0gJ2NpbEN1cnNvcicsXG4gIGNpbERlc2NyaXB0aW9uID0gJ2NpbERlc2NyaXB0aW9uJyxcbiAgY2lsRG9sbGFyID0gJ2NpbERvbGxhcicsXG4gIGNpbERyb3AgPSAnY2lsRHJvcCcsXG4gIGNpbEVudmVsb3BlQ2xvc2VkID0gJ2NpbEVudmVsb3BlQ2xvc2VkJyxcbiAgY2lsRW52ZWxvcGVPcGVuID0gJ2NpbEVudmVsb3BlT3BlbicsXG4gIGNpbEZpbGUgPSAnY2lsRmlsZScsXG4gIGNpbEdyaWQgPSAnY2lsR3JpZCcsXG4gIGNpbEhvbWUgPSAnY2lsSG9tZScsXG4gIGNpbEluYm94ID0gJ2NpbEluYm94JyxcbiAgY2lsSW5kZW50RGVjcmVhc2UgPSAnY2lsSW5kZW50RGVjcmVhc2UnLFxuICBjaWxJbmRlbnRJbmNyZWFzZSA9ICdjaWxJbmRlbnRJbmNyZWFzZScsXG4gIGNpbEl0YWxpYyA9ICdjaWxJdGFsaWMnLFxuICBjaWxKdXN0aWZ5Q2VudGVyID0gJ2NpbEp1c3RpZnlDZW50ZXInLFxuICBjaWxMYW5ndWFnZSA9ICdjaWxMYW5ndWFnZScsXG4gIGNpbExheWVycyA9ICdjaWxMYXllcnMnLFxuICBjaWxMaXN0ID0gJ2NpbExpc3QnLFxuICBjaWxMaXN0TnVtYmVyZWQgPSAnY2lsTGlzdE51bWJlcmVkJyxcbiAgY2lsTG9jYXRpb25QaW4gPSAnY2lsTG9jYXRpb25QaW4nLFxuICBjaWxMb2NrTG9ja2VkID0gJ2NpbExvY2tMb2NrZWQnLFxuICBjaWxNYWduaWZ5aW5nR2xhc3MgPSAnY2lsTWFnbmlmeWluZ0dsYXNzJyxcbiAgY2lsTWFwID0gJ2NpbE1hcCcsXG4gIGNpbE1lZGlhUGxheSA9ICdjaWxNZWRpYVBsYXknLFxuICBjaWxNZWRpYVJlY29yZCA9ICdjaWxNZWRpYVJlY29yZCcsXG4gIGNpbE1lbnUgPSAnY2lsTWVudScsXG4gIGNpbE1vb24gPSAnY2lsTW9vbicsXG4gIGNpbE5vdGVzID0gJ2NpbE5vdGVzJyxcbiAgY2lsT3B0aW9ucyA9ICdjaWxPcHRpb25zJyxcbiAgY2lsUGFwZXJjbGlwID0gJ2NpbFBhcGVyY2xpcCcsXG4gIGNpbFBhcGVyUGxhbmUgPSAnY2lsUGFwZXJQbGFuZScsXG4gIGNpbFBlbiA9ICdjaWxQZW4nLFxuICBjaWxQZW5jaWwgPSAnY2lsUGVuY2lsJyxcbiAgY2lsUGVvcGxlID0gJ2NpbFBlb3BsZScsXG4gIGNpbFByaW50ID0gJ2NpbFByaW50JyxcbiAgY2lsUHV6emxlID0gJ2NpbFB1enpsZScsXG4gIGNpbFJlcG9ydFNsYXNoID0gJ2NpbFJlcG9ydFNsYXNoJyxcbiAgY2lsU2F2ZSA9ICdjaWxTYXZlJyxcbiAgY2lsU2V0dGluZ3MgPSAnY2lsU2V0dGluZ3MnLFxuICBjaWxTaGFyZSA9ICdjaWxTaGFyZScsXG4gIGNpbFNoYXJlQWxsID0gJ2NpbFNoYXJlQWxsJyxcbiAgY2lsU2hhcmVCb3hlZCA9ICdjaWxTaGFyZUJveGVkJyxcbiAgY2lsU3BlZWNoID0gJ2NpbFNwZWVjaCcsXG4gIGNpbFNwZWVkb21ldGVyID0gJ2NpbFNwZWVkb21ldGVyJyxcbiAgY2lsU3ByZWFkc2hlZXQgPSAnY2lsU3ByZWFkc2hlZXQnLFxuICBjaWxTdGFyID0gJ2NpbFN0YXInLFxuICBjaWxTdW4gPSAnY2lsU3VuJyxcbiAgY2lsVGFncyA9ICdjaWxUYWdzJyxcbiAgY2lsVGFzayA9ICdjaWxUYXNrJyxcbiAgY2lsVHJhc2ggPSAnY2lsVHJhc2gnLFxuICBjaWxVbmRlcmxpbmUgPSAnY2lsVW5kZXJsaW5lJyxcbiAgY2lsVXNlciA9ICdjaWxVc2VyJyxcbiAgY2lsVXNlckZlbWFsZSA9ICdjaWxVc2VyRmVtYWxlJyxcbiAgY2lsVXNlckZvbGxvdyA9ICdjaWxVc2VyRm9sbG93JyxcbiAgY2lsVXNlclVuZm9sbG93ID0gJ2NpbFVzZXJVbmZvbGxvdycsXG4gIGxvZ28gPSAnbG9nbycsXG4gIHNpZ25ldCA9ICdzaWduZXQnXG59XG5cbiIsImV4cG9ydCBjb25zdCBzaWduZXQgPSBbXG4gICcxMDIgMTE1JyxcbiAgYDxnIHN0eWxlPVwiZmlsbDogY3VycmVudENvbG9yXCI+XG4gICAgPHBhdGggZD1cIk05NiAyNC4xMjQgNTcgMS42MDhhMTIgMTIgMCAwIDAtMTIgMEw2IDI0LjEyNGExMi4wMzQgMTIuMDM0IDAgMCAwLTYgMTAuMzkzVjc5LjU1YTEyLjAzMyAxMi4wMzMgMCAwIDAgNiAxMC4zOTJsMzkgMjIuNTE3YTEyIDEyIDAgMCAwIDEyIDBsMzktMjIuNTE3YTEyLjAzMyAxMi4wMzMgMCAwIDAgNi0xMC4zOTJWMzQuNTE3YTEyLjAzNCAxMi4wMzQgMCAwIDAtNi0xMC4zOTNaTTk0IDc5LjU1YTQgNCAwIDAgMS0yIDMuNDY0bC0zOSAyMi41MTdhNCA0IDAgMCAxLTQgMEwxMCA4My4wMTRhNCA0IDAgMCAxLTItMy40NjRWMzQuNTE3YTQgNCAwIDAgMSAyLTMuNDY0TDQ5IDguNTM2YTQgNCAwIDAgMSA0IDBsMzkgMjIuNTE3YTQgNCAwIDAgMSAyIDMuNDY0Vjc5LjU1WlwiLz5cbiAgICA8cGF0aCBkPVwiTTc0LjAyMiA3MC4wNzFoLTIuODY2YTQgNCAwIDAgMC0xLjkyNS40OTRMNTEuOTUgODAuMDUgMzIgNjguNTMxVjQ1LjU1NGwxOS45NS0xMS41MTkgMTcuMjkgOS40NTVhNCA0IDAgMCAwIDEuOTE5LjQ5aDIuODYzYTIgMiAwIDAgMCAyLTJ2LTIuNzFhMiAyIDAgMCAwLTEuMDQtMS43NTZMNTUuNzkzIDI3LjAyYTguMDQgOC4wNCAwIDAgMC03Ljg0My4wOUwyOCAzOC42MjZhOC4wMjUgOC4wMjUgMCAwIDAtNCA2LjkyOVY2OC41M2E4IDggMCAwIDAgNCA2LjkyOGwxOS45NSAxMS41MTlhOC4wNDMgOC4wNDMgMCAwIDAgNy44NDMuMDg4bDE5LjE5LTEwLjUzMmEyIDIgMCAwIDAgMS4wMzgtMS43NTN2LTIuNzFhMiAyIDAgMCAwLTItMlpcIi8+XG4gIDwvZz5gLFxuXVxuXG4iLCJleHBvcnQgY29uc3QgbG9nbyA9IFtcbiAgJzY4NSAxMTYnLFxuICBgPGc+XG4gICAgPGcgc3R5bGU9XCJmaWxsOiNjZjJmNGNcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCAtMTApXCI+XG4gICAgICA8cGF0aCBkPVwiTTM5OS41MDI0LDQ1Ljg2MzZoMS4yMTY0YS41NjU5LjU2NTksMCwwLDEsLjY0LjY0djQzLjUyYS41NjU4LjU2NTgsMCwwLDEtLjY0LjY0MDZoLTEuNDA4M2EuNzUxNy43NTE3LDAsMCwxLS43NjgtLjQ0ODJMMzc5LjIxNDQsNTEuNjIzNGMtLjA4Ni0uMDg1LS4xNi0uMTE3Mi0uMjI0Mi0uMDk2Ny0uMDYzNC4wMjI1LS4wOTU3LjA5NjctLjA5NTcuMjI0NmwuMDY0LDM4LjI3MTVhLjU2NjIuNTY2MiwwLDAsMS0uNjQuNjQwNmgtMS4yMTU5YS41NjU2LjU2NTYsMCwwLDEtLjY0LS42NDA2VjQ2LjUwMzNhLjU2NTcuNTY1NywwLDAsMSwuNjQtLjY0aDEuMzQzOGEuNzUyNC43NTI0LDAsMCwxLC43NjgxLjQ0NzNsMTkuMzI4MSwzOC40NjM5Yy4wODQ5LjA4NjkuMTYuMTE4MS4yMjQxLjA5NjZzLjA5NTctLjA5NjYuMDk1Ny0uMjI0NlY0Ni41MDMzQS41NjU3LjU2NTcsMCwwLDEsMzk5LjUwMjQsNDUuODYzNlpcIi8+XG4gICAgICA8cGF0aCBkPVwiTTM2MC40MTgsOTAuMTUwN2wtMi40MzE3LTguODMyYS4yOTY1LjI5NjUsMCwwLDAtLjMyLS4xOTE0SDM0MC44OTg0YS4yOTUxLjI5NTEsMCwwLDAtLjMyLjE5MTRMMzM4LjIxLDkwLjA4NzNhLjY1ODQuNjU4NCwwLDAsMS0uNzAzNy41NzYxSDMzNi4yOWEuNTg2My41ODYzLDAsMCwxLS40OC0uMTkyMy41OC41OCwwLDAsMS0uMDk2MS0uNTExOGwxMi4wMzE3LTQzLjU4MzlhLjY0MzYuNjQzNiwwLDAsMSwuNzA0MS0uNTExOGgxLjZhLjY0NDIuNjQ0MiwwLDAsMSwuNzA0MS41MTE4bDEyLjE2LDQzLjU4MzkuMDY0NC4xOTE0YzAsLjM0MjgtLjIxMzkuNTEyNy0uNjQuNTEyN2gtMS4yMTYzQS42NDI2LjY0MjYsMCwwLDEsMzYwLjQxOCw5MC4xNTA3Wk0zNDEuMzE0NSw3OC45MTkzYS4zMDU3LjMwNTcsMCwwLDAsLjIyMzYuMDk1N2gxNS40ODgzYS4zMDc2LjMwNzYsMCwwLDAsLjIyMzYtLjA5NTdjLjA2NDUtLjA2NDUuMDc0Mi0uMTE3Mi4wMzIyLS4xNkwzNDkuNDEsNDkuODMxNGMtLjA0My0uMDg1LS4wODYtLjEyNzktLjEyOC0uMTI3OXMtLjA4NTkuMDQyOS0uMTI3OS4xMjc5bC03Ljg3MjEsMjguOTI3N0MzNDEuMjM5Myw3OC44MDIxLDM0MS4yNSw3OC44NTQ4LDM0MS4zMTQ1LDc4LjkxOTNaXCIvPlxuICAgICAgPHBhdGggZD1cIk00MTkuODIyMyw4Ny45NDI3YTExLjI4MTIsMTEuMjgxMiwwLDAsMS0zLjMyODItOC40OHYtMjIuNGExMS4yODU3LDExLjI4NTcsMCwwLDEsMy4zMjgyLTguNDgsMTMuNjksMTMuNjksMCwwLDEsMTcuNjMxOC0uMDMyMywxMS4wNDcyLDExLjA0NzIsMCwwLDEsMy4zNiw4LjM4Mzh2MS45MmEuNTY2LjU2NiwwLDAsMS0uNjQuNjQwN0g0MzguOTU4YS41NjU0LjU2NTQsMCwwLDEtLjY0LS42NDA3di0xLjkyYTkuMDE5LDkuMDE5LDAsMCwwLTIuNjU2My02Ljc1MTksMTAuNzcwNSwxMC43NzA1LDAsMCwwLTE0LjAxNjEsMCw5LjA5NDYsOS4wOTQ2LDAsMCwwLTIuNjU1OCw2LjgxNjRWNzkuNTI2N2E5LjAzNjcsOS4wMzY3LDAsMCwwLDIuNjg3NSw2LjgxNjQsOS43MTQxLDkuNzE0MSwwLDAsMCw3LjA0LDIuNTkxOCw5LjU2MTgsOS41NjE4LDAsMCwwLDYuOTc2NS0yLjU1OTUsOC45NjU1LDguOTY1NSwwLDAsMCwyLjYyNDEtNi43MnYtOC4zMmEuMjI2OC4yMjY4LDAsMCwwLS4yNTY0LS4yNTU4aC04LjM4NDNhLjU2NTQuNTY1NCwwLDAsMS0uNjQtLjY0MDdWNjkuNDE1NGEuNTY2Mi41NjYyLDAsMCwxLC42NC0uNjQwNmgxMC40OTYxYS41NjY3LjU2NjcsMCwwLDEsLjY0LjY0MDZ2OS45ODM0YTExLjM0NjUsMTEuMzQ2NSwwLDAsMS0zLjMyNzcsOC41NzYyLDEzLjczNDQsMTMuNzM0NCwwLDAsMS0xNy42NjQtLjAzMjNaXCIvPlxuICAgICAgPHBhdGggZD1cIk00NjEuMzgzOCw4OS41NzU1YTEwLjkwNDMsMTAuOTA0MywwLDAsMS00LjM1MjUtNC41NDM5LDE0LjQ2NDIsMTQuNDY0MiwwLDAsMS0xLjUzNTctNi43ODQyVjQ2LjUwMzNhLjU2NTcuNTY1NywwLDAsMSwuNjQtLjY0aDEuMjE1OWEuNTY1OS41NjU5LDAsMCwxLC42NC42NHYzMmExMC41NDMsMTAuNTQzLDAsMCwwLDIuNzIwNyw3LjU1MTcsMTAuMzYsMTAuMzYsMCwwLDAsMTQuMzM2LDAsMTAuNTUwNiwxMC41NTA2LDAsMCwwLDIuNzItNy41NTE3di0zMmEuNTY1NS41NjU1LDAsMCwxLC42NC0uNjRoMS4yMTYzYS41NjYxLjU2NjEsMCwwLDEsLjY0LjY0Vjc4LjI0NzRhMTMuMDEyMSwxMy4wMTIxLDAsMCwxLTMuMzkyMSw5LjM3NiwxMS44OTgzLDExLjg5ODMsMCwwLDEtOS4wMjM5LDMuNTUxOEExMi44NTM5LDEyLjg1MzksMCwwLDEsNDYxLjM4MzgsODkuNTc1NVpcIi8+XG4gICAgICA8cGF0aCBkPVwiTTQ5NS45MDQ4LDkwLjAyMjhWNDYuNTAzM2EuNTY1Ny41NjU3LDAsMCwxLC42NC0uNjRoMS4yMTU4YS41NjYzLjU2NjMsMCwwLDEsLjY0LjY0djQxLjY2NGEuMjI1OS4yMjU5LDAsMCwwLC4yNTU4LjI1NTloMTkuMmEuNTY2NS41NjY1LDAsMCwxLC42NDA3LjY0di45NmEuNTY2My41NjYzLDAsMCwxLS42NDA3LjY0MDZINDk2LjU0NDlBLjU2NTYuNTY1NiwwLDAsMSw0OTUuOTA0OCw5MC4wMjI4WlwiLz5cbiAgICAgIDxwYXRoIGQ9XCJNNTU0LjY0MzYsOTAuMTUwN2wtMi40MzIyLTguODMyYS4yOTU5LjI5NTksMCwwLDAtLjMyLS4xOTE0SDUzNS4xMjNhLjI5MzkuMjkzOSwwLDAsMC0uMzE5My4xOTE0bC0yLjM2ODIsOC43Njg2YS42NTkuNjU5LDAsMCwxLS43MDQxLjU3NjFoLTEuMjE1OGEuNTg4OC41ODg4LDAsMCwxLS40OC0uMTkyMy41ODI0LjU4MjQsMCwwLDEtLjA5NTctLjUxMThsMTIuMDMyMi00My41ODM5YS42NDMuNjQzLDAsMCwxLC43MDM2LS41MTE4aDEuNmEuNjQ0Mi42NDQyLDAsMCwxLC43MDQxLjUxMThsMTIuMTYsNDMuNTgzOS4wNjM1LjE5MTRjMCwuMzQyOC0uMjEzOC41MTI3LS42NC41MTI3aC0xLjIxNThBLjY0MjMuNjQyMywwLDAsMSw1NTQuNjQzNiw5MC4xNTA3Wk01MzUuNTM5MSw3OC45MTkzYS4zMS4zMSwwLDAsMCwuMjI0Ni4wOTU3aDE1LjQ4NzhhLjMxLjMxLDAsMCwwLC4yMjQxLS4wOTU3Yy4wNjM1LS4wNjQ1LjA3MzctLjExNzIuMDMxNy0uMTZsLTcuODcxNi0yOC45Mjc3Yy0uMDQzNC0uMDg1LS4wODY0LS4xMjc5LS4xMjg0LS4xMjc5cy0uMDg1OS4wNDI5LS4xMjc5LjEyNzlsLTcuODcyMSwyOC45Mjc3QzUzNS40NjQ0LDc4LjgwMjEsNTM1LjQ3NTYsNzguODU0OCw1MzUuNTM5MSw3OC45MTkzWlwiLz5cbiAgICAgIDxwYXRoIGQ9XCJNNTkyLjQ0NzMsOTAuMTUwNyw1ODMuNjgsNjkuNDE1NGEuMjUxNS4yNTE1LDAsMCwwLS4yNTU5LS4xOTI0SDU3My40NGEuMjI2My4yMjYzLDAsMCwwLS4yNTU5LjI1NTlWOTAuMDIyOGEuNTY2LjU2NiwwLDAsMS0uNjQuNjQwNmgtMS4yMTY0YS41NjU0LjU2NTQsMCwwLDEtLjY0LS42NDA2VjQ2LjUwMzNhLjU2NTUuNTY1NSwwLDAsMSwuNjQtLjY0aDEyLjU0NDVhOS45NzgzLDkuOTc4MywwLDAsMSw3Ljc0MzYsMy4yMzE1QTEyLjIwMTksMTIuMjAxOSwwLDAsMSw1OTQuNTYsNTcuNjM5YTEyLjQzNDIsMTIuNDM0MiwwLDAsMS0yLjI0LDcuNTg0LDkuMzYyNiw5LjM2MjYsMCwwLDEtNi4wOCwzLjc0NDJxLS4yNTYzLjEyODgtLjEyOC4zMmw4LjcwNDEsMjAuNjA3NC4wNjQuMjU1OGMwLC4zNDI4LS4xOTE5LjUxMjctLjU3NTcuNTEyN2gtMS4xNTIzQS43MDI3LjcwMjcsMCwwLDEsNTkyLjQ0NzMsOTAuMTUwN1pNNTczLjE4MzYsNDguMzU4OHYxOC40OTZhLjIyNjcuMjI2NywwLDAsMCwuMjU1OS4yNTY5aDEwLjMwMzdhNy42Njg4LDcuNjY4OCwwLDAsMCw2LjAxNjYtMi41OTI4LDkuODc4LDkuODc4LDAsMCwwLDIuMzAzNy02LjgxNTQsMTAuMjg4NSwxMC4yODg1LDAsMCwwLTIuMjcyLTYuOTc2Niw3LjYwMzUsNy42MDM1LDAsMCwwLTYuMDQ4My0yLjYyNEg1NzMuNDRBLjIyNjMuMjI2MywwLDAsMCw1NzMuMTgzNiw0OC4zNTg4WlwiLz5cbiAgICA8L2c+XG4gICAgPGcgc3R5bGU9XCJmaWxsOmN1cnJlbnRDb2xvcjtcIj5cbiAgICAgIDxnPlxuICAgICAgICA8cGF0aCBkPVwibTk2LjgzNSAyNS4wNTgtMzktMjIuNTE3YTEyIDEyIDAgMCAwLTEyIDBsLTM5IDIyLjUxN2ExMi4wMzQgMTIuMDM0IDAgMCAwLTYgMTAuMzkydjQ1LjAzM2ExMi4wMzMgMTIuMDMzIDAgMCAwIDYgMTAuMzkzbDM5IDIyLjUxNmExMiAxMiAwIDAgMCAxMiAwbDM5LTIyLjUxNmExMi4wMzMgMTIuMDMzIDAgMCAwIDYtMTAuMzkzVjM1LjQ1YTEyLjAzMyAxMi4wMzMgMCAwIDAtNi0xMC4zOTJabS0yIDU1LjQyNWE0IDQgMCAwIDEtMiAzLjQ2NGwtMzkgMjIuNTE3YTQgNCAwIDAgMS00IDBsLTM5LTIyLjUxN2E0IDQgMCAwIDEtMi0zLjQ2NFYzNS40NWE0IDQgMCAwIDEgMi0zLjQ2NGwzOS0yMi41MTdhNCA0IDAgMCAxIDQgMGwzOSAyMi41MTdhNCA0IDAgMCAxIDIgMy40NjR2NDUuMDMzWlwiLz5cbiAgICAgICAgPHBhdGggZD1cIk03NC44NTcgNzEuMDA1SDcxLjk5YTQgNCAwIDAgMC0xLjkyNS40OTNsLTE3LjI4IDkuNDg1LTE5Ljk1MS0xMS41MThWNDYuNDg3bDE5Ljk1LTExLjUxOCAxNy4yOSA5LjQ1NWE0IDQgMCAwIDAgMS45MTguNDloMi44NjRhMiAyIDAgMCAwIDItMnYtMi43MTJhMiAyIDAgMCAwLTEuMDQtMS43NTRMNTYuNjI4IDI3Ljk1MmE4LjA0IDguMDQgMCAwIDAtNy44NDMuMDlMMjguODM1IDM5LjU2YTguMDI1IDguMDI1IDAgMCAwLTQgNi45Mjl2MjIuOTc2YTggOCAwIDAgMCA0IDYuOTI4bDE5Ljk1IDExLjUxOWE4LjA0MyA4LjA0MyAwIDAgMCA3Ljg0My4wODdsMTkuMTktMTAuNTNhMiAyIDAgMCAwIDEuMDM4LTEuNzU0di0yLjcxYTIgMiAwIDAgMC0yLTJaXCIvPlxuICAgICAgPC9nPlxuICAgICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDExOCAzNClcIj5cbiAgICAgICAgIDxwYXRoIGQ9XCJNNTEuNTguMzYyYy04LjI4LjAwOS0xNC45OSA2LjcxOS0xNSAxNXYxNy4yNzdjMCA4LjI4NCA2LjcxNiAxNSAxNSAxNSA4LjI4NCAwIDE1LTYuNzE2IDE1LTE1VjE1LjM2Yy0uMDEtOC4yOC02LjcyLTE0Ljk5LTE1LTE1Wm03IDMyLjI3N2E3IDcgMCAwIDEtMTQgMFYxNS4zNmE3IDcgMCAwIDEgMTQgMFYzMi42NFpNMTQuOTE0IDguNDIxYTcuMDEgNy4wMSAwIDAgMSA3Ljg2OCA2LjA3NS45OS45OSAwIDAgMCAuOTg0Ljg2NWg2LjAzYTEuMDEgMS4wMSAwIDAgMCAuOTk5LTEuMDk3QzMwLjE4OSA2LjE0IDIzLjIxNi0uMDIgMTUuMDc5LjM4MSA2Ljk5Ni45MzIuNzQ4IDcuNjk2LjgzNSAxNS43OTZ2MTYuNDA3Qy43NDggNDAuMzA1IDYuOTk2IDQ3LjA2OCAxNS4wNzkgNDcuNjJjOC4xMzguNDAxIDE1LjExMS01Ljc2IDE1LjcxNi0xMy44ODRhMS4wMSAxLjAxIDAgMCAwLS45OTgtMS4wOTdoLTYuMDNhLjk5Ljk5IDAgMCAwLS45ODUuODY1IDcuMDEgNy4wMSAwIDAgMS03Ljg2NyA2LjA3NSA3LjE2NCA3LjE2NCAwIDAgMS02LjA4LTcuMTg0di0xNi43OWE3LjE2NCA3LjE2NCAwIDAgMSA2LjA3OS03LjE4NFpNOTcuNzU3IDI3LjkyOGExMi4xNTkgMTIuMTU5IDAgMCAwIDcuMTg0LTExLjA3N3YtMy43MDJBMTIuMTUgMTIuMTUgMCAwIDAgOTIuNzkzIDFINzUuODM1YTEgMSAwIDAgMC0xIDF2NDRhMSAxIDAgMCAwIDEgMWg2YTEgMSAwIDAgMCAxLTFWMjloNi42MjJsNy45MTUgMTcuNDE0YTEgMSAwIDAgMCAuOTEuNTg2aDYuNTkxYTEgMSAwIDAgMCAuOTEtMS40MTRsLTguMDI2LTE3LjY1OFptLS44MTYtMTEuMDc3QTQuMTU0IDQuMTU0IDAgMCAxIDkyLjc5NCAyMUg4Mi45NFY5aDkuODUyYTQuMTU0IDQuMTU0IDAgMCAxIDQuMTQ4IDQuMTV2My43Wk0xMzkuODM1IDFoLTI2YTEgMSAwIDAgMC0xIDF2NDRhMSAxIDAgMCAwIDEgMWgyNmExIDEgMCAwIDAgMS0xdi02YTEgMSAwIDAgMC0xLTFoLTE5VjI3aDEzYTEgMSAwIDAgMCAxLTF2LTZhMSAxIDAgMCAwLTEtMWgtMTNWOWgxOWExIDEgMCAwIDAgMS0xVjJhMSAxIDAgMCAwLTEtMVpNMTc3LjgzNSAxaC02YTEgMSAwIDAgMC0xIDF2MjIuNjQ4YTcuMDA3IDcuMDA3IDAgMSAxLTE0IDBWMmExIDEgMCAwIDAtMS0xaC02YTEgMSAwIDAgMC0xIDF2MjIuNjQ4YTE1LjAwMyAxNS4wMDMgMCAxIDAgMzAgMFYyYTEgMSAwIDAgMC0xLTFaXCIvPlxuICAgICAgICAgPHJlY3Qgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMzhcIiB4PVwiMTg2LjgzNVwiIHk9XCIxXCIgcng9XCIxXCIvPlxuICAgICAgPC9nPlxuICAgIDwvZz5cbiAgPC9nPmBcbl07XG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbkNvbmZpZywgaW1wb3J0UHJvdmlkZXJzRnJvbSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgcHJvdmlkZUFuaW1hdGlvbnMgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgcHJvdmlkZVJvdXRlcixcbiAgd2l0aEVuYWJsZWRCbG9ja2luZ0luaXRpYWxOYXZpZ2F0aW9uLFxuICB3aXRoSGFzaExvY2F0aW9uLFxuICB3aXRoSW5NZW1vcnlTY3JvbGxpbmcsXG4gIHdpdGhSb3V0ZXJDb25maWcsXG4gIHdpdGhWaWV3VHJhbnNpdGlvbnNcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgRHJvcGRvd25Nb2R1bGUsIFNpZGViYXJNb2R1bGUgfSBmcm9tICdAY29yZXVpL2FuZ3VsYXInO1xuaW1wb3J0IHsgSWNvblNldFNlcnZpY2UgfSBmcm9tICdAY29yZXVpL2ljb25zLWFuZ3VsYXInO1xuaW1wb3J0IHsgcm91dGVzIH0gZnJvbSAnLi9hcHAucm91dGVzJztcbmltcG9ydCB7IEhUVFBfSU5URVJDRVBUT1JTLCBwcm92aWRlSHR0cENsaWVudCwgd2l0aEludGVyY2VwdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IHByb3ZpZGVBbmltYXRpb25zQXN5bmMgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMvYXN5bmMnO1xuaW1wb3J0IHsgcHJvdmlkZVRvYXN0ciB9IGZyb20gJ25neC10b2FzdHInO1xuaW1wb3J0IHsgdG9rZW5hdXRoZW50aWNhdGlvbkludGVyY2VwdG9yIH0gZnJvbSAnc3JjL2FwcC9zZXJ2aWNlL3Rva2VuYXV0aGVudGljYXRpb24uaW50ZXJjZXB0b3InXG5cbmV4cG9ydCBjb25zdCBhcHBDb25maWc6IEFwcGxpY2F0aW9uQ29uZmlnID0ge1xuICBwcm92aWRlcnM6IFtcbiAgICBwcm92aWRlUm91dGVyKHJvdXRlcyxcbiAgICAgIHdpdGhSb3V0ZXJDb25maWcoe1xuICAgICAgICBvblNhbWVVcmxOYXZpZ2F0aW9uOiAncmVsb2FkJ1xuICAgICAgfSksXG4gICAgICB3aXRoSW5NZW1vcnlTY3JvbGxpbmcoe1xuICAgICAgICBzY3JvbGxQb3NpdGlvblJlc3RvcmF0aW9uOiAndG9wJyxcbiAgICAgICAgYW5jaG9yU2Nyb2xsaW5nOiAnZW5hYmxlZCdcbiAgICAgIH0pLFxuICAgICAgd2l0aEVuYWJsZWRCbG9ja2luZ0luaXRpYWxOYXZpZ2F0aW9uKCksXG4gICAgICB3aXRoVmlld1RyYW5zaXRpb25zKCksXG4gICAgICB3aXRoSGFzaExvY2F0aW9uKClcbiAgICApLFxuICAgIGltcG9ydFByb3ZpZGVyc0Zyb20oU2lkZWJhck1vZHVsZSwgRHJvcGRvd25Nb2R1bGUpLFxuICAgIEljb25TZXRTZXJ2aWNlLFxuICAgIHByb3ZpZGVBbmltYXRpb25zKCksXG4gICAgLy8gcHJvdmlkZUh0dHBDbGllbnQod2l0aEludGVyY2VwdG9ycyhbdG9rZW5hdXRoZW50aWNhdGlvbkludGVyY2VwdG9yXSkpLFxuICAgIHByb3ZpZGVIdHRwQ2xpZW50KCksXG4gICAgcHJvdmlkZUFuaW1hdGlvbnNBc3luYygpLFxuICAgIHByb3ZpZGVUb2FzdHIoKVxuICBdXG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb290ZXJDb21wb25lbnQgfSBmcm9tICdAY29yZXVpL2FuZ3VsYXInO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FwcC1kZWZhdWx0LWZvb3RlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2RlZmF1bHQtZm9vdGVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9kZWZhdWx0LWZvb3Rlci5jb21wb25lbnQuc2NzcyddLFxuICAgIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRGb290ZXJDb21wb25lbnQgZXh0ZW5kcyBGb290ZXJDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG4iLCI8IS0tPGMtZm9vdGVyPi0tPlxuPGRpdj5cbiAgPCEtLSA8YSBocmVmPVwiaHR0cHM6Ly9jb3JldWkuaW8vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Q29yZVVJPC9hPlxuICAgIDxzcGFuPiAmY29weTsgMjAyNCBjcmVhdGl2ZUxhYnM8L3NwYW4+IC0tPlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwibXMtYXV0b1wiPlxuICAmY29weTtcbiAgMjAyNCwgUG93ZXJlZCBieVxuICA8YSBocmVmPVwiaHR0cHM6Ly93d3cuc2FuZHNpbmRpYS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICA8c3Bhbj5TaWduYWxzIGFuZCBTeXN0ZW1zIEluZGlhIFB2dCBMdGQ8L3NwYW4+PC9hPlxuPC9kaXY+XG48IS0tPC9jLWZvb3Rlcj4tLT4iLCJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBjb21wdXRlZCwgRGVzdHJveVJlZiwgaW5qZWN0LCBJbnB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBdmF0YXJDb21wb25lbnQsXG4gIEJhZGdlQ29tcG9uZW50LFxuICBCcmVhZGNydW1iUm91dGVyQ29tcG9uZW50LFxuICBDb2xvck1vZGVTZXJ2aWNlLFxuICBDb250YWluZXJDb21wb25lbnQsXG4gIERyb3Bkb3duQ29tcG9uZW50LFxuICBEcm9wZG93bkRpdmlkZXJEaXJlY3RpdmUsXG4gIERyb3Bkb3duSGVhZGVyRGlyZWN0aXZlLFxuICBEcm9wZG93bkl0ZW1EaXJlY3RpdmUsXG4gIERyb3Bkb3duTWVudURpcmVjdGl2ZSxcbiAgRHJvcGRvd25Ub2dnbGVEaXJlY3RpdmUsXG4gIEhlYWRlckNvbXBvbmVudCxcbiAgSGVhZGVyTmF2Q29tcG9uZW50LFxuICBIZWFkZXJUb2dnbGVyRGlyZWN0aXZlLFxuICBOYXZJdGVtQ29tcG9uZW50LFxuICBOYXZMaW5rRGlyZWN0aXZlLFxuICBQcm9ncmVzc0JhckRpcmVjdGl2ZSxcbiAgUHJvZ3Jlc3NDb21wb25lbnQsXG4gIFNpZGViYXJUb2dnbGVEaXJlY3RpdmUsXG4gIFRleHRDb2xvckRpcmVjdGl2ZSxcbiAgVGhlbWVEaXJlY3RpdmUsXG4gIEJhZGdlTW9kdWxlXG59IGZyb20gJ0Bjb3JldWkvYW5ndWxhcic7XG5pbXBvcnQgeyBOZ1N0eWxlLCBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIsIFJvdXRlckxpbmssIFJvdXRlckxpbmtBY3RpdmUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSWNvbkRpcmVjdGl2ZSB9IGZyb20gJ0Bjb3JldWkvaWNvbnMtYW5ndWxhcic7XG5pbXBvcnQgeyB0YWtlVW50aWxEZXN0cm95ZWQgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5pbXBvcnQgeyBkZWxheSwgZmlsdGVyLCBtYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEhlYWRlclNlcnZpY2UgfSBmcm9tICdzcmMvYXBwL3NlcnZpY2UvaGVhZGVyLnNlcnZpY2UnXG5pbXBvcnQgeyBNYXRJY29uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XG5pbXBvcnQgeyBNYXRNZW51TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XG5pbXBvcnQgeyBNYXRMaXN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGlzdCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQgeyBNYXRUb29sdGlwTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbHRpcCc7XG5pbXBvcnQgeyBNYXRNZW51VHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuaW1wb3J0IHsgVG9hc3RyTW9kdWxlLCBUb2FzdHJTZXJ2aWNlIH0gZnJvbSAnbmd4LXRvYXN0cic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1kZWZhdWx0LWhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kZWZhdWx0LWhlYWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RlZmF1bHQtaGVhZGVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENvbnRhaW5lckNvbXBvbmVudCwgSGVhZGVyVG9nZ2xlckRpcmVjdGl2ZSwgU2lkZWJhclRvZ2dsZURpcmVjdGl2ZSwgSWNvbkRpcmVjdGl2ZSwgSGVhZGVyTmF2Q29tcG9uZW50LCBOYXZJdGVtQ29tcG9uZW50LCBOYXZMaW5rRGlyZWN0aXZlLCBSb3V0ZXJMaW5rLCBSb3V0ZXJMaW5rQWN0aXZlLCBOZ1RlbXBsYXRlT3V0bGV0LCBCcmVhZGNydW1iUm91dGVyQ29tcG9uZW50LCBUaGVtZURpcmVjdGl2ZSwgRHJvcGRvd25Db21wb25lbnQsIERyb3Bkb3duVG9nZ2xlRGlyZWN0aXZlLCBUZXh0Q29sb3JEaXJlY3RpdmUsIEF2YXRhckNvbXBvbmVudCwgRHJvcGRvd25NZW51RGlyZWN0aXZlLCBEcm9wZG93bkhlYWRlckRpcmVjdGl2ZSwgRHJvcGRvd25JdGVtRGlyZWN0aXZlLCBCYWRnZUNvbXBvbmVudCwgRHJvcGRvd25EaXZpZGVyRGlyZWN0aXZlLCBQcm9ncmVzc0JhckRpcmVjdGl2ZSwgUHJvZ3Jlc3NDb21wb25lbnQsIE5nU3R5bGUsIEJhZGdlTW9kdWxlLCBNYXRJY29uTW9kdWxlLCBNYXRNZW51TW9kdWxlLCBNYXRMaXN0TW9kdWxlLCBNYXRUb29sdGlwTW9kdWxlLCBNYXRNZW51VHJpZ2dlciwgVG9hc3RyTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SGVhZGVyQ29tcG9uZW50IGV4dGVuZHMgSGVhZGVyQ29tcG9uZW50IHtcblxuICByZWFkb25seSAjYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlID0gaW5qZWN0KEFjdGl2YXRlZFJvdXRlKTtcbiAgcmVhZG9ubHkgI2NvbG9yTW9kZVNlcnZpY2UgPSBpbmplY3QoQ29sb3JNb2RlU2VydmljZSk7XG4gIHJlYWRvbmx5IGNvbG9yTW9kZSA9IHRoaXMuI2NvbG9yTW9kZVNlcnZpY2UuY29sb3JNb2RlO1xuICByZWFkb25seSAjZGVzdHJveVJlZjogRGVzdHJveVJlZiA9IGluamVjdChEZXN0cm95UmVmKTtcbiAgcHJpdmF0ZSBoZWFkZXJTZXJ2aWNlID0gaW5qZWN0KEhlYWRlclNlcnZpY2UpXG4gIHByaXZhdGUgdG9hc3RyID0gaW5qZWN0KFRvYXN0clNlcnZpY2UpXG4gIEBWaWV3Q2hpbGQoTWF0TWVudVRyaWdnZXIpIG1lbnVUcmlnZ2VyITogTWF0TWVudVRyaWdnZXI7XG4gIHZlcmlmaWVkX2VtYWlsX25hbWU6IGFueSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdnZXRfdXNlcm5hbWUnKVxuICB2ZXJpZmllZF91c2VyX25hbWU6IGFueSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdnZXRfdXNlcm5hbWVfbmFtZScpXG4gIG5vdGlmaWNhdGlvbkNvdW50OiBudW1iZXIgPSAwO1xuICBub3RpZmljYXRpb25zOiBhbnlcbiAgdmVyaWZpZWRfdXNlcl9pZDogYW55XG5cbiAgcmVhZG9ubHkgY29sb3JNb2RlcyA9IFtcbiAgICB7IG5hbWU6ICdsaWdodCcsIHRleHQ6ICdMaWdodCcsIGljb246ICdjaWxTdW4nIH0sXG4gICAgeyBuYW1lOiAnZGFyaycsIHRleHQ6ICdEYXJrJywgaWNvbjogJ2NpbE1vb24nIH0sXG4gICAgeyBuYW1lOiAnYXV0bycsIHRleHQ6ICdBdXRvJywgaWNvbjogJ2NpbENvbnRyYXN0JyB9XG4gIF07XG5cbiAgcmVhZG9ubHkgaWNvbnMgPSBjb21wdXRlZCgoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudE1vZGUgPSB0aGlzLmNvbG9yTW9kZSgpO1xuICAgIHJldHVybiB0aGlzLmNvbG9yTW9kZXMuZmluZChtb2RlID0+IG1vZGUubmFtZSA9PT0gY3VycmVudE1vZGUpPy5pY29uID8/ICdjaWxTdW4nO1xuICB9KTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuI2NvbG9yTW9kZVNlcnZpY2UubG9jYWxTdG9yYWdlSXRlbU5hbWUuc2V0KCdjb3JldWktZnJlZS1hbmd1bGFyLWFkbWluLXRlbXBsYXRlLXRoZW1lLWRlZmF1bHQnKTtcbiAgICB0aGlzLiNjb2xvck1vZGVTZXJ2aWNlLmV2ZW50TmFtZS5zZXQoJ0NvbG9yU2NoZW1lQ2hhbmdlJyk7XG5cbiAgICB0aGlzLiNhY3RpdmF0ZWRSb3V0ZS5xdWVyeVBhcmFtc1xuICAgICAgLnBpcGUoXG4gICAgICAgIGRlbGF5KDEpLFxuICAgICAgICBtYXAocGFyYW1zID0+IDxzdHJpbmc+cGFyYW1zWyd0aGVtZSddPy5tYXRjaCgvXltBLVphLXowLTlcXHNdKy8pPy5bMF0pLFxuICAgICAgICBmaWx0ZXIodGhlbWUgPT4gWydkYXJrJywgJ2xpZ2h0JywgJ2F1dG8nXS5pbmNsdWRlcyh0aGVtZSkpLFxuICAgICAgICB0YXAodGhlbWUgPT4ge1xuICAgICAgICAgIHRoaXMuY29sb3JNb2RlLnNldCh0aGVtZSk7XG4gICAgICAgIH0pLFxuICAgICAgICB0YWtlVW50aWxEZXN0cm95ZWQodGhpcy4jZGVzdHJveVJlZilcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNpZGViYXJJZDogc3RyaW5nID0gJ3NpZGViYXIxJztcblxuICBwdWJsaWMgbmV3TWVzc2FnZXMgPSBbXG4gICAge1xuICAgICAgaWQ6IDAsXG4gICAgICBmcm9tOiAnSmVzc2ljYSBXaWxsaWFtcycsXG4gICAgICBhdmF0YXI6ICc3LmpwZycsXG4gICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIHRpdGxlOiAnVXJnZW50OiBTeXN0ZW0gTWFpbnRlbmFuY2UgVG9uaWdodCcsXG4gICAgICB0aW1lOiAnSnVzdCBub3cnLFxuICAgICAgbGluazogJ2FwcHMvZW1haWwvaW5ib3gvbWVzc2FnZScsXG4gICAgICBtZXNzYWdlOiAnQXR0ZW50aW9uIHRlYW0sIHdlXFwnbGwgYmUgY29uZHVjdGluZyBjcml0aWNhbCBzeXN0ZW0gbWFpbnRlbmFuY2UgdG9uaWdodCBmcm9tIDEwIFBNIHRvIDIgQU0uIFBsYW4gYWNjb3JkaW5nbHkuLi4nXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogMSxcbiAgICAgIGZyb206ICdSaWNoYXJkIEpvaG5zb24nLFxuICAgICAgYXZhdGFyOiAnNi5qcGcnLFxuICAgICAgc3RhdHVzOiAnd2FybmluZycsXG4gICAgICB0aXRsZTogJ1Byb2plY3QgVXBkYXRlOiBNaWxlc3RvbmUgQWNoaWV2ZWQnLFxuICAgICAgdGltZTogJzUgbWludXRlcyBhZ28nLFxuICAgICAgbGluazogJ2FwcHMvZW1haWwvaW5ib3gvbWVzc2FnZScsXG4gICAgICBtZXNzYWdlOiAnS3Vkb3Mgb24gaGl0dGluZyBzYWxlcyB0YXJnZXRzIGxhc3QgcXVhcnRlciEgTGV0XFwncyBrZWVwIHRoZSBtb21lbnR1bS4gTmV3IGdvYWxzLCBuZXcgdmljdG9yaWVzIGFoZWFkLi4uJ1xuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDIsXG4gICAgICBmcm9tOiAnQW5nZWxhIFJvZHJpZ3VleicsXG4gICAgICBhdmF0YXI6ICc1LmpwZycsXG4gICAgICBzdGF0dXM6ICdkYW5nZXInLFxuICAgICAgdGl0bGU6ICdTb2NpYWwgTWVkaWEgQ2FtcGFpZ24gTGF1bmNoJyxcbiAgICAgIHRpbWU6ICcxOjUyIFBNJyxcbiAgICAgIGxpbms6ICdhcHBzL2VtYWlsL2luYm94L21lc3NhZ2UnLFxuICAgICAgbWVzc2FnZTogJ0V4Y2l0aW5nIG5ld3MhIE91ciBuZXcgc29jaWFsIG1lZGlhIGNhbXBhaWduIGdvZXMgbGl2ZSB0b21vcnJvdy4gQnJhY2UgeW91cnNlbHZlcyBmb3IgZW5nYWdlbWVudC4uLidcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAzLFxuICAgICAgZnJvbTogJ0phbmUgTGV3aXMnLFxuICAgICAgYXZhdGFyOiAnNC5qcGcnLFxuICAgICAgc3RhdHVzOiAnaW5mbycsXG4gICAgICB0aXRsZTogJ0ludmVudG9yeSBDaGVja3BvaW50JyxcbiAgICAgIHRpbWU6ICc0OjAzIEFNJyxcbiAgICAgIGxpbms6ICdhcHBzL2VtYWlsL2luYm94L21lc3NhZ2UnLFxuICAgICAgbWVzc2FnZTogJ1RlYW0sIGl0XFwncyB0aW1lIGZvciBvdXIgbW9udGhseSBpbnZlbnRvcnkgY2hlY2suIEFjY3VyYXRlIGNvdW50cyBlbnN1cmUgc21vb3RoIG9wZXJhdGlvbnMuIExldFxcJ3MgbmFpbCBpdC4uLidcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAzLFxuICAgICAgZnJvbTogJ1J5YW4gTWlsbGVyJyxcbiAgICAgIGF2YXRhcjogJzQuanBnJyxcbiAgICAgIHN0YXR1czogJ2luZm8nLFxuICAgICAgdGl0bGU6ICdDdXN0b21lciBGZWVkYmFjayBSZXN1bHRzJyxcbiAgICAgIHRpbWU6ICczIGRheXMgYWdvJyxcbiAgICAgIGxpbms6ICdhcHBzL2VtYWlsL2luYm94L21lc3NhZ2UnLFxuICAgICAgbWVzc2FnZTogJ091ciBsYXRlc3QgY3VzdG9tZXIgZmVlZGJhY2sgaXMgaW4uIExldFxcJ3MgYW5hbHl6ZSBhbmQgZGlzY3VzcyBpbXByb3ZlbWVudHMgZm9yIGFuIGV2ZW4gYmV0dGVyIHNlcnZpY2UuLi4nXG4gICAgfVxuICBdO1xuXG4gIHB1YmxpYyBuZXdOb3RpZmljYXRpb25zID0gW1xuICAgIHsgaWQ6IDAsIHRpdGxlOiAnTmV3IHVzZXIgcmVnaXN0ZXJlZCcsIGljb246ICdjaWxVc2VyRm9sbG93JywgY29sb3I6ICdzdWNjZXNzJyB9LFxuICAgIHsgaWQ6IDEsIHRpdGxlOiAnVXNlciBkZWxldGVkJywgaWNvbjogJ2NpbFVzZXJVbmZvbGxvdycsIGNvbG9yOiAnZGFuZ2VyJyB9LFxuICAgIHsgaWQ6IDIsIHRpdGxlOiAnU2FsZXMgcmVwb3J0IGlzIHJlYWR5JywgaWNvbjogJ2NpbENoYXJ0UGllJywgY29sb3I6ICdpbmZvJyB9LFxuICAgIHsgaWQ6IDMsIHRpdGxlOiAnTmV3IGNsaWVudCcsIGljb246ICdjaWxCYXNrZXQnLCBjb2xvcjogJ3ByaW1hcnknIH0sXG4gICAgeyBpZDogNCwgdGl0bGU6ICdTZXJ2ZXIgb3ZlcmxvYWRlZCcsIGljb246ICdjaWxTcGVlZG9tZXRlcicsIGNvbG9yOiAnd2FybmluZycgfVxuICBdO1xuXG4gIHB1YmxpYyBuZXdTdGF0dXMgPSBbXG4gICAgeyBpZDogMCwgdGl0bGU6ICdDUFUgVXNhZ2UnLCB2YWx1ZTogMjUsIGNvbG9yOiAnaW5mbycsIGRldGFpbHM6ICczNDggUHJvY2Vzc2VzLiAxLzQgQ29yZXMuJyB9LFxuICAgIHsgaWQ6IDEsIHRpdGxlOiAnTWVtb3J5IFVzYWdlJywgdmFsdWU6IDcwLCBjb2xvcjogJ3dhcm5pbmcnLCBkZXRhaWxzOiAnMTE0NDRHQi8xNjM4NE1CJyB9LFxuICAgIHsgaWQ6IDIsIHRpdGxlOiAnU1NEIDEgVXNhZ2UnLCB2YWx1ZTogOTAsIGNvbG9yOiAnZGFuZ2VyJywgZGV0YWlsczogJzI0M0dCLzI1NkdCJyB9XG4gIF07XG5cbiAgcHVibGljIG5ld1Rhc2tzID0gW1xuICAgIHsgaWQ6IDAsIHRpdGxlOiAnVXBncmFkZSBOUE0nLCB2YWx1ZTogMCwgY29sb3I6ICdpbmZvJyB9LFxuICAgIHsgaWQ6IDEsIHRpdGxlOiAnUmVhY3RKUyBWZXJzaW9uJywgdmFsdWU6IDI1LCBjb2xvcjogJ2RhbmdlcicgfSxcbiAgICB7IGlkOiAyLCB0aXRsZTogJ1Z1ZUpTIFZlcnNpb24nLCB2YWx1ZTogNTAsIGNvbG9yOiAnd2FybmluZycgfSxcbiAgICB7IGlkOiAzLCB0aXRsZTogJ0FkZCBuZXcgbGF5b3V0cycsIHZhbHVlOiA3NSwgY29sb3I6ICdpbmZvJyB9LFxuICAgIHsgaWQ6IDQsIHRpdGxlOiAnQW5ndWxhciBWZXJzaW9uJywgdmFsdWU6IDEwMCwgY29sb3I6ICdzdWNjZXNzJyB9XG4gIF07XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy52ZXJpZmllZF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2dldF91c2VybmFtZV9pZCcpXG4gICAgdGhpcy5wb3N0VXNlck5hbWVHZXROb3RpZmlhY3Rpb24oKVxuICAgIHRoaXMuc2V0SW50ZXJ2YWwoKVxuICAgIC8vIHRoaXMubm90aWZpY2F0aW9ucyA9IFtcbiAgICAvLyAgIHsgbWVzc2FnZTogJ05ldyBjb21tZW50IG9uIHlvdXIgcG9zdCcgfSxcbiAgICAvLyAgIHsgbWVzc2FnZTogJ1lvdSBoYXZlIGEgbmV3IGZvbGxvd2VyJyB9LFxuICAgIC8vICAgeyBtZXNzYWdlOiAnWW91ciBwYXNzd29yZCB3aWxsIGV4cGlyZSBpbiAzIGRheXMnIH1cbiAgICAvLyBdO1xuICAgIC8vIHRoaXMubm90aWZpY2F0aW9uQ291bnQgPSB0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoO1xuICB9XG5cbiAgcG9zdFVzZXJOYW1lR2V0Tm90aWZpYWN0aW9uKCkge1xuICAgIGxldCBqc29uOiBhbnkgPSB7XG4gICAgICB1c2VyX2lkOiB0aGlzLnZlcmlmaWVkX3VzZXJfaWRcbiAgICB9XG4gICAgdGhpcy5oZWFkZXJTZXJ2aWNlLnBvc3RVc2VyTmFtZUdldE5vdGlmaWFjdGlvbihqc29uKS5zdWJzY3JpYmUoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gZGF0YTtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9uQ291bnQgPSB0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoO1xuICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpXG4gICAgfSlcblxuICB9XG5cbiAgc2V0SW50ZXJ2YWwoKSB7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5wb3N0VXNlck5hbWVHZXROb3RpZmlhY3Rpb24oKVxuICAgIH0sIDUwMDAwMClcbiAgfVxuXG4gIGRlbGV0ZU5vdGlmaWNhdGlvbihldmVudDogYW55KSB7XG4gICAgbGV0IGpzb246IGFueSA9IHtcbiAgICAgIG5vdGlmaWNhdGlvbl9pZDogZXZlbnQsXG4gICAgICB1c2VyX2lkOiB0aGlzLnZlcmlmaWVkX3VzZXJfaWRcbiAgICB9XG4gICAgdGhpcy5oZWFkZXJTZXJ2aWNlLnBvc3RVc2VyTmFtZURlbGV0ZU5vdGlmaWFjdGlvbihqc29uKS5zdWJzY3JpYmUoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgdGhpcy5wb3N0VXNlck5hbWVHZXROb3RpZmlhY3Rpb24oKVxuICAgICAgdGhpcy5tZW51VHJpZ2dlci5vcGVuTWVudSgpO1xuICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpXG4gICAgfSlcbiAgfVxuXG4gIGNsZWFyQWxsTm90aWZpY2F0aW9ucygpIHtcbiAgICBsZXQganNvbjogYW55ID0ge1xuICAgICAgdXNlcl9pZDogdGhpcy52ZXJpZmllZF91c2VyX2lkXG4gICAgfVxuICAgIHRoaXMuaGVhZGVyU2VydmljZS5wb3N0VXNlck5hbWVEZWxldGVOb3RpZmlhY3Rpb24oanNvbikuc3Vic2NyaWJlKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIHRoaXMucG9zdFVzZXJOYW1lR2V0Tm90aWZpYWN0aW9uKClcbiAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKVxuICAgIH0pXG4gIH1cblxuICBub3RpZmljYXRpb25UcmlnZ2VyKCkge1xuICAgIGlmICh0aGlzLm5vdGlmaWNhdGlvbnM/Lmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLm1lbnVUcmlnZ2VyLmNsb3NlTWVudSgpO1xuICAgICAgdGhpcy50b2FzdHIuaW5mbygnTm8gTm90aWZpY2F0aW9ucycsICcnLCB7XG4gICAgICAgIHRpbWVPdXQ6IDMwMDAsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXROb3RpZmljYXRpb25DbGFzcyhpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBjb2xvcnMgPSBbXG4gICAgICAnY29sb3ItMCcsICdjb2xvci0xJywgJ2NvbG9yLTInLCAnY29sb3ItMycsICdjb2xvci00JyxcbiAgICAgICdjb2xvci01JywgJ2NvbG9yLTYnLCAnY29sb3ItNycsICdjb2xvci04JywgJ2NvbG9yLTknXG4gICAgICAvLyBBZGQgbW9yZSBjb2xvcnMgYXMgbmVlZGVkXG4gICAgXTtcbiAgICByZXR1cm4gY29sb3JzW2luZGV4ICUgY29sb3JzLmxlbmd0aF07XG4gIH1cblxuICBsb2dvdXRGdW5jdGlvbigpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZ2V0X3VzZXJuYW1lXCIpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZ2V0X3VzZXJuYW1lX25hbWVcIik7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJnZXRfdXNlcm5hbWVfdXNlcm5hbWVcIik7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJnZXRfdXNlcm5hbWVfaWRcIik7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJnZXRfcm9sZVwiKTtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImVtcF9kZXNpZ25hdGlvblwiKTtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImdldF9kZXBhcnRtZW50X2lkXCIpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdtb2R1bGVfZGF0YScpO1xuICAgIC8vIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZ2V0X3Rva2VuXCIpO1xuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnLi9sb2dpbiddKVxuICB9XG5cbn1cbiIsIjwhLS08Yy1oZWFkZXIgY2xhc3M9XCJtYi00IGQtcHJpbnQtbm9uZVwiIHBvc2l0aW9uPVwic3RpY2t5XCI+LS0+XG5cbiAgPG5nLWNvbnRhaW5lcj5cbiAgICA8Yy1jb250YWluZXIgW2ZsdWlkXT1cInRydWVcIiBjbGFzcz1cImhlYWRlci1uYXYgYm9yZGVyLWJvdHRvbSBweC00IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgPGMtaGVhZGVyLW5hdiBjbGFzcz1cIm14LTAgZC1tZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICA8YnV0dG9uIFtjU2lkZWJhclRvZ2dsZV09XCJzaWRlYmFySWRcIiBjSGVhZGVyVG9nZ2xlciBjbGFzcz1cImJ0blwiIHRvZ2dsZT1cInZpc2libGVcIlxuICAgICAgICAgIHN0eWxlPVwibWFyZ2luLWlubGluZS1zdGFydDogLTE0cHg7XCI+XG4gICAgICAgICAgPHN2ZyBjSWNvbiBuYW1lPVwiY2lsTWVudVwiIHNpemU9XCJsZ1wiPjwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHAgY2xhc3M9XCJoZWFkX3RhZ1wiPlxuICAgICAgICAgIFNBTkRTIENPTk5FQ1Q8L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiaGVhZF90YWcyXCI+U0lHTkFMU1xuICAgICAgICAgIEFORCBTWVNURU1TIElORElBIFBWVCBMVEQ8L3A+XG4gICAgICA8L2MtaGVhZGVyLW5hdj5cblxuICAgICAgPGMtaGVhZGVyLW5hdiBjbGFzcz1cImQtbWQtZmxleCBtcy1hdXRvXCI+XG4gICAgICAgIDxkaXYgW21hdE1lbnVUcmlnZ2VyRm9yXT1cIm1lbnVcIiAoY2xpY2spPVwibm90aWZpY2F0aW9uVHJpZ2dlcigpXCI+XG4gICAgICAgICAgPGEgY05hdkxpbmsgc3R5bGU9XCJkaXNwbGF5OiBmbGV4O1wiPlxuICAgICAgICAgICAgPG1hdC1pY29uPm5vdGlmaWNhdGlvbnM8L21hdC1pY29uPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAtOHB4O21hcmdpbi10b3A6IC05cHg7XCJcbiAgICAgICAgICAgICAgKm5nSWY9XCJub3RpZmljYXRpb25zPy5sZW5ndGggPiAwICYmIG5vdGlmaWNhdGlvbnM/Lmxlbmd0aCA8PSA5OVwiPlxuICAgICAgICAgICAgICA8Yy1iYWRnZSBjb2xvcj1cImRhbmdlclwiIHN0eWxlPVwicGFkZGluZy1sZWZ0OiA1cHg7cGFkZGluZy1yaWdodDogNXB4O1wiPnt7dGhpcy5ub3RpZmljYXRpb25Db3VudH19PC9jLWJhZGdlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLWxlZnQ6IC04cHg7bWFyZ2luLXRvcDogLTlweDtcIlxuICAgICAgICAgICAgICAqbmdJZj1cIm5vdGlmaWNhdGlvbnM/Lmxlbmd0aCA+IDAgJiYgbm90aWZpY2F0aW9ucz8ubGVuZ3RoID4gOTlcIj5cbiAgICAgICAgICAgICAgPGMtYmFkZ2UgY29sb3I9XCJkYW5nZXJcIiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O3BhZGRpbmctcmlnaHQ6IDVweDtcIj45OSs8L2MtYmFkZ2U+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bWF0LW1lbnUgI21lbnU9XCJtYXRNZW51XCIgY2xhc3M9XCJub3RpZmljYXRpb24tbWF0LW1lbnVcIj5cbiAgICAgICAgICA8bWF0LWxpc3QgKm5nSWY9XCJub3RpZmljYXRpb25zPy5sZW5ndGggPiAwXCI+XG4gICAgICAgICAgICA8bWF0LWxpc3QtaXRlbSAqbmdGb3I9XCJsZXQgbm90aWZpY2F0aW9uIG9mIG5vdGlmaWNhdGlvbnM7IGxldCBpID0gaW5kZXhcIiBbbmdDbGFzc109XCJnZXROb3RpZmljYXRpb25DbGFzcyhpKVwiXG4gICAgICAgICAgICAgIGNsYXNzPVwibm90aWZpY2F0aW9uLWl0ZW1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvbi1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAge3tub3RpZmljYXRpb24ubm90aWZpY2F0aW9uX21zZ319Jm5ic3A7IDxzcGFuIG1hdFRvb2x0aXA9XCJDbGVhclwiIG1hdFRvb2x0aXBQb3NpdGlvbj1cInJpZ2h0XCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZGVsZXRlLWJ1dHRvblwiIChjbGljayk9XCJkZWxldGVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uLm5vdGlmaWNhdGlvbl9pZClcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbWF0LWxpc3QtaXRlbT5cbiAgICAgICAgICA8L21hdC1saXN0PlxuICAgICAgICAgIDxidXR0b24gbWF0LW1lbnUtaXRlbSAqbmdJZj1cIm5vdGlmaWNhdGlvbnM/Lmxlbmd0aCA+IDBcIiAoY2xpY2spPVwiY2xlYXJBbGxOb3RpZmljYXRpb25zKClcIj5cbiAgICAgICAgICAgIDxtYXQtaWNvbj5ub3RpZmljYXRpb25zX29mZjwvbWF0LWljb24+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogMTVweDtcIj5DbGVhciBBbGwgTm90aWZpY2F0aW9uczwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9tYXQtbWVudT5cbiAgICAgIDwvYy1oZWFkZXItbmF2PlxuICBcbiAgICAgIDxjLWhlYWRlci1uYXYgY2xhc3M9XCJteC0wXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ1c2VyRHJvcGRvd25cIiAvPlxuICAgICAgPC9jLWhlYWRlci1uYXY+XG4gIFxuICAgIDwvYy1jb250YWluZXI+XG4gICAgPCEtLSA8Yy1jb250YWluZXIgW2ZsdWlkXT1cInRydWVcIiBjbGFzcz1cInB4LTRcIj5cbiAgICAgIDxjLWJyZWFkY3J1bWItcm91dGVyIC8+XG4gICAgPC9jLWNvbnRhaW5lcj4gLS0+XG4gIDwvbmctY29udGFpbmVyPlxuICA8IS0tPC9jLWhlYWRlcj4tLT5cbiAgXG4gIDxuZy10ZW1wbGF0ZSAjdXNlckRyb3Bkb3duPlxuICAgIDxjLWRyb3Bkb3duIFtwb3BwZXJPcHRpb25zXT1cInsgcGxhY2VtZW50OiAnYm90dG9tLXN0YXJ0JyB9XCIgdmFyaWFudD1cIm5hdi1pdGVtXCI+XG4gICAgICA8YnV0dG9uIFtjYXJldF09XCJmYWxzZVwiIGNEcm9wZG93blRvZ2dsZSBjbGFzcz1cInB5LTAgcGUtMFwiPlxuICAgICAgICA8Yy1hdmF0YXIgc2hhcGU9XCJyb3VuZGVkLTFcIiBbc2l6ZV09XCInbWQnXCIgc3JjPVwiLi4vLi4vLi4vLi4vYXNzZXRzL1NBTkRTIExvZ28gSWNvbiAyNHgyNC5zdmdcIiBzdGF0dXM9XCJzdWNjZXNzXCJcbiAgICAgICAgICB0ZXh0Q29sb3I9XCJwcmltYXJ5XCIgLz5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPHVsIGNEcm9wZG93bk1lbnUgY2xhc3M9XCJwdC0wIHctYXV0b1wiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGEgY0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgIDxzdmcgY0ljb24gY2xhc3M9XCJtZS0yXCIgbmFtZT1cImNpbFVzZXJcIj48L3N2Zz5cbiAgICAgICAgICAgIHt7dmVyaWZpZWRfdXNlcl9uYW1lfX1cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaT5cbiAgICAgICAgICA8YSBjRHJvcGRvd25JdGVtIHJvdXRlckxpbms9XCJcIiAoY2xpY2spPVwibG9nb3V0RnVuY3Rpb24oKVwiPlxuICAgICAgICAgICAgPHN2ZyBjSWNvbiBjbGFzcz1cIm1lLTJcIiBuYW1lPVwiY2lsQWNjb3VudExvZ291dFwiPjwvc3ZnPlxuICAgICAgICAgICAgTG9nb3V0XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgPC91bD5cbiAgICA8L2MtZHJvcGRvd24+XG4gIDwvbmctdGVtcGxhdGU+XG4gIFxuICA8bmctdGVtcGxhdGUgI3RoZW1lRHJvcGRvd24+XG4gICAgPGMtZHJvcGRvd24gYWxpZ25tZW50PVwiZW5kXCIgdmFyaWFudD1cIm5hdi1pdGVtXCI+XG4gICAgICA8YnV0dG9uIFtjYXJldF09XCJmYWxzZVwiIGNEcm9wZG93blRvZ2dsZT5cbiAgICAgICAgPHN2ZyBjSWNvbiBbbmFtZV09XCJpY29ucygpXCIgc2l6ZT1cImxnXCI+PC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxkaXYgY0Ryb3Bkb3duTWVudT5cbiAgICAgICAgQGZvciAobW9kZSBvZiBjb2xvck1vZGVzOyB0cmFjayBtb2RlLm5hbWUpIHtcbiAgICAgICAgPGJ1dHRvbiAoY2xpY2spPVwiY29sb3JNb2RlLnNldChtb2RlLm5hbWUpXCIgW2FjdGl2ZV09XCJjb2xvck1vZGUoKT09PW1vZGUubmFtZVwiIFtyb3V0ZXJMaW5rXT1cIltdXCIgY0Ryb3Bkb3duSXRlbVxuICAgICAgICAgIGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgIDxzdmcgY0ljb24gY2xhc3M9XCJtZS0yXCIgW25hbWVdPVwibW9kZS5pY29uXCIgc2l6ZT1cImxnXCI+PC9zdmc+XG4gICAgICAgICAge3sgbW9kZS50ZXh0IH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICA8L2MtZHJvcGRvd24+XG4gIDwvbmctdGVtcGxhdGU+IiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTGluaywgUm91dGVyT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nU2Nyb2xsYmFyIH0gZnJvbSAnbmd4LXNjcm9sbGJhcic7XG5cbmltcG9ydCB7IEljb25EaXJlY3RpdmUgfSBmcm9tICdAY29yZXVpL2ljb25zLWFuZ3VsYXInO1xuaW1wb3J0IHtcbiAgQ29udGFpbmVyQ29tcG9uZW50LFxuICBJTmF2QXR0cmlidXRlcyxcbiAgSU5hdkxpbmtQcm9wcyxcbiAgU2hhZG93T25TY3JvbGxEaXJlY3RpdmUsXG4gIFNpZGViYXJCcmFuZENvbXBvbmVudCxcbiAgU2lkZWJhckNvbXBvbmVudCxcbiAgU2lkZWJhckZvb3RlckNvbXBvbmVudCxcbiAgU2lkZWJhckhlYWRlckNvbXBvbmVudCxcbiAgU2lkZWJhck5hdkNvbXBvbmVudCxcbiAgU2lkZWJhclRvZ2dsZURpcmVjdGl2ZSxcbiAgU2lkZWJhclRvZ2dsZXJEaXJlY3RpdmVcbn0gZnJvbSAnQGNvcmV1aS9hbmd1bGFyJztcblxuaW1wb3J0IHsgRGVmYXVsdEZvb3RlckNvbXBvbmVudCwgRGVmYXVsdEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vJztcbmltcG9ydCB7IElOYXZCYWRnZSwgSU5hdkxhYmVsLCBJTmF2V3JhcHBlciB9IGZyb20gJ0Bjb3JldWkvYW5ndWxhci9saWIvc2lkZWJhci9zaWRlYmFyLW5hdi9zaWRlYmFyLW5hdic7XG4vLyBpbXBvcnQgeyBuYXZJdGVtcyB9IGZyb20gJy4vX25hdic7XG5pbXBvcnQgeyBCYWNrZHJvcFNlcnZpY2UgfSBmcm9tICdzcmMvYXBwL3NlcnZpY2UvYmFja2Ryb3Auc2VydmljZSdcbmV4cG9ydCBpbnRlcmZhY2UgSU5hdkRhdGEge1xuICBuYW1lPzogc3RyaW5nO1xuICB1cmw/OiBzdHJpbmcgfCBhbnlbXTtcbiAgaHJlZj86IHN0cmluZztcbiAgaWNvbj86IHN0cmluZztcbiAgaWNvbkNvbXBvbmVudD86IGFueTtcbiAgYmFkZ2U/OiBJTmF2QmFkZ2U7XG4gIHRpdGxlPzogYm9vbGVhbjtcbiAgY2hpbGRyZW4/OiBJTmF2RGF0YVtdO1xuICB2YXJpYW50Pzogc3RyaW5nO1xuICBhdHRyaWJ1dGVzPzogSU5hdkF0dHJpYnV0ZXM7XG4gIGRpdmlkZXI/OiBib29sZWFuO1xuICBjbGFzcz86IHN0cmluZztcbiAgbGFiZWw/OiBJTmF2TGFiZWw7XG4gIHdyYXBwZXI/OiBJTmF2V3JhcHBlcjtcbiAgbGlua1Byb3BzPzogSU5hdkxpbmtQcm9wcztcbiAgcm9sZT86IG51bWJlclxufVxuXG5leHBvcnQgZW51bSBSb2xlIHtcbiAgU3VwZXJBZG1pbiA9ICcxJyxcbiAgQWRtaW4gPSAnMicsXG4gIEVkaXRvciA9ICczJyxcbiAgVmlld2VyID0gJzQnLFxufVxuXG5mdW5jdGlvbiBpc092ZXJmbG93bihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICByZXR1cm4gKFxuICAgIGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gZWxlbWVudC5jbGllbnRIZWlnaHQgfHxcbiAgICBlbGVtZW50LnNjcm9sbFdpZHRoID4gZWxlbWVudC5jbGllbnRXaWR0aFxuICApO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtZGFzaGJvYXJkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RlZmF1bHQtbGF5b3V0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZGVmYXVsdC1sYXlvdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW1xuICAgIFNpZGViYXJDb21wb25lbnQsXG4gICAgU2lkZWJhckhlYWRlckNvbXBvbmVudCxcbiAgICBTaWRlYmFyQnJhbmRDb21wb25lbnQsXG4gICAgUm91dGVyTGluayxcbiAgICBJY29uRGlyZWN0aXZlLFxuICAgIE5nU2Nyb2xsYmFyLFxuICAgIFNpZGViYXJOYXZDb21wb25lbnQsXG4gICAgU2lkZWJhckZvb3RlckNvbXBvbmVudCxcbiAgICBTaWRlYmFyVG9nZ2xlRGlyZWN0aXZlLFxuICAgIFNpZGViYXJUb2dnbGVyRGlyZWN0aXZlLFxuICAgIERlZmF1bHRIZWFkZXJDb21wb25lbnQsXG4gICAgU2hhZG93T25TY3JvbGxEaXJlY3RpdmUsXG4gICAgQ29udGFpbmVyQ29tcG9uZW50LFxuICAgIFJvdXRlck91dGxldCxcbiAgICBEZWZhdWx0Rm9vdGVyQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRGVmYXVsdExheW91dENvbXBvbmVudCB7XG5cbiAgdXNlclJvbGU6IGFueTtcbiAgdXNlck1vZHVsZTogYW55XG4gIHByaXZhdGUgYmFja2Ryb3BTZXJ2aWNlID0gaW5qZWN0KEJhY2tkcm9wU2VydmljZSlcbiAgcHJpdmF0ZSByZW5kZXJlciA9IGluamVjdChSZW5kZXJlcjIpXG4gIHByaXZhdGUgZWxlbWVudFJlZiA9IGluamVjdChFbGVtZW50UmVmKVxuXG4gIHB1YmxpYyBuYXZJdGVtczogSU5hdkRhdGFbXSA9IFtcbiAgICB7XG4gICAgICBuYW1lOiAnVmlzaXQgUGxhbicsXG4gICAgICB1cmw6ICcvbWFya2V0aW5nL3Zpc2l0cGxhbicsXG4gICAgICBpY29uQ29tcG9uZW50OiB7IG5hbWU6ICdjaWwtcHV6emxlJyB9LFxuICAgICAgcm9sZTogMTZcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnRGFzaGJvYXJkJyxcbiAgICAgIHVybDogJy9kYXNoYm9hcmRwby9kYXNoYm9hcmRkZXRhaWxjcm0xJyxcbiAgICAgIGljb25Db21wb25lbnQ6IHsgbmFtZTogJ2NpbC1zcGVlZG9tZXRlcicgfSxcbiAgICAgIHJvbGU6IDFcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnTWFzdGVyJyxcbiAgICAgIHVybDogJy9tYXN0ZXInLFxuICAgICAgaWNvbkNvbXBvbmVudDogeyBuYW1lOiAnY2lsLXN0YXInIH0sXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0N1c3RvbWVyJyxcbiAgICAgICAgICB1cmw6ICcvbWFzdGVyL2N1c3RvbWVyZGV0YWlscycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogMTRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdFbXBsb3llZScsXG4gICAgICAgICAgdXJsOiAnL21hc3Rlci9lbXBsb3llZWRldGFpbHMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnLFxuICAgICAgICAgIHJvbGU6IDE1XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBuYW1lOiAnQ1JNJyxcbiAgICAgIHVybDogJy9jcm1tYW5hZ2VtZW50JyxcbiAgICAgIGljb25Db21wb25lbnQ6IHsgbmFtZTogJ2NpbC1wdXp6bGUnIH0sXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0lucXVpcnknLFxuICAgICAgICAgIHVybDogJy9jcm1tYW5hZ2VtZW50L2lucXVpcnlkZXRhaWxzJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0JyxcbiAgICAgICAgICByb2xlOiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnT2ZmZXJzJyxcbiAgICAgICAgICB1cmw6ICcvY3JtbWFuYWdlbWVudC9vZmZlcmRldGFpbHMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnLFxuICAgICAgICAgIHJvbGU6IDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdQdXJjaGFzZSBPcmRlcicsXG4gICAgICAgICAgdXJsOiAnL2NybW1hbmFnZW1lbnQvcHVyY2hhc2VvcmRlcmRldGFpbHMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnLFxuICAgICAgICAgIHJvbGU6IDZcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdPZmZlciBBcHByb3ZhbCcsXG4gICAgICAgICAgdXJsOiAnL2NybW1hbmFnZW1lbnQvb2ZmZXJhcHByb3ZhbCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogOVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSwge1xuICAgICAgbmFtZTogJ1VzZXIgTWFuYWdlbWVudCcsXG4gICAgICB1cmw6ICcvdXNlcm1hbmFnZW1lbnQnLFxuICAgICAgaWNvbkNvbXBvbmVudDogeyBuYW1lOiAnY2lsLXVzZXInIH0sXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0RlcGFydG1lbnQnLFxuICAgICAgICAgIHVybDogJy91c2VybWFuYWdlbWVudC91c2VyX2RlcGFydG1lbnQnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnLFxuICAgICAgICAgIHJvbGU6IDExXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnVXNlcnMnLFxuICAgICAgICAgIHVybDogJy91c2VybWFuYWdlbWVudC91c2VyX2RldGFpbHMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnLFxuICAgICAgICAgIHJvbGU6IDEwXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnTW9kdWxlcycsXG4gICAgICAgICAgdXJsOiAnL3VzZXJtYW5hZ2VtZW50L3VzZXJfbW9kdWxlcycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogMTJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ1JlcG9ydHMnLFxuICAgICAgdXJsOiAnL3JlcG9ydHMnLFxuICAgICAgaWNvbkNvbXBvbmVudDogeyBuYW1lOiAnY2lsLW5vdGVzJyB9LFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdTdW1tYXJ5IFJlcG9ydCcsXG4gICAgICAgICAgdXJsOiAnL3JlcG9ydHMvc3VtbWFyeXJlcG9ydCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogMTNcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6IHRydWUsXG4gICAgICBuYW1lOiAnVGhlbWUnXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnQ29sb3JzJyxcbiAgICAgIHVybDogJy90aGVtZS9jb2xvcnMnLFxuICAgICAgaWNvbkNvbXBvbmVudDogeyBuYW1lOiAnY2lsLWRyb3AnIH0sXG4gICAgICByb2xlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnVHlwb2dyYXBoeScsXG4gICAgICB1cmw6ICcvdGhlbWUvdHlwb2dyYXBoeScsXG4gICAgICBsaW5rUHJvcHM6IHsgZnJhZ21lbnQ6ICdoZWFkaW5ncycgfSxcbiAgICAgIGljb25Db21wb25lbnQ6IHsgbmFtZTogJ2NpbC1wZW5jaWwnIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdDb21wb25lbnRzJyxcbiAgICAgIHRpdGxlOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnQmFzZScsXG4gICAgICB1cmw6ICcvYmFzZScsXG4gICAgICBpY29uQ29tcG9uZW50OiB7IG5hbWU6ICdjaWwtcHV6emxlJyB9LFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdBY2NvcmRpb24nLFxuICAgICAgICAgIHVybDogJy9iYXNlL2FjY29yZGlvbicsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0JyZWFkY3J1bWJzJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS9icmVhZGNydW1icycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0NhcmRzJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS9jYXJkcycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0Nhcm91c2VsJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS9jYXJvdXNlbCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdDb2xsYXBzZScsXG4gICAgICAgICAgdXJsOiAnL2Jhc2UvY29sbGFwc2UnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnTGlzdCBHcm91cCcsXG4gICAgICAgICAgdXJsOiAnL2Jhc2UvbGlzdC1ncm91cCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdOYXZzICYgVGFicycsXG4gICAgICAgICAgdXJsOiAnL2Jhc2UvbmF2cycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdQYWdpbmF0aW9uJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS9wYWdpbmF0aW9uJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1BsYWNlaG9sZGVyJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS9wbGFjZWhvbGRlcicsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdQb3BvdmVycycsXG4gICAgICAgICAgdXJsOiAnL2Jhc2UvcG9wb3ZlcnMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnUHJvZ3Jlc3MnLFxuICAgICAgICAgIHVybDogJy9iYXNlL3Byb2dyZXNzJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1NwaW5uZXJzJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS9zcGlubmVycycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdUYWJsZXMnLFxuICAgICAgICAgIHVybDogJy9iYXNlL3RhYmxlcycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdUYWJzJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS90YWJzJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1Rvb2x0aXBzJyxcbiAgICAgICAgICB1cmw6ICcvYmFzZS90b29sdGlwcycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0J1dHRvbnMnLFxuICAgICAgdXJsOiAnL2J1dHRvbnMnLFxuICAgICAgaWNvbkNvbXBvbmVudDogeyBuYW1lOiAnY2lsLWN1cnNvcicgfSxcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQnV0dG9ucycsXG4gICAgICAgICAgdXJsOiAnL2J1dHRvbnMvYnV0dG9ucycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCcsXG4gICAgICAgICAgcm9sZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0J1dHRvbiBncm91cHMnLFxuICAgICAgICAgIHVybDogJy9idXR0b25zL2J1dHRvbi1ncm91cHMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnRHJvcGRvd25zJyxcbiAgICAgICAgICB1cmw6ICcvYnV0dG9ucy9kcm9wZG93bnMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdGb3JtcycsXG4gICAgICB1cmw6ICcvZm9ybXMnLFxuICAgICAgaWNvbkNvbXBvbmVudDogeyBuYW1lOiAnY2lsLW5vdGVzJyB9LFxuICAgICAgcm9sZTogMCxcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnRm9ybSBDb250cm9sJyxcbiAgICAgICAgICB1cmw6ICcvZm9ybXMvZm9ybS1jb250cm9sJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1NlbGVjdCcsXG4gICAgICAgICAgdXJsOiAnL2Zvcm1zL3NlbGVjdCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdDaGVja3MgJiBSYWRpb3MnLFxuICAgICAgICAgIHVybDogJy9mb3Jtcy9jaGVja3MtcmFkaW9zJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1JhbmdlJyxcbiAgICAgICAgICB1cmw6ICcvZm9ybXMvcmFuZ2UnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnSW5wdXQgR3JvdXAnLFxuICAgICAgICAgIHVybDogJy9mb3Jtcy9pbnB1dC1ncm91cCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdGbG9hdGluZyBMYWJlbHMnLFxuICAgICAgICAgIHVybDogJy9mb3Jtcy9mbG9hdGluZy1sYWJlbHMnLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnTGF5b3V0JyxcbiAgICAgICAgICB1cmw6ICcvZm9ybXMvbGF5b3V0JyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1ZhbGlkYXRpb24nLFxuICAgICAgICAgIHVybDogJy9mb3Jtcy92YWxpZGF0aW9uJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnQ2hhcnRzJyxcbiAgICAgIGljb25Db21wb25lbnQ6IHsgbmFtZTogJ2NpbC1jaGFydC1waWUnIH0sXG4gICAgICB1cmw6ICcvY2hhcnRzJyxcbiAgICAgIHJvbGU6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdJY29ucycsXG4gICAgICBpY29uQ29tcG9uZW50OiB7IG5hbWU6ICdjaWwtc3RhcicgfSxcbiAgICAgIHVybDogJy9pY29ucycsXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0NvcmVVSSBGcmVlJyxcbiAgICAgICAgICB1cmw6ICcvaWNvbnMvY29yZXVpLWljb25zJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0JyxcbiAgICAgICAgICBiYWRnZToge1xuICAgICAgICAgICAgY29sb3I6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIHRleHQ6ICdGUkVFJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdDb3JlVUkgRmxhZ3MnLFxuICAgICAgICAgIHVybDogJy9pY29ucy9mbGFncycsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdDb3JlVUkgQnJhbmRzJyxcbiAgICAgICAgICB1cmw6ICcvaWNvbnMvYnJhbmRzJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnTm90aWZpY2F0aW9ucycsXG4gICAgICB1cmw6ICcvbm90aWZpY2F0aW9ucycsXG4gICAgICBpY29uQ29tcG9uZW50OiB7IG5hbWU6ICdjaWwtYmVsbCcgfSxcbiAgICAgIHJvbGU6IDAsXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0FsZXJ0cycsXG4gICAgICAgICAgdXJsOiAnL25vdGlmaWNhdGlvbnMvYWxlcnRzJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0JhZGdlcycsXG4gICAgICAgICAgdXJsOiAnL25vdGlmaWNhdGlvbnMvYmFkZ2VzJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ01vZGFsJyxcbiAgICAgICAgICB1cmw6ICcvbm90aWZpY2F0aW9ucy9tb2RhbCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdUb2FzdCcsXG4gICAgICAgICAgdXJsOiAnL25vdGlmaWNhdGlvbnMvdG9hc3RzJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnV2lkZ2V0cycsXG4gICAgICB1cmw6ICcvd2lkZ2V0cycsXG4gICAgICBpY29uQ29tcG9uZW50OiB7IG5hbWU6ICdjaWwtY2FsY3VsYXRvcicgfSxcbiAgICAgIGJhZGdlOiB7XG4gICAgICAgIGNvbG9yOiAnaW5mbycsXG4gICAgICAgIHRleHQ6ICdORVcnXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogdHJ1ZSxcbiAgICAgIG5hbWU6ICdFeHRyYXMnXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnUGFnZXMnLFxuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIGljb25Db21wb25lbnQ6IHsgbmFtZTogJ2NpbC1zdGFyJyB9LFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdMb2dpbicsXG4gICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1JlZ2lzdGVyJyxcbiAgICAgICAgICB1cmw6ICcvcmVnaXN0ZXInLFxuICAgICAgICAgIGljb246ICduYXYtaWNvbi1idWxsZXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnRXJyb3IgNDA0JyxcbiAgICAgICAgICB1cmw6ICcvNDA0JyxcbiAgICAgICAgICBpY29uOiAnbmF2LWljb24tYnVsbGV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0Vycm9yIDUwMCcsXG4gICAgICAgICAgdXJsOiAnLzUwMCcsXG4gICAgICAgICAgaWNvbjogJ25hdi1pY29uLWJ1bGxldCdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6IHRydWUsXG4gICAgICBuYW1lOiAnTGlua3MnLFxuICAgICAgY2xhc3M6ICdtdC1hdXRvJ1xuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0RvY3MnLFxuICAgICAgdXJsOiAnaHR0cHM6Ly9jb3JldWkuaW8vYW5ndWxhci9kb2NzLzUueC8nLFxuICAgICAgaWNvbkNvbXBvbmVudDogeyBuYW1lOiAnY2lsLWRlc2NyaXB0aW9uJyB9LFxuICAgICAgYXR0cmlidXRlczogeyB0YXJnZXQ6ICdfYmxhbmsnIH1cbiAgICB9XG4gIF07XG5cbiAgcHVibGljIGZpbHRlcmVkTmF2SXRlbXM6IElOYXZEYXRhW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnVzZXJSb2xlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2dldF9yb2xlJyk7XG4gICAgY29uc3Qgc3RvcmVkTW9kdWxlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21vZHVsZV9kYXRhJylcbiAgICBpZiAoc3RvcmVkTW9kdWxlICE9IG51bGwpIHtcbiAgICAgIHRoaXMudXNlck1vZHVsZSA9IEpTT04ucGFyc2Uoc3RvcmVkTW9kdWxlKTtcbiAgICB9XG4gICAgdGhpcy5maWx0ZXJlZE5hdkl0ZW1zID0gdGhpcy5maWx0ZXJOYXZJdGVtcyh0aGlzLm5hdkl0ZW1zKTtcbiAgfVxuXG4gIHByaXZhdGUgZmlsdGVyTmF2SXRlbXMoaXRlbXM6IElOYXZEYXRhW10pOiBJTmF2RGF0YVtdIHtcbiAgICByZXR1cm4gaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuXG4gICAgICBpZiAodGhpcy51c2VyTW9kdWxlICYmIHRoaXMudXNlck1vZHVsZS5pbmNsdWRlcyhpdGVtLnJvbGUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGl0ZW0uY2hpbGRyZW4gPSB0aGlzLmZpbHRlck5hdkl0ZW1zKGl0ZW0uY2hpbGRyZW4pO1xuICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYmFja2Ryb3BTZXJ2aWNlLmlzQmFja2Ryb3BPcGVuJC5zdWJzY3JpYmUoaXNPcGVuID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlQmx1cihpc09wZW4pXG4gICAgICB0aGlzLnRvZ2dsZUJsdXJoZWFkZXIoaXNPcGVuKVxuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlQmx1cihpc09wZW46IGJvb2xlYW4pIHtcbiAgICAvLyB0aGlzLmlzT3BlbiA9IGlzT3BlbjtcbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaWRlYmFyMScpLCAnc2lkZWJhci1kaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaWRlYmFyMScpLCAnc2lkZWJhci1kaXNhYmxlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUJsdXJoZWFkZXIoaXNPcGVuOiBib29sZWFuKSB7XG4gICAgLy8gdGhpcy5pc09wZW4gPSBpc09wZW47XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcjInKSwgJ3NpZGViYXItZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcjInKSwgJ3NpZGViYXItZGlzYWJsZWQnKTtcbiAgICB9XG4gIH1cblxuICBvblNjcm9sbGJhclVwZGF0ZSgkZXZlbnQ6IGFueSkge1xuICAgIC8vIGlmICgkZXZlbnQudmVydGljYWxVc2VkKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3ZlcnRpY2FsVXNlZCcsICRldmVudC52ZXJ0aWNhbFVzZWQpO1xuICAgIC8vIH1cbiAgfVxufVxuIiwiPCEtLXNpZGViYXItLT5cbjxjLXNpZGViYXJcbiAgI3NpZGViYXIxPVwiY1NpZGViYXJcIlxuICBjbGFzcz1cIlwiXG4gIGNvbG9yU2NoZW1lPVwiZGFya1wiXG4gIGlkPVwic2lkZWJhcjFcIlxuICB2aXNpYmxlXG4+XG4gIDxjLXNpZGViYXItaGVhZGVyIGNsYXNzPVwiYm9yZGVyLWJvdHRvbVwiPlxuICAgIDxjLXNpZGViYXItYnJhbmQgW3JvdXRlckxpbmtdPVwiW11cIj5cbiAgICAgIDwhLS0gPHN2ZyBbY2xhc3NdPVwie2ljb246IGZhbHNlfVwiIGNJY29uIGNsYXNzPVwic2lkZWJhci1icmFuZC1mdWxsXCIgaGVpZ2h0PVwiMzJcIiBuYW1lPVwibG9nb1wiIHRpdGxlPVwiQ29yZVVJIExvZ29cIj48L3N2Zz5cbiAgICAgIDxzdmcgY0ljb24gY2xhc3M9XCJzaWRlYmFyLWJyYW5kLW5hcnJvd1wiIGhlaWdodD1cIjMyXCIgbmFtZT1cInNpZ25ldFwiIHRpdGxlPVwiQ29yZVVJIExvZ29cIj48L3N2Zz4gLS0+XG4gICAgICA8aW1nIGhlaWdodD1cIjMyXCIgd2lkdGg9XCIxMzBcIiBzcmM9XCIuLi8uLi8uLi9hc3NldHMvU0FORFMgTG9nby0xMC5zdmdcIj5cbiAgICA8L2Mtc2lkZWJhci1icmFuZD5cbiAgPC9jLXNpZGViYXItaGVhZGVyPlxuXG4gIDxuZy1zY3JvbGxiYXIgI3Njcm9sbGJhcj1cIm5nU2Nyb2xsYmFyXCIgKHVwZGF0ZWQpPVwib25TY3JvbGxiYXJVcGRhdGUoc2Nyb2xsYmFyLnN0YXRlKVwiIGNsYXNzPVwib3ZlcmZsb3dcIiBwb2ludGVyRXZlbnRzTWV0aG9kPVwic2Nyb2xsYmFyXCIgdmlzaWJpbGl0eT1cImhvdmVyXCI+XG4gICAgPGMtc2lkZWJhci1uYXYgI292ZXJmbG93IFtuYXZJdGVtc109XCJmaWx0ZXJlZE5hdkl0ZW1zXCIgZHJvcGRvd25Nb2RlPVwiY2xvc2VcIiBjb21wYWN0IC8+XG4gIDwvbmctc2Nyb2xsYmFyPlxuICA8IS0tIEBpZiAoIXNpZGViYXIxLm5hcnJvdykge1xuICAgIDxjLXNpZGViYXItZm9vdGVyIGNTaWRlYmFyVG9nZ2xlPVwic2lkZWJhcjFcIiBjbGFzcz1cImJvcmRlci10b3AgZC1ub25lIGQtbGctZmxleFwiIHRvZ2dsZT1cInVuZm9sZGFibGVcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIj5cbiAgICAgIDxidXR0b24gY1NpZGViYXJUb2dnbGVyPjwvYnV0dG9uPlxuICAgIDwvYy1zaWRlYmFyLWZvb3Rlcj5cbiAgfSAtLT5cbjwvYy1zaWRlYmFyPlxuXG48IS0tbWFpbi0tPlxuPGRpdiBjbGFzcz1cIndyYXBwZXIgZC1mbGV4IGZsZXgtY29sdW1uIG1pbi12aC0xMDBcIj5cbiAgPCEtLWFwcC1oZWFkZXItLT5cbiAgPGFwcC1kZWZhdWx0LWhlYWRlciBbY1NoYWRvd09uU2Nyb2xsXT1cIidzbSdcIiBpZD1cInNpZGViYXIyXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm1iLTQgZC1wcmludC1ub25lIGhlYWRlciBoZWFkZXItc3RpY2t5IHAtMCBzaGFkb3ctc21cIlxuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPVwic3RpY2t5XCJcbiAgICAgICAgICAgICAgICAgICAgICBzaWRlYmFySWQ9XCJzaWRlYmFyMVwiIC8+XG4gIDwhLS1hcHAtYm9keS0tPlxuICA8ZGl2IGNsYXNzPVwiYm9keSBmbGV4LWdyb3ctMVwiPlxuICAgIDxjLWNvbnRhaW5lciBicmVha3BvaW50PVwiZmx1aWRcIiBjbGFzcz1cImgtYXV0byBweC00XCI+XG4gICAgICA8cm91dGVyLW91dGxldCAvPlxuICAgIDwvYy1jb250YWluZXI+XG4gIDwvZGl2PlxuICA8IS0tYXBwIGZvb3Rlci0tPlxuICA8YXBwLWRlZmF1bHQtZm9vdGVyIC8+XG48L2Rpdj5cbiIsImltcG9ydCB7IGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGVGbiwgUm91dGVyLCBSb3V0ZXJTdGF0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuZXhwb3J0IGNvbnN0IGF1dGhHdWFyZDogQ2FuQWN0aXZhdGVGbiA9IChyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcblxuICBjb25zdCByb3V0ZXIgPSBpbmplY3QoUm91dGVyKVxuICBjb25zdCBnZXRfdXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZ2V0X3VzZXJuYW1lJyk7XG5cbiAgaWYgKGdldF91c2VybmFtZSAhPSBudWxsICYmIGdldF91c2VybmFtZSAhPSBcIlwiICYmIGdldF91c2VybmFtZSAhPSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByb3V0ZXIubmF2aWdhdGUoWycvbG9naW4nXSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgRGVmYXVsdExheW91dENvbXBvbmVudCB9IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCB7IGF1dGhHdWFyZCB9IGZyb20gJy4vZ3VhcmRzL2F1dGguZ3VhcmQnXG5cbmV4cG9ydCBjb25zdCByb3V0ZXM6IFJvdXRlcyA9IFtcbiAge1xuICAgIHBhdGg6ICcnLFxuICAgIHJlZGlyZWN0VG86ICdsb2dpbicsXG4gICAgcGF0aE1hdGNoOiAnZnVsbCdcbiAgfSxcbiAge1xuICAgIHBhdGg6ICcnLFxuICAgIGNvbXBvbmVudDogRGVmYXVsdExheW91dENvbXBvbmVudCxcbiAgICBkYXRhOiB7XG4gICAgICB0aXRsZTogJ0hvbWUnXG4gICAgfSxcbiAgICBjaGlsZHJlbjogW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgbG9hZENoaWxkcmVuOiAoKSA9PiBpbXBvcnQoJy4vdmlld3MvZGFzaGJvYXJkL3JvdXRlcycpLnRoZW4oKG0pID0+IG0ucm91dGVzKSxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFthdXRoR3VhcmRdXG4gICAgICB9LFxuICAgICAgXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd0aGVtZScsXG4gICAgICAgIGxvYWRDaGlsZHJlbjogKCkgPT4gaW1wb3J0KCcuL3ZpZXdzL3RoZW1lL3JvdXRlcycpLnRoZW4oKG0pID0+IG0ucm91dGVzKSxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFthdXRoR3VhcmRdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnYmFzZScsXG4gICAgICAgIGxvYWRDaGlsZHJlbjogKCkgPT4gaW1wb3J0KCcuL3ZpZXdzL2Jhc2Uvcm91dGVzJykudGhlbigobSkgPT4gbS5yb3V0ZXMpLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW2F1dGhHdWFyZF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdidXR0b25zJyxcbiAgICAgICAgbG9hZENoaWxkcmVuOiAoKSA9PiBpbXBvcnQoJy4vdmlld3MvYnV0dG9ucy9yb3V0ZXMnKS50aGVuKChtKSA9PiBtLnJvdXRlcyksXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbYXV0aEd1YXJkXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ2Zvcm1zJyxcbiAgICAgICAgbG9hZENoaWxkcmVuOiAoKSA9PiBpbXBvcnQoJy4vdmlld3MvZm9ybXMvcm91dGVzJykudGhlbigobSkgPT4gbS5yb3V0ZXMpLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW2F1dGhHdWFyZF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdpY29ucycsXG4gICAgICAgIGxvYWRDaGlsZHJlbjogKCkgPT4gaW1wb3J0KCcuL3ZpZXdzL2ljb25zL3JvdXRlcycpLnRoZW4oKG0pID0+IG0ucm91dGVzKSxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFthdXRoR3VhcmRdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnbm90aWZpY2F0aW9ucycsXG4gICAgICAgIGxvYWRDaGlsZHJlbjogKCkgPT4gaW1wb3J0KCcuL3ZpZXdzL25vdGlmaWNhdGlvbnMvcm91dGVzJykudGhlbigobSkgPT4gbS5yb3V0ZXMpLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW2F1dGhHdWFyZF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd3aWRnZXRzJyxcbiAgICAgICAgbG9hZENoaWxkcmVuOiAoKSA9PiBpbXBvcnQoJy4vdmlld3Mvd2lkZ2V0cy9yb3V0ZXMnKS50aGVuKChtKSA9PiBtLnJvdXRlcyksXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbYXV0aEd1YXJkXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ2NoYXJ0cycsXG4gICAgICAgIGxvYWRDaGlsZHJlbjogKCkgPT4gaW1wb3J0KCcuL3ZpZXdzL2NoYXJ0cy9yb3V0ZXMnKS50aGVuKChtKSA9PiBtLnJvdXRlcyksXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbYXV0aEd1YXJkXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3BhZ2VzJyxcbiAgICAgICAgbG9hZENoaWxkcmVuOiAoKSA9PiBpbXBvcnQoJy4vdmlld3MvcGFnZXMvcm91dGVzJykudGhlbigobSkgPT4gbS5yb3V0ZXMpLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW2F1dGhHdWFyZF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZXBvcnRzJyxcbiAgICAgICAgbG9hZENoaWxkcmVuOiAoKSA9PiBpbXBvcnQoJy4vcmVwb3J0cy9yb3V0ZXMnKS50aGVuKChtKSA9PiBtLnJvdXRlcyksXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbYXV0aEd1YXJkXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ21hc3RlcicsXG4gICAgICAgIGxvYWRDaGlsZHJlbjogKCkgPT4gaW1wb3J0KCcuL21hc3Rlci9yb3V0ZXMnKS50aGVuKChtKSA9PiBtLnJvdXRlcyksXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbYXV0aEd1YXJkXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ2NybW1hbmFnZW1lbnQnLFxuICAgICAgICBsb2FkQ2hpbGRyZW46ICgpID0+IGltcG9ydCgnLi9jcm1tYW5hZ2VtZW50L3JvdXRlcycpLnRoZW4oKG0pID0+IG0ucm91dGVzKSxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFthdXRoR3VhcmRdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnbWFya2V0aW5nJyxcbiAgICAgICAgbG9hZENoaWxkcmVuOiAoKSA9PiBpbXBvcnQoJy4vbWFya2V0aW5nL3JvdXRlcycpLnRoZW4oKG0pID0+IG0ucm91dGVzKSxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFthdXRoR3VhcmRdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAndXNlcm1hbmFnZW1lbnQnLFxuICAgICAgICBsb2FkQ2hpbGRyZW46ICgpID0+IGltcG9ydCgnLi91c2VybWFuYWdlbWVudC9yb3V0ZXMnKS50aGVuKChtKSA9PiBtLnJvdXRlcyksXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbYXV0aEd1YXJkXVxuICAgICAgfSx7XG4gICAgICAgIHBhdGg6ICdkYXNoYm9hcmRwbycsXG4gICAgICAgIGxvYWRDaGlsZHJlbjogKCkgPT4gaW1wb3J0KCcuL2Rhc2hib2FyZC9yb3V0ZXMnKS50aGVuKChtKSA9PiBtLnJvdXRlcyksXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbYXV0aEd1YXJkXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHBhdGg6ICc0MDQnLFxuICAgIGxvYWRDb21wb25lbnQ6ICgpID0+IGltcG9ydCgnLi92aWV3cy9wYWdlcy9wYWdlNDA0L3BhZ2U0MDQuY29tcG9uZW50JykudGhlbihtID0+IG0uUGFnZTQwNENvbXBvbmVudCksXG4gICAgZGF0YToge1xuICAgICAgdGl0bGU6ICdQYWdlIDQwNCdcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnNTAwJyxcbiAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vdmlld3MvcGFnZXMvcGFnZTUwMC9wYWdlNTAwLmNvbXBvbmVudCcpLnRoZW4obSA9PiBtLlBhZ2U1MDBDb21wb25lbnQpLFxuICAgIGRhdGE6IHtcbiAgICAgIHRpdGxlOiAnUGFnZSA1MDAnXG4gICAgfVxuICB9LFxuICB7XG4gICAgcGF0aDogJ2xvZ2luJyxcbiAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vdmlld3MvcGFnZXMvbG9naW4vbG9naW4uY29tcG9uZW50JykudGhlbihtID0+IG0uTG9naW5Db21wb25lbnQpLFxuICAgIGRhdGE6IHtcbiAgICAgIHRpdGxlOiAnTG9naW4gUGFnZSdcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBwYXRoOiAncmVnaXN0ZXInLFxuICAgIGxvYWRDb21wb25lbnQ6ICgpID0+IGltcG9ydCgnLi92aWV3cy9wYWdlcy9yZWdpc3Rlci9yZWdpc3Rlci5jb21wb25lbnQnKS50aGVuKG0gPT4gbS5SZWdpc3RlckNvbXBvbmVudCksXG4gICAgZGF0YToge1xuICAgICAgdGl0bGU6ICdSZWdpc3RlciBQYWdlJ1xuICAgIH1cbiAgfSxcbiAgeyBwYXRoOiAnKionLCByZWRpcmVjdFRvOiAnbG9naW4nIH1cbl07XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVMsNEJBQTRCOzs7QUNGckMsU0FBUyxpQkFBeUI7QUFDbEMsU0FBUyxlQUF1QixvQkFBb0I7OztBQ0RwRCxTQUNFLFdBQ0EsZUFDQSxpQkFDQSxhQUNBLGFBQ0EsV0FDQSxhQUNBLFdBQ0EsYUFDQSxVQUNBLFlBQ0EsT0FDQSxPQUNBLE9BQ0EsT0FDQSxPQUNBLE9BQ0Esa0JBQ0EsZ0JBQ0EsY0FDQSxlQUNBLHlCQUNBLGdCQUNBLGVBQ0EsYUFDQSxXQUNBLFNBQ0EsU0FDQSxhQUNBLGVBQ0EsYUFDQSxVQUNBLGFBQ0EsVUFDQSxnQkFDQSxpQkFDQSxrQkFDQSxTQUNBLGtCQUNBLGFBQ0EsZUFDQSxXQUNBLGdCQUNBLFdBQ0EsU0FDQSxtQkFDQSxpQkFDQSxTQUNBLFNBQ0EsU0FDQSxVQUNBLG1CQUNBLG1CQUNBLFdBQ0Esa0JBQ0EsYUFDQSxXQUNBLFNBQ0EsaUJBQ0EsZ0JBQ0EsZUFDQSxvQkFDQSxRQUNBLGNBQ0EsZ0JBQ0EsU0FDQSxTQUNBLFVBQ0EsWUFDQSxjQUNBLGVBQ0EsUUFDQSxXQUNBLFdBQ0EsVUFDQSxXQUNBLGdCQUNBLFNBQ0EsYUFDQSxVQUNBLGFBQ0EsZUFDQSxXQUNBLGdCQUNBLGdCQUNBLFNBQ0EsUUFDQSxTQUNBLFNBQ0EsVUFDQSxjQUNBLFNBQ0EsZUFDQSxlQUNBLHVCQUNLOzs7QUNoR0EsSUFBTSxTQUFTO0VBQ3BCO0VBQ0E7Ozs7Ozs7QUNGSyxJQUFNLE9BQU87RUFDbEI7RUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FGbUdLLElBQU0sYUFBYTtFQUN4QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRixJQUFZO0NBQVosU0FBWUEsYUFBVTtBQUNwQixFQUFBQSxZQUFBLFdBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsZUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxpQkFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxhQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGFBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsV0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxhQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFdBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsYUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxVQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFlBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsT0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxPQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLE9BQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsT0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxPQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLE9BQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsa0JBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsZ0JBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsY0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxlQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLHlCQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGdCQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGVBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsYUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxXQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFNBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsU0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxhQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGVBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsYUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxVQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGFBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsVUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxnQkFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxpQkFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxrQkFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxTQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGtCQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGFBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsZUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxXQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGdCQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFdBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsU0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxtQkFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxpQkFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxTQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFNBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsU0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxVQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLG1CQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLG1CQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFdBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsa0JBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsYUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxXQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFNBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsaUJBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsZ0JBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsZUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxvQkFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxRQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGNBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsZ0JBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsU0FBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxTQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFVBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsWUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxjQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGVBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsUUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxXQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFdBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsVUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxXQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGdCQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFNBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsYUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxVQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGFBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsZUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxXQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGdCQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLGdCQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFNBQUEsSUFBQTtBQUNBLEVBQUFBLFlBQUEsUUFBQSxJQUFBO0FBQ0EsRUFBQUEsWUFBQSxTQUFBLElBQUE7QUFDQSxFQUFBQSxZQUFBLFNBQUEsSUFBQTtBQUNB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R0FDRCxxQ0FBb0MsR0FDcEMsb0JBQW1CLEdBQ25CLGlCQUFnQixDQUFFO0lBRXBCLG9CQUFvQixlQUFlLGNBQWM7SUFDakRDO0lBQ0Esa0JBQWlCOztJQUVqQixrQkFBaUI7SUFDakIsdUJBQXNCO0lBQ3RCLGNBQWE7Ozs7O0FMaENqQixxQkFBcUIsY0FBYyxTQUFTLEVBQ3pDLE1BQU0sU0FBTyxRQUFRLE1BQU0sR0FBRyxDQUFDOyIsIm5hbWVzIjpbIkljb25TdWJzZXQiLCJJY29uU2V0U2VydmljZSIsIkNvbXBvbmVudCIsIkNvbXBvbmVudCIsIkNvbXBvbmVudCIsImluamVjdCIsIlJvdXRlckxpbmsiLCJSb3V0ZXJPdXRsZXQiLCJJY29uRGlyZWN0aXZlIiwiQ29udGFpbmVyQ29tcG9uZW50IiwiU2lkZWJhclRvZ2dsZURpcmVjdGl2ZSIsIlJvbGUiLCJpbmplY3QiLCJfYzAiLCJSb3V0ZXJMaW5rIiwiQ29udGFpbmVyQ29tcG9uZW50IiwiUm91dGVyT3V0bGV0IiwiaW5qZWN0IiwiUm91dGVyIiwiSWNvblNldFNlcnZpY2UiXX0=