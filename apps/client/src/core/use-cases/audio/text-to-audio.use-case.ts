
export const textToAudioUseCase = async (text: string, voice: string) => {


    try {
        const response = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-speech`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, voice })
        });

        if (!response.ok) {
            throw new Error('Couldn\'t generate audio');
        }

        const audioFile = await response.blob();
        const audioUrl = URL.createObjectURL(audioFile);

        return {
            ok: true,
            message: text,
            audioUrl: audioUrl
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Audio generation failed'
        }
    }
};