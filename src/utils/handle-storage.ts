export const handleStorage = ({
  key,
  value,
}: {
  key: string;
  value?: string;
}) => {
  if (value) {
    localStorage.setItem(key, value);
  }
  return localStorage.getItem(key);
};
