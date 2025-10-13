export const isNewProperty = (time: Date) => {
  if (!time) return false;
  const createdAt = new Date(time);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};
