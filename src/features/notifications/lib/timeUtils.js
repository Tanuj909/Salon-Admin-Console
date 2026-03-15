export const formatDistanceToNow = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diff = Math.floor((Date.now() - date) / 1000);

  if (diff < 60)        return "just now";
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;

  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};