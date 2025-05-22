const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const tokens = [
"d258df41-393d-479f-a2db-3f76a7176354"];
let tokenIndex = 0;

const ratios = {
   '1:1': { width: 1024, height: 1024 },
  '9:7': { width: 1152, height: 896 },
  '7:9': { width: 896, height: 1152 },
  '19:13': { width: 1216, height: 832 },
  '13:19': { width: 832, height: 1216 },
  '7:4': { width: 1344, height: 768 },
  '4:7': { width: 768, height: 1344 },
  '12:5': { width: 1536, height: 640 },
  '5:12': { width: 640, height: 1536 },
  '3:2': { width: 1440, height: 900 },
  '2:3': { width: 900, height: 1440 },
 '2:2': { width: 1536, height: 1536 }

};

const loras = {
1: "NijiAnimeStyleXL-v1",
2: "niji6-v6",
3: "STYLESPONYXL-RARv0.4Animagine",
4: "XLOutlineponysdxlkohaku-v1.0",
5: "Pony-RetroAnime-V2",
6: "AnimeEnhancerXL-v5",
7: "DetailedAnimeStyleXL-V01",
8: "niji5-v6",
9: "MidjourneyAnimeStyleXL-v1",
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
  59: "xl_more_art-fullxl_realEnhancer-v1",
  60: "midjourneyanimestyle-v1.0",
  61: "NijiBackgroundXL-v1-normal",
};

const models = {
  30: { name: "AnimagineXL-3.1",
    cfg_scale: 8,
    steps: 27,
    negative_prompt: "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]",
    pre_prompt: ",aesthetic style,detailled hair, perfect eyes, perfect anime rendering, midjourney, anime artwork, studio anime, anime style,masterpiece, detailled, best quality, Epic view, ultra detailled"
  }, 
   40: { name: "AnimagineXL-3.1",
    cfg_scale: 8,
    steps: 27,
    negative_prompt: "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]",
    pre_prompt: " "
  },
  1: { name: "AnimagineXL-3.1",
    cfg_scale: 8,
    steps: 27,
    negative_prompt: "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]",
    pre_prompt: "masterpiece, best quality, very aethestic, absurdres"
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
   22: {
    name: "CHIMERA-2",
    cfg_scale: 9,
    steps: 30,
    negative_prompt: "worst quality, low quality, deformed, censored, bad anatomy, watermark, signature",
    pre_prompt: " "
},

 };

app.use(express.static(path.join(__dirname, 'public')));
app.get('/generate-image', async (req, res) => {
  const { prompt, modelIndex = 1, sampler = 'Euler a', ratio = '1:1', steps, cfg_scale, seed = -1, loras: lorasQuery } = req.query;

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

let { width, height } = aspectRatio;
  if (modelIndex >= 11 && modelIndex <= 17) {
    const maxSize = 1024;

    // Si la largeur ou la hauteur est supérieure à 1024, ajuster en conservant les proportions
    if (width > maxSize || height > maxSize) {
      const ratioFactor = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratioFactor);
      height = Math.round(height * ratioFactor);
    }
  }

  const styledPrompt = `${prompt}, ${modelConfig.pre_prompt}`;

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
let imageUrl = null;

const requestSteps = steps || modelConfig.steps;
const requestCfgScale = cfg_scale || modelConfig.cfg_scale;

while (!success) {
  try {
    const currentToken = tokens[tokenIndex];

    const response = await axios.post(
      'https://blackwave.studio/api/v1/generate',
      {
        token: currentToken,
        model: modelConfig.name,
        prompt: styledPrompt,
        negative_prompt: modelConfig.negative_prompt,
        sampler,
        steps: requestSteps,
        width,
        height,
        cfg_scale: requestCfgScale,
        loras: lorasObj,
        seed,
        stream: true
      },
      { responseType: 'stream' }
    );

    // Traiter le stream pour vérifier le statut
    await new Promise((resolve, reject) => {
      response.data.on('data', chunk => {
        try {
          const status = JSON.parse(chunk.toString());

          if (status.status === 'WAITING') {
            console.log(`En attente : ${status.queue_position}/${status.queue_total}`);
          } else if (status.status === 'RUNNING') {
            console.log('Génération en cours...');
          } else if (status.status === 'SUCCESS') {
            console.log(`Image générée avec succès : ${status.image_url}`);
            imageUrl = status.image_url;
            success = true;
            resolve();
          } else if (status.status === 'FAILED') {
            reject(new Error('Génération échouée'));
          }
        } catch (err) {
          // Ignorer les chunks partiels
        }
      });

      response.data.on('error', reject);
      response.data.on('end', () => {
        if (!success) reject(new Error('Stream terminé sans succès'));
      });
    });

  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log("Token refusé. Rotation du token et nouvelle tentative...");
      tokenIndex = (tokenIndex + 1) % tokens.length;
    } else {
      console.error('Erreur lors de la génération :', error.message);
      throw error;
    }
  }
}

// Après réussite
if (success && imageUrl) {
  res.json({ imageUrl });
} else {
  res.status(500).send('Erreur lors de la génération de l’image.');
}
  } catch (err) {
    console.error('Erreur lors de la génération :', err.message);
    res.status(500).send('Erreur lors de la génération de l’image.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
