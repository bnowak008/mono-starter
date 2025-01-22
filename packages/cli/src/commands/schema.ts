import { join } from 'path';
import { pascalCase, camelCase } from 'change-case';
import prompts from 'prompts';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

export async function generateSchema(name?: string, options: { force?: boolean } = {}) {
  if (!name) {
    const response = await prompts({
      type: 'text',
      name: 'name',
      message: 'What is the name of your schema?'
    });
    name = response.name;
  }

  if (!name) {
    console.error('Name is required');
    return;
  }

  const pascalName = pascalCase(name);
  const camelName = camelCase(name);
  
  const schemaPath = join(process.cwd(), 'apps/server/src/db/schema');
  const filePath = join(schemaPath, `${camelName}.ts`);

  if (existsSync(filePath) && !options.force) {
    console.error(`Schema ${name} already exists`);
    return;
  }

  // Read the template file
  const templatePath = join(process.cwd(), 'packages/cli/templates/schema.template.ts');
  let schemaContent = readFileSync(templatePath, 'utf-8');

  // Interpolate values into the template
  schemaContent = schemaContent
    .replace(/__pascalName__/g, pascalName)
    .replace(/__camelName__/g, camelName);

  writeFileSync(filePath, schemaContent);
  
  // Update index.ts
  const indexPath = join(schemaPath, 'index.ts');
  const indexContent = `
export * from './${camelName}';
export const schema = {
  ${camelName}: ${pascalName}Table,
  // ... other schemas
};
`;

  // Generate migration
  execSync('bun run db:generate', { stdio: 'inherit' });
  
  console.log(`Generated schema ${name} successfully!`);
}
