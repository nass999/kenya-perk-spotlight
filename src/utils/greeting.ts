
export const getWelcomeMessage = (name: string = 'User'): string => {
  const time = new Date().getHours();
  
  if (time < 12) return `Good Morning, ${name}`;
  if (time < 18) return `Good Afternoon, ${name}`;
  return `Good Evening, ${name}`;
};
