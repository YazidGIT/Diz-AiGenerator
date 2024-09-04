const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const tokens = [
"c7d20e0e-2fe0-4c97-8de2-eb32ba150000",
"2bfd60e8-59e7-4d66-b780-b79b42782175",
"c6d207ff-cb60-48c2-87ae-87009a80cc9c",
"18f97175-6bb1-4b01-b34f-489c81972af3",
"b2bb02b0-1251-452c-a94d-8cc008204555",
"9cb6873c-26b4-4a97-8ff7-31d272fd9a02",
"0f099a24-b967-41a6-9ee4-f9fadcaceafc",
"3315b917-9914-4090-b5bc-d97b4db05284",
"971f948d-2d80-4152-a5a9-b6883378decf"
];
let tokenIndex = 0;

const ratios = {
  '1:1': { width: 1024, height: 1024 },
  '9:7': { width: 1024, height: 796 },
  '7:9': { width: 796, height: 1024 },
  '19:13': { width: 1024, height: 700 },
  '13:19': { width: 700, height: 1024 },
  '7:4': { width: 1024, height: 585 },
  '4:7': { width: 585, height: 1024 },
  '12:5': { width: 1024, height: 426 },
  '5:12': { width: 426, height: 1024 },
  '3:2': { width: 1024, height: 682 },
  '2:3': { width: 682, height: 1024 }
};

const loras = {
1: "NijiAnimeStyleXL-v1",
2: "niji6-v6",
3: "STYLESPONYXL-RARv0.4Animagine",
4: "XLOutlineponysdxlkohaku-v1.0",
5: "Pony-RetroAnime-V2",
6: "AnimeEnhancerXL-v5",
7: "DetailedAnimeStyleXL-V01",
8: "NijiBackgroundXL-v1-normal",
9: "niji5-v6",
10:"ExtremelyRealisticStyleXLLoRA-V1.0",
11: "ExtraDetailerXL-v1",
12: "DetailTweakerXL-3.0",
13: "AddMoreDetailsXL-v1.0",
14: "AddMoreDetailXL-EnhancesFineTunes-V1",
15: "detailer_XL-Ultra",
16: "ENHANCEFacialdetails-SDXL2.0.8",
17: "AddMoreDetailsColorfulEnhancerXL",
18: "PhotoEnhancerXL-v1",
19: "ShadowCorrectionXL-v1.1",
20: "BodyWeightSliderXL-v1",
21: "SkinToneSliderXL-V1",
22: "XLPerfectHandsProject-v1",
23: "EpiC_AnimeDreamHentaiXLPerfectFingers-V10",
24: "PlunderHentaiStyle-SDXLPONYV2.0",
25: "Nakedgirls-V1",
26: "CunnilingusXL-0.5",
27: "deep_penetrationconceptsliderforponyXL-1.0",
28: "LabiaplastyInniePussyAdjuster-v2.0XLUnp",
29: "MotionSexXL-XL",
30: "BreastsSliderXL-V1",
31: "FluxAnimeStyle-TEST.VERSION",
32: "Fluxcomicsstyle-T2",
33: "FluxFantasydetailers-V1.0",
34: "MidjourneyWhisperFLUXLoRA-1.0",
35: "XLabsFluxRealismLoRA-v1.0",
36: "FluxRealismWoman-V2.0",
37: "FLUXBOOBA-FLUXBOOBA",
38: "FluxPerfectFullRoundBreastsSlimWais-FluxV2",
39: "FluxDetailerTA-v0.1",
40: "SexyPoseStyle-V5Slider",
  41: "Realhands-v1.0",
  42: "AddMoreDetails-AddsElementsDetails-V1.1",
  43: "BetterHands-HANDS",
  44: "AttractiveEyesSDSDXL-SDVersion",
  45: "Breastswithpinknipples-2.0",
  46: "AddMoreRealism-V1.0",
  47: "AddMoreDetails-DetailEnhancerTweakerLoRA-AddMoreDetails",
  48: "AdddetailsEyesFaceSkin-V1",
  49: "MissionaryPOV-v1.0",
  50: "OiledSkinSD1.5Pony-PDXLV1",
  51: "HandsRepairLora-V5",
  52: "HugeButtHugeBreasts-V1",
  53: "Nudewoman-V2",
  54: "OxalisHentaiLora-V1",
  55: "tentaclesSD1.5-v9.0",
  56: "ExtremelyRealisticStyleLoRA-V1.0",
  57: "AddUltraDetails-v1",
  58: "Shinyoiledskin2.0LyCORISLoRA-v2.0LyCORI",
};

