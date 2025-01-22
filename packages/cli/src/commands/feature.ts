import { join } from 'path';
import { pascalCase, camelCase } from 'change-case';
import prompts from 'prompts';
import { writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

export async function generateFeature(name?: string, options: { force?: boolean } = {}) {
  if (!name) {
    const response = await prompts({
      type: 'text',
      name: 'name',
      message: 'What is the name of your feature?'
    });
    name = response.name;
  }

  if (!name) {
    console.error('Name is required');
    return;
  }

  const pascalName = pascalCase(name);
  const camelName = camelCase(name);

  // Define paths
  const schemaPath = join(process.cwd(), 'apps/server/src/db/schema');
  const routePath = join(process.cwd(), 'apps/server/src/routes');
  const servicePath = join(process.cwd(), 'apps/server/src/services');
  const templatePath = join(process.cwd(), 'packages/cli/templates');

  // Generate Schema
  const schemaFilePath = join(schemaPath, `${camelName}.ts`);
  if (existsSync(schemaFilePath) && !options.force) {
    console.error(`Schema ${name} already exists`);
    return;
  }

  let schemaContent = readFileSync(join(templatePath, 'schema.template.ts'), 'utf-8');
  schemaContent = schemaContent
    .replace(/__pascalName__/g, pascalName)
    .replace(/__camelName__/g, camelName);
  writeFileSync(schemaFilePath, schemaContent);

  // Generate Migration
  execSync('bun run db:generate', { stdio: 'inherit' });

  // Generate Route
  const routeFilePath = join(routePath, `${camelName}.ts`);
  if (existsSync(routeFilePath) && !options.force) {
    console.error(`Route ${name} already exists`);
    return;
  }

  let routeContent = readFileSync(join(templatePath, 'route.template.ts'), 'utf-8');
  routeContent = routeContent
    .replace(/__pascalName__/g, pascalName)
    .replace(/__camelName__/g, camelName);
  writeFileSync(routeFilePath, routeContent);

  // Generate Service
  const serviceFilePath = join(servicePath, `${camelName}.ts`);
  if (existsSync(serviceFilePath) && !options.force) {
    console.error(`Service ${name} already exists`);
    return;
  }

  let serviceContent = readFileSync(join(templatePath, 'service.template.ts'), 'utf-8');
  serviceContent = serviceContent
    .replace(/__pascalName__/g, pascalName)
    .replace(/__camelName__/g, camelName);
  writeFileSync(serviceFilePath, serviceContent);

  console.log(`Generated feature ${name} successfully!`);
} 