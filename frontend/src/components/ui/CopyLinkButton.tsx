import { Button } from "./button";
import { toast } from "sonner";

interface CopyLinkButtonProps {
  url: string;
}

export const CopyLinkButton = ({ url }: CopyLinkButtonProps) => {
  const trimUrl = () => {
    try {
      const newUrl = new URL(url);
      return newUrl.host + newUrl.pathname;
    } catch (error) {
      return url;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy url");
    }
  };

  return (
    <Button
      variant="secondary"
      className="underline underline-offset-4 font-semibold text-xs text-gray-700 decoration-gray-300 px-3"
      onClick={handleCopy}
    >
      {trimUrl()}
    </Button>
  );
};
