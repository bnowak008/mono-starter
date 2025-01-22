import { program } from 'commander';
import { generateSchema } from './commands/schema';
import { generateFeature } from './commands/feature';

program
  .name('mono-cli')
  .description('CLI tools for Mono project generation')
  .version('0.0.1');

program
  .command('generate')
  .alias('g')
  .description('Generate project files')
  .argument('<type>', 'Type of generation (schema|route|service|feature)')
  .argument('[name]', 'Name of the item to generate')
  .option('-f, --force', 'Force overwrite existing files')
  .action(async (type, name, options) => {
    switch (type) {
      case 'schema':
        await generateSchema(name, options);
        break;
      // case 'route':
      //   await generateRoute(name, options);
      //   break;
      // case 'service':
      //   await generateService(name, options);
      //   break;
      case 'feature':
        await generateFeature(name, options);
        break;
      default:
        console.error('Invalid generation type');
    }
  });

program.parse();
