import { capitalize, lowercaseFirst } from '../utils';

export function generateRouter(entityName: string) {
  const content = `
import { Router } from 'express';
import { ${capitalize(
    entityName
  )}Controller } from '../../../adapter/controllers/${lowercaseFirst(
    entityName
  )}Controller';

export function ${lowercaseFirst(entityName)}Routes(${lowercaseFirst(
    entityName
  )}Controller: ${capitalize(entityName)}Controller): Router {
  const router = Router();

  // Implement routes

  return router;
}
`;
  return content.trim() + '\n';
};