const models = {
  1: { name: "AnimagineXL-3.1",
    cfg_scale: 8,
    steps: 27,
    negative_prompt: "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]",
    pre_prompt: "masterpiece, best quality, very aesthetic, absurdres,"
  },
  30: { name: "AnimagineXL-3.1",
    cfg_scale: 8,
    steps: 27,
    negative_prompt: "lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]",
    pre_prompt: " "
  },

2: { name: "AnimagineXL-V3",
    cfg_scale: 7,
    steps: 30,
    negative_prompt: "bad quality, bad hands",
    pre_prompt: "masterpiece, best quality, detailled,"
  },
3: { name: "4thtailanimeHentai-v0.4.5",
    cfg_scale: 7,
    steps: 20,
    negative_prompt: "(worst quality, low quality:1.1), error, bad anatomy, bad hands, watermark, ugly, distorted, monster, manga sfx, EasyNegative",
    pre_prompt: " "
  },
4: { name: "CAT-CitronAnimeTreasure-SDXL",
    cfg_scale: 7,
    steps: 30,
    negative_prompt: "(worst quality, low quality:1.0), ugly face, mutated hands, low res, blurry face, black and white",
    pre_prompt: "((masterpiece, best quality))"
  },
5: { name: "AAMXLAnimeMix-v1.0",
    cfg_scale: 7,
    steps: 25,
    negative_prompt: "(low quality, worst quality:1.4), negativeXL_D, cgi, text, signature, watermark, extra limbs",
    pre_prompt: " "
  },
6: { name: "NUKE-DisneyPixarStyleSDXL-v1",
    cfg_scale: 7,
    steps: 27,
    negative_prompt: "bad quality, bad anatomy, low resolution, ugly, deformed, (watermark, logo, text:1.15), (mickey mouse:1.2)",
    pre_prompt: "(disney pixar style)"
  },
7: { name: "ComicsCharactersDatabaseUNCENSORED-3D",
    cfg_scale: 7,
    steps: 20,
    negative_prompt: "EasyNegative, black and white, text",
    pre_prompt: " "
  },
8: { name: "FLUX.1-dev-fp8",
    cfg_scale: 1,
    steps: 25,
    negative_prompt: "(unhealthy-deformed-joints:2), (unhealthy-hands:2), easynegative, ng_deepnegative_v1_75t, (worst quality:2), (low quality:2),(normal quality:2), lowres, bad anatomy, badhandv4, ((extra limbs)), ((extra legs)), ((fused legs)), ((extra arms)), ((fused arms)), normal quality, ((monochrome)), ((grayscale)), ((watermark)), uneven eyes, lazy eye, (((mutated hand))),",
    pre_prompt: "(best quality, detailled))"
  },
9: { name: "FluxUnchainedArtfulNSFWcapableflux.dtuned-T5_8x8V1.1",
    cfg_scale: 1,
    steps: 25,
    negative_prompt: "bad quality, bad hands",
    pre_prompt: "(best quality, detailled)"
  },
10: { name: "FLUXHYPERTRAINED-DREAMDIFFUSION-BYDICE-V1",
    cfg_scale: 1,
    steps: 25,
    negative_prompt: "bad quality, bad hands",
    pre_prompt: "(best quality, detailled)"
  },
11: { name: "Sudachi-V1",
    cfg_scale: 7,
    steps: 20,
    negative_prompt: "(worst quality, lowres:1.3), 3d",
    pre_prompt: " "
  },
12: { name: "OxalisAnimeHentaiModel-OAH-1",
    cfg_scale: 7,
    steps: 30,
    negative_prompt: "low quality, censored, worst quality",
    pre_prompt: "(anime screencap, uncensored, masterpiece, best quality)"
  },
13: { name: "PerfectWorldV6-V6",
    cfg_scale: 7,
    steps: 24,
    negative_prompt: "(worst quality, low quality:1.4), logo, watermark",
    pre_prompt: "ultra detailed 8k cg,"
  },
14: { name: "ChilloutMix-Ni",
    cfg_scale: 7,
    steps: 25,
    negative_prompt: "(worst quality, low quality:1.3), makeup, mole under eye, mole, logo, watermark, text,paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), backlight, glasses, anime, cartoon, drawing, illustration, boring, 3d render, long neck, out of frame, extra fingers, mutated hands, monochrome, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, glitchy, bokeh, (((long neck))), 3D, 3DCG, cgstation, ((flat chested)), red eyes, extra heads, close up, man asian, text ,watermarks, logo",
    pre_prompt: "unparalleled masterpiece, ultra realistic 8k CG, perfect artwork, ((perfect female figure)), narrow waist, looking at viewer, seductive posture, sexy pose, alluring, clean, beautiful face, pure face, pale skin, ( nsfw, shiny skin, intricate detail, gorgeous"
  },
15: { name: "AstrAnime-6.0",
    cfg_scale: 7,
    steps: 20,
    negative_prompt: "easynegative, ng_deepnegative_v1_75t, (worst quality:2), (low quality:2),(normal quality:2), lowres, bad anatomy, badhandv4, ((extra limbs)), ((extra legs)), ((fused legs)), ((extra arms)), ((fused arms)), normal quality, ((monochrome)), ((grayscale)), ((watermark)), uneven eyes, lazy eye,bad-hands-5, (((mutated hand))),",
    pre_prompt: "masterpiece,"
  },
16: { name: "MeinaHentaiv3-3",
    cfg_scale: 7,
    steps: 30,
    negative_prompt: "(worst quality, low quality:1.4), (interlocked fingers:1.2), monochrome, zombie, signature, watermark",
    pre_prompt: "(masterpiece, best quality, 8k, detailed, perfect eyes)"
  },
17: { name: "3DCartoonVision-V1",
    cfg_scale: 7,
    steps: 30,
    negative_prompt: "bare shoulders, (extra fingers, deformed hands, polydactyl:1.5), (ugly, worst quality, low quality, low-res, jpeg, jpeg artifacts, poorly drawn:2.0), (extra fingers, deformed hands, polydactyl:1.5), cross-eyed, closed eyes, ng-bad_artist, ng-bad_artist_anime, ng-bad_dream, ng-beyond_negative-v1.2, ng-deepnegative-v1.75t, ng-easynegative-v2, ng-new_negative-v1.4, ng-unrealistic_dream, ng-unspeakable-horrors-64v, artist logo, signature, watermark, sign, text,censored",
    pre_prompt: "((masterpiece:1.2), best quality,)"
  },
18: {
    name: "7thanimeXLB-v1.0",
    cfg_scale: 7,
    steps: 25,
    negative_prompt: "(worst quality:1.6),(low quality:1.4),(normal quality:1.2),lowres,jpeg artifacts,long neck,long body,bad anatomy,bad hands,text,error,missing fingers,extra digit,fewer digits,cropped,signature,watermark,username,artist name,",
    pre_prompt: " "
},
  19: {
    name: "VivaldiXL-OpenDallE3AnimeModel-v1.0",
    cfg_scale: 6,
    steps: 27,
    negative_prompt: "bad quality",
    pre_prompt: " "
},
20: {
    name: "Kohaku-XL-psilonRev2-ep5",
    cfg_scale: 6,
    steps: 27,
    negative_prompt: "lowres bad_anatomy bad_hands text error missing_fingers extra_digit fewer_digits cropped worst_quality low_quality normal_quality jpeg_artifacts signature watermark username blurry artist_name,multiple girls,multiple views,",
    pre_prompt: " "
},
 21: {
    name: "7thanimeXLA-v1.0",
    cfg_scale: 7,
    steps: 25,
    negative_prompt: "(worst quality:1.6),(low quality:1.4),(normal quality:1.2),lowres,jpeg artifacts,long neck,long body,bad anatomy,bad hands,text,error,missing fingers,extra digit,fewer digits,cropped,signature,watermark,username,artist name,",
    pre_prompt: " "
},

};
app.use(express.static(path.join(__dirname, 'public')));
app.get('/generate-image', async (req, res) => {
  const { prompt, modelIndex = 1, sampler = 'Euler a', ratio = '1:1', steps, cfg_scale, loras: lorasQuery } = req.query;

  if (!prompt) {
    return res.status(400).send('Prompt is required.');
  }

  const modelConfig = models[modelIndex];
  if (!modelConfig) {
    return res.status(400).send('Invalid model specified.');
  }

  const aspectRatio = ratios[ratio];
  if (!aspectRatio) {
    return res.status(400).send('Invalid ratio specified.');
  }

  const styledPrompt = `${modelConfig.pre_prompt}, ${prompt}`;
  
  let lorasObj = {};
  if (lorasQuery) {
    const loraEntries = lorasQuery.split(',');
    loraEntries.forEach(entry => {
      const [num, weight] = entry.split(':');
      const loraName = loras[num.trim()];
      if (loraName) {
        lorasObj[loraName] = parseFloat(weight) || 1.0;
      }
    });
  }

  try {
    let response;
    let success = false;

    const requestSteps = steps || modelConfig.steps;
    const requestCfgScale = cfg_scale || modelConfig.cfg_scale;

    const currentToken = tokens[tokenIndex];

    while (!success) {
      try {
        response = await axios.post('https://visioncraft.top/api/image/generate', {
          model: modelConfig.name,
          prompt: styledPrompt,
          negative_prompt: modelConfig.negative_prompt,
          token: currentToken,
          sampler,
          steps: requestSteps,
          width: aspectRatio.width,
          height: aspectRatio.height,
          cfg_scale: requestCfgScale,
          loras: lorasObj
        }, {
          responseType: 'stream'
        });

        success = true;
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Retrying Generation...");
        } else {
          throw new Error(error.message);
        }
      }
    }

    if (success) {
      const imagePath = path.join(__dirname, 'cache', 'generated_image.png');
      const imageStream = response.data;
      const fileStream = fs.createWriteStream(imagePath);

      if (!fs.existsSync(path.dirname(imagePath))) {
        fs.mkdirSync(path.dirname(imagePath), { recursive: true });
      }

      imageStream.pipe(fileStream);

      fileStream.on('finish', () => {
        res.sendFile(imagePath);
      });

      fileStream.on('error', (err) => {
        console.error("Stream error:", err);
        res.status(500).send('Error generating image.');
      });
    } else {
      res.status(500).send('Error generating image.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }

  tokenIndex = (tokenIndex + 1) % tokens.length;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
