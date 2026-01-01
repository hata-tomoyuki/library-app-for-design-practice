import { capitalize, lowercaseFirst } from "../utils";

export function generateController(entityName: string, useCaseName: string) {
  const content = `
import { Request, Response } from 'express';
import { ${capitalize(
    useCaseName,
  )}UseCaseInterface } from '../../application/usecases/${lowercaseFirst(
    entityName,
  )}/${lowercaseFirst(useCaseName)}UseCaseInterface';
import { ${capitalize(
    useCaseName,
  )}RequestDto } from '../../application/dtos/${entityName}/${useCaseName}RequestDto'

export class ${capitalize(entityName)}Controller {
  constructor(
    private readonly ${lowercaseFirst(useCaseName)}UseCase: ${capitalize(
      useCaseName,
    )}UseCaseInterface
    // Add other useCase propaties as needed
  ) {}

  async ${lowercaseFirst(
    useCaseName,
  )}(req: Request, res: Response): Promise<void> {
    try {
      const requestDto: ${capitalize(useCaseName)}RequestDto = {}
      const ${entityName} = await this.${lowercaseFirst(
        useCaseName,
      )}UseCase.execute(requestDto);

      // Add response status code
      res.status().json(${entityName});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '' });
    }
  }
}
`;
  return content.trim() + "\n";
}

export function generatePrismaRepository(entityName: string) {
  const capitalEntityName = capitalize(entityName);
  const lowercaseEntityName = lowercaseFirst(entityName);

  const repositoryInterfaceClassName = `${capitalEntityName}RepositoryInterface`;
  const repositoryInterfaceFileName = `${lowercaseEntityName}RepositoryInterface`;

  const repositoryClassName = `Prisma${capitalEntityName}Repository`;

  const content = `
import { PrismaClient } from '@prisma/client';
import { ${capitalEntityName} } from '../../domain/entities/${lowercaseEntityName}';
import { ${repositoryInterfaceClassName} } from '../../domain/repositories/${repositoryInterfaceFileName}';

export class ${repositoryClassName} implements ${repositoryInterfaceClassName} {
  constructor(private readonly prisma: PrismaClient) {}

  async create(${lowercaseEntityName}: ${capitalEntityName}): Promise<${capitalEntityName}> {
    const created${capitalize(
      entityName,
    )} = await this.prisma.${lowercaseEntityName}.create({
      data: {
        // Add propaties
      },
    });

    return new ${capitalEntityName}(
      // Add propaties
    );
  }

  async findById(id: string): Promise<${capitalEntityName} | null> {
    const found${capitalEntityName} = await this.prisma.${lowercaseEntityName}.findUnique({
      where: { id },
    });

    if (!found${capitalEntityName}) return null;

    return new ${capitalEntityName}(
      // Add propaties
    );
  }
}
`;
  return content.trim() + "\n";
}
