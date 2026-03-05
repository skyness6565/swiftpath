import { useEffect } from "react";

const JivoChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.jivosite.com/widget/e8tTGaxiWC";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="jivosite.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default JivoChat;
