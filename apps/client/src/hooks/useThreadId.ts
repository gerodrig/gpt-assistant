import { useEffect, useState } from "react";
import { createThreadUseCase } from "../core";


export const useThreadId = () => {
    const [threadId, setThreadId] = useState<string>();

    useEffect(() => {
        const threadId = localStorage.getItem('threadId');
        if (threadId){
          setThreadId(threadId) 
        } else {
          createThreadUseCase().then((id) => {
            setThreadId(id);
            localStorage.setItem('threadId', id);
          })
        }
      }, []);

      return {
        threadId,
      };
};