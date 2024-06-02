npm install @huggingface/inference;

const express = require('express');
const { HfInference } = require('@huggingface/inference');

const app = express();
const port = process.env.PORT || 3000;

const HF_TOKEN = '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'; // Remplacez par votre token Hugging Face
const hf = new HfInference(HF_TOKEN);

app.get('/generate', async (req, res) => {
    const prompt = req.query.prompt;
    const negativePrompt = req.query.negativePrompt || "";
    const width = parseInt(req.query.width) || 1024;
    const height = parseInt(req.query.height) || 1024;
    const guidanceScale = parseFloat(req.query.guidanceScale) || 7.0;
    const numInferenceSteps = parseInt(req.query.numInferenceSteps) || 28;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt parameter is required" });
    }

    console.log("Parameters received:", { prompt, negativePrompt, width, height, guidanceScale, numInferenceSteps });

    try {
        const response = await hf.textToImage({
            inputs: prompt,
            model: 'stabilityai/stable-diffusion-2',
            parameters: {
                negative_prompt: negativePrompt,
                width: width,
                height: height,
                guidance_scale: guidanceScale,
                num_inference_steps: numInferenceSteps
            }
        });

        console.log("Response from Hugging Face API:", response);

        if (response && response.generated_images) {
            // Encode the generated image as base64
            const base64Image = response.generated_images[0].toString('base64');
            const imageData = `data:image/jpeg;base64,${base64Image}`;
            res.send(imageData);
        } else {
            res.status(500).json({ error: 'Failed to generate image', response });
        }
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
