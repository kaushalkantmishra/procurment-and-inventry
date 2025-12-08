const rePractical = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export function isValidEmail(email: string) {
  return rePractical.test(email); // swap rePractical for reSimple or reStrict as needed
}
