document.getElementById('image-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const model = document.getElementById('model').value;
    const ratio = document.getElementById('ratio').value;
    const steps = document.getElementById('steps').value;
    const cfg_scale = document.getElementById('cfg_scale').value;
    const loras = document.getElementById('loras').value;

    const loadingMessage = document.getElementById('loading-message');
    const generatedImage = document.getElementById('generated-image');

    loadingMessage.style.display = 'block';
    generatedImage.style.display = 'none';

    try {
        const response = await fetch('https://zetsdq.onrender.com/generate-image?' + new URLSearchParams({
            prompt,
            modelIndex: model,
            ratio,
            steps,
            cfg_scale,
            loras
        }));
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        generatedImage.src = imageUrl;
        generatedImage.style.display = 'block';
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la génération de l\'image.');
    } finally {
        loadingMessage.style.display = 'none';
    }
});
