import type { TranslateResponse } from '../../../interfaces';

export async function* translateTextUseCase(prompt: string, language: string, abortSignal?: AbortSignal) {

    
    try {

        const response = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, language, stream: Boolean(abortSignal) }),
            //?: abort signal
            signal: abortSignal
        });

        if(!response.ok) {
            throw new Error('Translation failed');
        }

        //? if no signal is provided, the response will be a json object
        if(!abortSignal) {
            const data = await response.json() as TranslateResponse;
            return {
                ok: true,
                ...data
            }
        }

        //? if a signal is provided, the response will be a stream
        const reader = response.body?.getReader();

        if(!reader) {
            throw new Error('Translation failed');
        }

        const decoder = new TextDecoder();
        let text = '';

        while(true) {
            const { done, value } = await reader?.read() as { done: boolean, value: Uint8Array };
            if(done) break;

            const decodedChunk = decoder.decode(value, { stream: true });
            text += decodedChunk;
            yield text;
        }
        
    } catch (error) {
        console.log(error);

        if(!abortSignal){
            return {
                ok: false,
                message: 'Error translating text'
            }
        }

        return null;
    }
}