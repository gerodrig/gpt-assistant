
export const prosConsStreamUseCase = async (prompt: string) => {

    try {
        const response = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-evaluator-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
            //TODO: abort signal
        });

        if (!response.ok) {
            throw new Error('Pros and cons evaluation failed');
        }

       const reader = response.body?.getReader();

       if(!reader) {
              throw new Error('Pros and cons evaluation failed');
        }

        return reader;

    //    const decoder = new TextDecoder();
    //    let text = '';

    //    // eslint-disable-next-line no-constant-condition
    //    while (true) {
    //        const { done, value } = await reader?.read() as { done: boolean, value: Uint8Array };
    //        if (done) break;
           
    //        const decodedChunk = decoder.decode(value, { stream: true });
    //         text += decodedChunk;
    //         console.log(text);
    //      }
    } catch (error) {
        console.log(error);
        return null;
    }

};