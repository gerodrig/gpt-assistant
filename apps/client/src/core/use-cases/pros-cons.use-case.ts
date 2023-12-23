import { ProsConsResponse } from '../../interfaces';



export const prosConsUseCase = async (prompt: string) => {

    try {
        const response = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-evaluator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Pros and cons evaluation failed');
        }

        const data = await response.json() as ProsConsResponse

        return {
            ok: true,
            ...data
        }
    } catch (error) {
        return {
            ok: false,
            message: 'Pros and cons evaluation failed'
        }
    }

};