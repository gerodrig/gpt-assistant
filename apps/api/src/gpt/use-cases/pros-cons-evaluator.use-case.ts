import OpenAI from 'openai';

type Options = {
  prompt: string;
};

export const prosConsEvaluatorUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4', 
    max_tokens: 1500,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `
        You will be presented with a question. Your task is to provide a detailed response that outlines the pros and cons related to the topic of the question. Please structure your response in Markdown format. Ensure that the pros and cons are clearly listed in a bullet-point list.
    
        Here's an example of how you should format your response:
        
        **Question:** [Insert the question here]

        **Answer:**

        ### Pros:
        - Pro 1: [Detail the first advantage]
        - Pro 2: [Detail the second advantage]
        - Pro 3: [Detail further advantages as necessary]

        ### Cons:
        - Con 1: [Detail the first disadvantage]
        - Con 2: [Detail the second disadvantage]
        - Con 3: [Detail further disadvantages as necessary]

        Remember to provide balanced and well-thought-out points for both pros and      cons. Your response should be informative and unbiased, offering a      comprehensive view of the topic.    
    `,
      },
      { role: 'user', content: prompt },
    ],
  });

  const response = completion.choices[0].message.content;

  return {
    message: response,
  };
};
