export function getAuthenticatedUserId(locals: Express.Locals): string {
  const userId = locals.authUserId;

  if (typeof userId !== "string" || userId.length === 0) {
    throw new Error("Authenticated user context is missing or invalid");
  }

  return userId;
}
