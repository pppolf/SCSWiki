import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { courseMaterials } from '../docs/.vitepress/materials';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(repoRoot, 'docs', 'public');
const errors: string[] = [];
const seenHrefs = new Set<string>();

for (const [courseKey, course] of Object.entries(courseMaterials)) {
  const expectedDirectory = `/materials/${courseKey}/`;

  if (course.directory !== expectedDirectory) {
    errors.push(`${courseKey}: directory should be ${expectedDirectory}, got ${course.directory}`);
  }

  if (course.categories.length === 0) {
    errors.push(`${courseKey}: categories cannot be empty`);
  }

  for (const category of course.categories) {
    for (const resource of category.resources) {
      if (resource.files.length === 0) {
        errors.push(`${resource.title}: files cannot be empty`);
      }

      for (const file of resource.files) {
        if (!file.href.startsWith(expectedDirectory)) {
          errors.push(
            `${resource.title} / ${file.title}: href must start with ${expectedDirectory}`,
          );
        }

        if (seenHrefs.has(file.href)) {
          errors.push(`${resource.title} / ${file.title}: duplicate href ${file.href}`);
        }
        seenHrefs.add(file.href);

        const filePath = path.join(publicRoot, decodeURI(file.href));
        if (!existsSync(filePath)) {
          errors.push(
            `${resource.title} / ${file.title}: file does not exist at docs/public${decodeURI(
              file.href,
            )}`,
          );
        }

        const extension = path.extname(file.href).slice(1).toUpperCase();
        if (file.format !== extension) {
          errors.push(
            `${resource.title} / ${file.title}: format should be ${extension}, got ${file.format}`,
          );
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Checked ${seenHrefs.size} material files.`);
