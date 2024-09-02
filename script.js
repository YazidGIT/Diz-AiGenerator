document.getElementById('generate-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const model = document.getElementById('model').value;
    const ratio = document.getElementById('ratio').value;

    try {
        const response = await fetch(`https://zetsdq.onrender.com/generate-image?prompt=${encodeURIComponent(prompt)}&modelIndex=${model}&ratio=${ratio}`);
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        const generatedImage = document.getElementById('generated-image');
        generatedImage.src = imageUrl;
        generatedImage.style.display = 'block';
    } catch (error) {
        console.error('Error generating image:', error);
    }
});
