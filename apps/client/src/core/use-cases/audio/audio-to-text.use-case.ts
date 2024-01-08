import type { AudioToTextResponse } from '../../../interfaces/audio-to-text.response';

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    if (prompt) formData.append('prompt', prompt);

    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/speech-to-text`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Could not convert audio to text');

    const data = (await response.json()) as AudioToTextResponse;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
